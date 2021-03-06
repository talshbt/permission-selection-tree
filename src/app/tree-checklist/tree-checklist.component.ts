import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { PermissionService } from '../permission.service';
import { Status } from './status.enum';
import { Node } from './node';
import { FlatNode } from './flat-node';
import { TreeDatabase } from './tree-database';

export const TREE_FULL_DATA = {
  'Tribe': {
    'a': Status.Has_Permission,
    'b': Status.No_Permission,
    'c': Status.In_Progress,
  }
  ,
  'Mesila': {
    'a': Status.Has_Permission,
    'e': Status.No_Permission,
    'f': Status.No_Permission
  },
  'Rest': {
    'xpRestDevUsersPRD הוספה לקבוצה ': null,
    'a': null,
    'i': null
  },
  'Web Client': {
    'פתיחת פורט 443 לארטיקפטורי': Status.In_Progress,
    'פתיחת בקשת לגישה לביטבאקט (פורט 7999)': Status.Has_Permission,
    'REST פתיחת פורט לשירותי ': Status.No_Permission,
    'Open Port Jenkins - deployment ': Status.Has_Permission,
    'Open Port Jenkins - WEB': Status.Has_Permission,
    'פתיחת קבוצות FW לopenShift': Status.No_Permission,
    'RBI פתיחת PORTS לשימוש ב': Status.Has_Permission,
    'WebX port פתיחת פורט לווב-אקס': Status.Has_Permission

  },
  'Main Frame': {
    'Cook dinner': null,
    'Read the Material Design spec': null,
    'Upgrade Application to Angular': null
  },
  'WSO2': {
    'Cook dinner': null,
    'Read the Material Design spec': null,
    'Upgrade Application to Angular': null
  },
  'Splunk': {
    'Cook dinner': null,
    'Read the Material Design spec': null,
    'Upgrade Application to Angular': null
  },
};


@Component({
  selector: 'app-tree-checklist',
  templateUrl: './tree-checklist.component.html',
  styleUrls: ['./tree-checklist.component.css'],
  providers: [TreeDatabase]

})
export class TreeChecklistComponent implements OnInit {

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<FlatNode, Node>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<Node, FlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: FlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<FlatNode>;

  treeFlattener: MatTreeFlattener<Node, FlatNode>;

  dataSource: MatTreeFlatDataSource<Node, FlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<FlatNode>(true /* multiple */);

  constructor(private _database: TreeDatabase, private permissionService: PermissionService) {

  }


  ngOnInit(): void {

    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this._database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

    this.permissionService.getPermission().subscribe(parentNode => {

      // this.parents.push(parentNode)
      if (this.parents.indexOf(parentNode) == -1) {
        this.parents.push(parentNode);
      } else {
        this.parents.splice(this.parents.indexOf(parentNode), 1)
      }
      //console.log(parentNode);
      const filterTree = this.filterTree()
      this.dataSource.data = this._database.initialize(filterTree);

      this.initSelections();

      // this.dataSource.data = this.database.initialData(permissionData);
    });
  }

  parents = []
  filterTree() {
    let filteredTree = {};

    this.parents.forEach(parent => {

      filteredTree[parent] = TREE_FULL_DATA[parent];
      // console.log(parent)
      // console.log(TREE_DATA[parent])
    })

    return filteredTree;
    //  this.arr = TREE_DATA;

  }

  getLevel = (node: FlatNode) => node.level;

  isExpandable = (node: FlatNode) => node.expandable;

  getChildren = (node: Node): Node[] => node.children;

  hasChild = (_: number, _nodeData: FlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: FlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: Node, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new FlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: FlatNode): void {
    // console.log(node)
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    this.findDup(node)
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: FlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }


  // filterChanged(filterText: string) {
  //   this._database.filter(filterText);
  //   if (filterText) {
  //     this.treeControl.expandAll();
  //   } else {
  //     this.treeControl.collapseAll();
  //   }
  // }

  findDup(selectedNode) {
    const parent = this.getParentNode(selectedNode);

    this.treeControl.dataNodes.forEach(child => {
      if (child.level === 1 && this.getParentNode(child).item !== parent.item && selectedNode.item === child.item) {
        console.log(child)
        this.checklistSelection.toggle(child);
      }
    })
  }
  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  isDisabled(node){
    const parent = this.getParentNode(node);
    return TREE_FULL_DATA[parent.item][node.item] == Status.Has_Permission;
          // const hasPremission = this.getKeyByValue(node.item, Status.Has_Permission);
  }

  getNodeStatus(node){
    const parent = this.getParentNode(node);
    return TREE_FULL_DATA[parent.item][node.item];
  }

  initSelections() {
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      var hasPremission;
      var inProgress;

      if (!!TREE_FULL_DATA[this.treeControl.dataNodes[i].item]) {
       hasPremission = this.getKeyByValue(TREE_FULL_DATA[this.treeControl.dataNodes[i].item], Status.Has_Permission);
        inProgress = this.getKeyByValue(TREE_FULL_DATA[this.treeControl.dataNodes[i].item], Status.In_Progress);

                // console.log('hasPremission ' + hasPremission);
                // console.log('inProgress ' + inProgress);


      }
      if (this.treeControl.dataNodes[i].item == hasPremission || this.treeControl.dataNodes[i].item == inProgress) {
        this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
        this.treeControl.expand(this.treeControl.dataNodes[i])
      }
    }
  }

}