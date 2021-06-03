import { Injectable, OnInit } from '@angular/core';
import { PermissionService } from '../permission.service';

// export class FlatNode {
//   item: string;
//   level: number;
//   expandable: boolean;
// }
export class FlatNode {
  constructor(
    public item: string,
    public level: number,
    public expandable: boolean
  ) {}
}
