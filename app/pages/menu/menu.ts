import {Modal, NavController, Page, ViewController} from 'ionic-angular';
import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/common';

import {MenuModel} from '../../models';
//directives
import {MenuItem} from '../../components/menu-item/menu-item';

//Note ViewController is used when there  is modal, alert there to dismiss the view.
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  templateUrl: 'build/pages/menu/menu.html',
  directives: [MenuItem]
})
export class MenuPage implements OnInit {
  menuItems: FirebaseListObservable<Object>;
  newItem: MenuModel = new MenuModel; //ignore for now, don't how to set this here. error is valid

  constructor(private nav: NavController, private af: AngularFire) {

  }

  ngOnInit() {
    this.menuItems = this.af.database.list('/menu');
  }

  addTheItem(itemForm: NgForm) {
    let item = itemForm.value;
    item.price = +item.price; // Price should be integer
    this.menuItems.push(item);
    this.resetForm(itemForm);
  }

  addUsingObject(){
    this.newItem.price = +this.newItem.price;
    //This can be used to create new or update the menu Item.
    if(this.newItem.$key) {
      let key = this.newItem.$key;
      delete this.newItem.$key;
      this.menuItems.update( key, this.newItem);
    }else{
      this.menuItems.push(this.newItem);
    }

    this.newItem = new MenuModel;
  }

  resetForm(itemF: NgForm){
    var fields = Object.keys(itemF.controls);
    fields.forEach((f)=>{
      itemF.controls[f].updateValue(null);
      itemF.controls[f].setErrors(null);
    })
  }

  changeAvailibility(event: Event,item: MenuModel){
    item.available = !item.available;
    this.newItem = item;
    this.addUsingObject();// will update hurra!!!
  }

  editItem(item){
    this.newItem = item;
  }

  deleteItem(item){
    this.menuItems.remove(item.$key);
  }

  buttonText(item){
    return item.$key !=null ? "Update Menu Item" : 'Add new menu Item'
  }

  cancelItem(event: Event) {
    event.preventDefault();
    this.newItem = new MenuModel();
  }


}
