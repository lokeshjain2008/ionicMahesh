import {Page, NavController, NavParams} from 'ionic-angular';
import { OnInit} from '@angular/core';
import {FirebaseRef, AngularFire, FirebaseAuth, FirebaseDatabase, FirebaseListObservable, FirebaseListFactory, FirebaseObjectObservable} from 'angularfire2';

@Page({
	templateUrl: "build/pages/order/order.html"
})
export class OrderPage implements OnInit{

	order: FirebaseObjectObservable<any>;
	userId: string;
	menu: FirebaseListObservable<any>;

	constructor(private _nav: NavController, private _navParams: NavParams,
		private af: AngularFire

		){

		this.userId = _navParams.get('userId');
	}

	ngOnInit(){
		this.menu = this.af.list('menu');
    this.order = this.af.object('orders/' + this.userId);
    this.order.subscribe((data)=>{
    	if(data) {
				return true;
    	} else{
    		//do some base work.
    		this.af.object('orders/'+this.userId).set({
    			userId: this.userId,
    			totalAmount: 0,
    			items: []
    		})
    	}
    },
    	(err)=> console.log(err)
    	)
	}

}