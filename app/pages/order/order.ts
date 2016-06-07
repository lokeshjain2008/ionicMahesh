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
				this.watchOrder();
				return true;
			} else {
				//do some base work.
				this.af.object('orders/' + this.userId).set({
					userId: this.userId,
					totalAmount: 0,
					items: []
				}).then((data) => {
					this.items = this.af.database.list('orders/' + this.userId + '/items');
					this.watchOrder();
				});
			}
    },
			(err) => console.log(err)
		);

	}


	watchOrder(){
		// var test = this.items.scan((acc, item) => {

		// 	return acc + item[0].price;
		// });

		// test.subscribe((totalAmount) => {
		// 	console.log(totalAmount);
		// 	if(totalAmount && this.userId) {
		// 		this.af.object('orders/'+ this.userId+'/totalAmount').update(+totalAmount);
		// 	}

		// },(err)=>console.log(err),
		// ()=>console.log("Done...")
		// );

	}


	addToOrder(item) {
		delete item.$key;
		this.items.push(item).then(data=>console.log(data));

	}




}