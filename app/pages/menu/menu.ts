import {Modal, NavController, Page, ViewController} from 'ionic-angular';
import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/common';

import {MenuModel} from '../../models';

//Note ViewController is used when there  is modal, alert there to dismiss the view.
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  templateUrl: 'build/pages/menu/menu.html'
})
export class MenuPage implements OnInit {
  menuItems: FirebaseListObservable<Object>;
  newItem: MenuModel = {}; //ignore for now, don't how to set this here. error is valid

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
    console.log(this.newItem);
    this.newItem.price = +this.newItem.price;
    this.menuItems.push(this.newItem);
    //this.newItem = {};
  }

  resetForm(itemF: NgForm){
    var fields = Object.keys(itemF.controls);
    fields.forEach((f)=>{
      itemF.controls[f].updateValue(null);
      itemF.controls[f].setErrors(null);
    })
  }

  changeAvailibility(item){
    //Add availibity boolean to the data type
    console.log("Availibility..");
  }

  editItem(item){
    console.log("editing...");
  }

  delteItem(item){
    this.menuItems.remove(item.$key);
  }


}