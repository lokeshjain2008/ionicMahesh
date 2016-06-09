import {Page, NavController, NavParams} from 'ionic-angular';
import { OnInit} from '@angular/core';
import {FirebaseRef, AngularFire, FirebaseAuth, FirebaseDatabase, FirebaseListObservable, FirebaseListFactory, FirebaseObjectObservable} from 'angularfire2';

import 'rxjs/Rx';

@Page({
	templateUrl: "build/pages/order/order.html"
})
export class OrderPage implements OnInit {

	order: FirebaseObjectObservable<any>;
	userId: string;
	menu: FirebaseListObservable<any>;
	items: FirebaseListObservable<any>;

	constructor(private _nav: NavController, private _navParams: NavParams,
		private af: AngularFire

		) {

		this.userId = _navParams.get('userId');
	}

	ngOnInit() {
		this.menu = this.af.list('menu');
    this.order = this.af.database.object('orders/' + this.userId);
    this.order.subscribe((data) => {
			if (data) {
				this.items = this.af.database.list('orders/' + this.userId + '/items');
				return true;
			} else {
				//do some base work.
				this.af.object('orders/' + this.userId).set({
					userId: this.userId,
					totalAmount: 0,
					items: []
				}).then((data) => {
					this.items = this.af.database.list('orders/' + this.userId + '/items');
				});
			}
    },
			(err) => console.log(err)
		);

	}


	calculateOrderAmount(){
		this.af.list('orders/' + this.userId + '/items').subscribe((items) => {
			let totalAmount = items.reduce((acc, item) => { return acc + item.price; }, 0)
			console.log(totalAmount);
			this.af.object('/orders/' + this.userId + '/totalAmount').set(totalAmount);
		})

	}


	addToOrder(item) {
		delete item.$key; // needed, to satify the data structure.
		this.items.push(item).then(data =>{ //If item is then calculate the amount
			this.calculateOrderAmount();
		});
	}




}