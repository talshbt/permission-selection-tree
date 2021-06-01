import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoItemFlatNode } from '../todo-item-flat-node';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.css']
})
export class TreeNodeComponent implements OnInit {
  @Input() node;
  @Input() isDisable;
  @Input() isChecked;
  @Output() toggleNode: EventEmitter<TodoItemFlatNode> = new EventEmitter();

  constructor() {}

  ngOnInit() {
    console.log(this.node);
  }
  onToggleNode(node: TodoItemFlatNode): void {
    this.toggleNode.emit(node);
    // this.checklistSelection.toggle(node);
    // this.findDup(node)
    // this.checkAllParentsSelection(node);
  }
  // todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {

  //   this.checklistSelection.toggle(node);
  //   this.findDup(node)
  //   this.checkAllParentsSelection(node);
  // }
}
