import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.css']
})
export class TreeNodeComponent implements OnInit {
  @Input() node;
  @Input() isDisable;
  @Input() isChecked;

  constructor() {}

  ngOnInit() {
    console.log(this.node);
  }

  // todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {

  //   this.checklistSelection.toggle(node);
  //   this.findDup(node)
  //   this.checkAllParentsSelection(node);
  // }
}
