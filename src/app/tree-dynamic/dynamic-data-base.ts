import { Injectable, OnInit } from '@angular/core';
import { PermissionService } from '../permission.service';
import { DynamicFlatNode } from './dynamic-flat-node';

@Injectable({ providedIn: 'root' })
export class DynamicDatabase implements OnInit {
  ngOnInit(): void {}

  constructor(private permissionService: PermissionService) {}
  // dataMap = new Map<string, string[]>([
  //   ['Tribe', ['a', 'b', 'c']],
  //   ['Mesila', ['e', 'f', 'g']],
  //   ['Rest', ['h', 'i']],
  //   ['Web Client', ['j', 'k', 'l']]
  // ]);

  dataMap = new Map<string, { name: string; status: string; isDuplicate }[]>([
    [
      'Tribe',
      [
        { name: 'a', status: 'success', isDuplicate: false },
        { name: 'b', status: 'success', isDuplicate: false },
        { name: 'c', status: 'success', isDuplicate: false }
      ]
    ],
    [
      'Mesila',
      [
        { name: 'd', status: 'success', isDuplicate: false },
        { name: 'a', status: 'success', isDuplicate: false },
        { name: 'f', status: 'success', isDuplicate: false }
      ]
    ]
  ]);

  //rootLevelNodes: string[] = ['Tribe', 'Mesila', 'Rest'];
  rootLevelNodes: string[] = [];

  // childArray = ['Tribe', 'Mesila'];

  /** Initial data from database */
  initialData(permissionData): DynamicFlatNode[] {
    // console.log(this.dataMap);
    this.rootLevelNodes = permissionData;
    this.findChild({ name: 'a', status: 'success', isDuplicate: false });

    this.rootLevelNodes.forEach(parent => {});
    return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
  }

  getChildren(parent: string) {
    return this.dataMap.get(parent);
  }

  // addNode(newNode) {
  //   // console.log(x);
  //   this.rootLevelNodes.push(newNode.name);
  //   //  console.log(this.rootLevelNodes);
  // }

  isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }

  findChild(node) {
    let childArr = [];
    this.rootLevelNodes.forEach(parent => {
      let currentChildren = this.dataMap.get(parent);
      currentChildren.forEach(x => {
        let ind = childArr.indexOf(x.name);
        x.isDuplicate = ind !== -1;

        // console.log(ind);
        // (node.isDuplicate = x.name == node.name)
        // console.log(x);
        childArr.push(x.name);
      });
    });
  }
}
