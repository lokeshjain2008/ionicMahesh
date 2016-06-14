import {Alert, Loading, NavController} from 'ionic-angular';

import { Component} from '@angular/core';
import {HomePage} from '../home/home';
import { MenuPage }  from '../menu/menu';

import {OrderPage} from  '../order/order';


import {UsersPage} from '../users/users';

import {CurrentOrdersPage} from '../current-orders/current-orders';

@Component({
  templateUrl: 'build/pages/getting-started/getting-started.html'
})

export class GettingStartedPage {
  constructor(private nav: NavController) {

  }


  //loaders
  showLoading(){
    let loader =  Loading.create({
        content: "Hello",
        dismissOnPageChange: true,
        duration: 3200
    });
    this.nav.present(loader);

  }


  gotoHomePage(){
      this.nav.push(HomePage);
  }


  gotoMenuPage(){
      this.nav.push(MenuPage);
  }

  gotoCurerentOrdresPage(){
    this.nav.push(CurrentOrdersPage);
  }

  gotoUsersPage(){
     this.nav.push(UsersPage);
  }

}
