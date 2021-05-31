import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FILTER_TREE_DATA } from './filter-tree';
import { FilterTreeItemNode } from './filter-tree-item-node';

@Injectable({ providedIn: 'root' })
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<FilterTreeItemNode[]>([]);
  treeData: any[];
  get data(): FilterTreeItemNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    this.treeData = FILTER_TREE_DATA;
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(FILTER_TREE_DATA, '0');
    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */

  buildFileTree(obj: any[], level: string): FilterTreeItemNode[] {
    return obj
      .filter(
        o =>
          (<string>o.code).startsWith(level + '.') &&
          (o.code.match(/\./g) || []).length ===
            (level.match(/\./g) || []).length + 1
      )
      .map(o => {
        const node = new FilterTreeItemNode();
        node.item = o.text;
        node.code = o.code;
        const children = obj.filter(so =>
          (<string>so.code).startsWith(level + '.')
        );
        if (children && children.length > 0) {
          node.children = this.buildFileTree(children, o.code);
        }
        return node;
      });
  }

  public filter(filterText: string) {
    let filteredTreeData;
    if (filterText) {
      console.log(this.treeData);
      filteredTreeData = this.treeData.filter(
        d =>
          d.text.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) >
          -1
      );
      Object.assign([], filteredTreeData).forEach(ftd => {
        let str = <string>ftd.code;
        while (str.lastIndexOf('.') > -1) {
          const index = str.lastIndexOf('.');
          str = str.substring(0, index);
          if (filteredTreeData.findIndex(t => t.code === str) === -1) {
            const obj = this.treeData.find(d => d.code === str);
            if (obj) {
              filteredTreeData.push(obj);
            }
          }
        }
      });
    } else {
      filteredTreeData = this.treeData;
    }

    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    // file node as children.
    const data = this.buildFileTree(filteredTreeData, '0');
    // Notify the change.
    this.dataChange.next(data);
  }
}
