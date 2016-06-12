import {Component, Input,Output, EventEmitter, OnInit} from '@angular/core';

/*
  Generated class for the MenuItem component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'menu-item',
  templateUrl: 'build/components/menu-item/menu-item.html'
})
export class MenuItem{
  @Input() item;
  @Input() isFather: Boolean;

  //related to Cart
  @Input() inCart: Boolean;
  //Output events
  @Output() availItem = new EventEmitter();
  @Output() editItem = new EventEmitter();
  @Output() deleteItem = new EventEmitter();

  @Output() addItem = new EventEmitter();
  @Output() removeItem = new EventEmitter();
  @Output() orderItemIndex = new EventEmitter();

}
