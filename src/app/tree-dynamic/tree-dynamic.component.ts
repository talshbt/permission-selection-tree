import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../permission.service';
import { DynamicDatabase } from './dynamic-data-base';
import { DynamicDataSource } from './dynamic-data-source';
import { DynamicFlatNode } from './dynamic-flat-node';

@Component({
  selector: 'app-tree-dynamic',
  templateUrl: './tree-dynamic.component.html',
  styleUrls: ['./tree-dynamic.component.css']
})
export class TreeDynamicComponent implements OnInit {
  constructor(
    private database: DynamicDatabase,
    private permissionService: PermissionService
  ) {}
  ngOnInit(): void {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new DynamicDataSource(this.treeControl, this.database);
    this.dataSource.data = this.database.initialData(['Tribe', 'Mesila']);

    this.permissionService.getPermission().subscribe(permissionData => {
      this.dataSource.data = this.database.initialData(permissionData);
    });
  }

  checklistSelection = new SelectionModel<DynamicFlatNode>(true /* multiple */);

  todoLeafItemSelectionToggle(node: DynamicFlatNode): void {
    this.onGetAll(node);

    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }
  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  checkAllParentsSelection(node: DynamicFlatNode): void {
    let parent: DynamicFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: DynamicFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);

    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: DynamicFlatNode): DynamicFlatNode | null {
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

  descendantsAllSelected(node: DynamicFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);

    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  descendantsPartiallySelected(node: DynamicFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );

    return result && !this.descendantsAllSelected(node);
  }

  todoItemSelectionToggle(node: DynamicFlatNode): void {
    this.checklistSelection.toggle(node);
    //console.log(node);
    const descendants = this.treeControl.getDescendants(node);

    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  onGetAll(selectedNode) {
    const parent = this.getParentNode(selectedNode);
    this.dataSource.data.forEach(node => {
      const descendants = this.treeControl.getDescendants(node);
      if (descendants.length && parent.item !== node.item) {
        descendants.forEach(child => {
          if (child.item === selectedNode.item) {
            this.checklistSelection.toggle(child);
          }
        });
      }
    });
  }
}
