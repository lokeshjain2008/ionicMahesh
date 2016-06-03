import {Modal, NavController, Page, ViewController} from 'ionic-angular';
import {OnInit} from '@angular/core';
//Note ViewController is used when there  is modal, alert there to dismiss the view.
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Page({
    templateUrl: 'build/pages/menu/menu.html',

})
export class MenuPage implements OnInit{
    menuItems: FirebaseListObservable<Object>;

    constructor(private nav: NavController, private af: AngularFire){

    }

    ngOnInit(){
        this.menuItems = this.af.database.list('/menu');
    }

   addTheItem(item){
       this.menuItems.push(item);
   }


}