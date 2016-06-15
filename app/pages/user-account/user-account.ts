import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';


import {UserModel} from '../../models';
/*
  Generated class for the UserAccountPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/user-account/user-account.html',
})
export class UserAccountPage implements OnInit{
	userData: UserModel;
	userId: string;
	main: FirebaseObjectObservable<any>;
	userAmount: number;

  constructor(public nav: NavController, public params: NavParams, private af: AngularFire ) {
  	this.userData =  params.get('userData');
  }

  ngOnInit(){
		this.userId = this.userData.userId;
		this.main = this.af.object(`user-orders/${this.userId}`);
		this.main.subscribe(data => this.userAmount = data.amount);

  }

  makePayment(payAmount){
		let amount = this.userAmount - (+payAmount);
		this.main.update({ amount });
  }

}
