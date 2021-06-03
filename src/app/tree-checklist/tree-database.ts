import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PermissionService } from '../permission.service';
import { FlatNode } from './flat-node';
import { Node } from './node';
// import { TREE_DATA } from './tree-data';

@Injectable({ providedIn: 'root' })
export class TreeDatabase {
  treeData = [];
  dataChange = new BehaviorSubject<Node[]>([]);

  get data(): Node[] {
    return this.dataChange.value;
  }

  constructor() {
    //this.initialize();
  }

  initialize(permissionData) {
    return this.buildFileTree(permissionData, 0);
  }

  rootLevelNodes: string[] = [];

  /** Initial data from database */
  initialData(permissionData): FlatNode[] {
    this.rootLevelNodes = permissionData;
    return this.rootLevelNodes.map(name => new FlatNode(name, 0, true));
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): Node[] {
    return Object.keys(obj).reduce<Node[]>((accumulator, key) => {
      const value = obj[key];
      const node = new Node();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.hasPermission = true;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}
