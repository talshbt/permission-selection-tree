import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Status } from '../status.enum';
import { TodoItemFlatNode } from '../todo-item-flat-node';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.css']
})
export class TreeNodeComponent implements OnInit {
  @Input() node;
  @Input() isChecked;
  @Input() status;
  @Output() toggleNode: EventEmitter<TodoItemFlatNode> = new EventEmitter();
  type = Status;
  isDisable;

  constructor() {}

  ngOnInit() {
    this.isDisable = this.status === Status.Has_Permission;
  }

  onToggleNode(node: TodoItemFlatNode): void {
    this.toggleNode.emit(node);
  }
}
