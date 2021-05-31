import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PermissionService } from '../permission.service';
import { TodoItemFlatNode } from './todo-item-flat-node';
import { TodoItemNode } from './todo-item-node';
// import { TREE_DATA } from './tree-data';

export const TREE_DATA = {
  Tribe: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry'],
      Orange: null
    }
  },
  Mesila: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
};

@Injectable({ providedIn: 'root' })
export class ChecklistDatabase {
  treeData = [];
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor() {
    //this.initialize();
  }

  initialize(permissionData) {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    return this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    // this.dataChange.next(data);
  }

  rootLevelNodes: string[] = [];

  /** Initial data from database */
  initialData(permissionData): TodoItemFlatNode[] {
    this.rootLevelNodes = permissionData;
    return this.rootLevelNodes.map(name => new TodoItemFlatNode(name, 0, true));
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}
