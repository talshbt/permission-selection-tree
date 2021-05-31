import { Injectable, OnInit } from '@angular/core';
import { PermissionService } from '../permission.service';

// export class TodoItemFlatNode {
//   item: string;
//   level: number;
//   expandable: boolean;
// }
export class TodoItemFlatNode {
  constructor(
    public item: string,
    public level: number,
    public expandable: boolean
  ) {}
}
