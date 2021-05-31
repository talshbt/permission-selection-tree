import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { PermissionService } from '../permission.service';
import { ChecklistDatabase } from './check-list-database';
import { TodoItemFlatNode } from './todo-item-flat-node';
import { TodoItemNode } from './todo-item-node';

export const TREE_FULL_DATA = {
  'Tribe': {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null
  },
  'Mesila': {
    'Cook dinner':null,
    'Read the Material Design spec':null,
    'Upgrade Application to Angular':null
  },
   'Rest': {
    'Cook dinner':null,
    'Read the Material Design spec':null,
    'Upgrade Application to Angular':null
  },
   'Web Client': {
    'Cook dinner':null,
    'Read the Material Design spec':null,
    'Upgrade Application to Angular':null
  },
     'Main Frame': {
    'Cook dinner':null,
    'Read the Material Design spec':null,
    'Upgrade Application to Angular':null
  },
    'WSO2': {
    'Cook dinner':null,
    'Read the Material Design spec':null,
    'Upgrade Application to Angular':null
  },
    'Splunk': {
    'Cook dinner':null,
    'Read the Material Design spec':null,
    'Upgrade Application to Angular':null
  },
};


@Component({
  selector: 'app-tree-checklist',
  templateUrl: './tree-checklist.component.html',
  styleUrls: ['./tree-checklist.component.css'],
  providers: [ChecklistDatabase]

})
export class TreeChecklistComponent implements OnInit {

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  constructor(private _database: ChecklistDatabase,  private permissionService: PermissionService) {
    
  }
ngOnInit(): void {

  this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this._database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

      this.permissionService.getPermission().subscribe(parentNode => {

        // this.parents.push(parentNode)
        if (this.parents.indexOf(parentNode) == -1) {
          this.parents.push(parentNode);
        }else{
          this.parents.splice(this.parents.indexOf(parentNode),1)
        }
        //console.log(parentNode);
        this.dataSource.data = this._database.initialize(this.filterTree());

      // this.dataSource.data = this.database.initialData(permissionData);
    });
}

parents = []
filterTree(){
  let filteredTree = {};

  this.parents.forEach(parent=>{
   
    filteredTree[parent] = TREE_FULL_DATA[parent];
    // console.log(parent)
      // console.log(TREE_DATA[parent])
  })

  return filteredTree;
//  this.arr = TREE_DATA;

}

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
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
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
       console.log(node)
this.findDup(node)
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
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
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
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
    this.dataSource.data.forEach(node => {
        const descendants = this.treeControl.getDescendants(node);
        console.log(node)


      // if (descendants.length && parent.item !== node.item) {
      //   descendants.forEach(child => {
      //     if (child.item === selectedNode.item) {
      //       this.checklistSelection.toggle(child);
      //     }
      //   });
      // }
    });
  }

}