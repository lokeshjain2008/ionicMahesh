import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, Toast} from 'ionic-angular';

import {UserModel, OrderStatusEnum, OrderModel, statusValues} from '../../models'
import {MenuItem} from '../../components/menu-item/menu-item';
import {FirebaseRef, AngularFire, FirebaseAuth, FirebaseDatabase, FirebaseListObservable, FirebaseListFactory, FirebaseObjectObservable} from 'angularfire2';

import {OrderPage} from '../order/order';
import 'rxjs/Rx';

/*
  Generated class for the UsersPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/users/users.html',
})
export class UsersPage {
	users: FirebaseListObservable<any>;


  constructor(public nav: NavController, private af: AngularFire) {
  }

  ngOnInit(){
		this.users = this.af.list('users');
	}

	createUserOrder(user){
		this.nav.push(OrderPage, { userData: user });
	}


}
