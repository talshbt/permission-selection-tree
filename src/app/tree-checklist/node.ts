import { Injectable } from '@angular/core';

// @Injectable({ providedIn: 'root' })
export class Node {
  children: Node[];
  item: string;
  hasPermission: boolean;
}
