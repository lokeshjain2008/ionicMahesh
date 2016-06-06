import {Page, NavController, NavParams} from 'ionic-angular';
import { OnInit} from '@angular/core';
import {FirebaseRef, AngularFire, FirebaseAuth, FirebaseDatabase, FirebaseListObservable, FirebaseListFactory, FirebaseObjectObservable} from 'angularfire2';

@Page({
	templateUrl: "build/pages/order/order.html"
})
export class OrderPage implements OnInit{

	order: FirebaseObjectObservable<any>;
	userId: string

	constructor(private _nav: NavController, private _navParams: NavParams,
		private af: AngularFire,
		private ref: FirebaseRef
		){

		this.userId = _navParams.get('userId');
	}

	ngOnInit(){
    this.order = this.af.object('orders/' + this.userId);
    this.order.subscribe((data)=>console.log(data),
    	(err)=> console.log(err)
    	)
	}

}