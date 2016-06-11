import {NavController, NavParams} from 'ionic-angular';
import {Component, OnInit} from '@angular/core';
import {FirebaseRef, AngularFire, FirebaseAuth, FirebaseDatabase, FirebaseListObservable, FirebaseListFactory, FirebaseObjectObservable} from 'angularfire2';

import 'rxjs/Rx';

import {Loader} from '../../helpers/loader';
import {UserModel, OrderStatusEnum, OrderModel} from '../../models'


@Component({
	templateUrl: "build/pages/order/order.html"
})
export class OrderPage implements OnInit {

	main: FirebaseObjectObservable<any>;
	userData: UserModel;
	menu: FirebaseListObservable<any>;
	orders: FirebaseListObservable<any>;
	userOrders: FirebaseListObservable<any>;
	order: OrderModel = { items: [], amount: 0, status: OrderStatusEnum.created };
	loader: any;

	userMainPath: string;
	userOrdersPath: string;

	constructor(private _nav: NavController,
		private _navParams: NavParams,
		private af: AngularFire
		) {
		this.userData = _navParams.get('userData');
		this.userMainPath = `user-orders/${this.userData.userId}`;
		this.userOrdersPath = `user-orders/${this.userData.userId}/orders`;

	}

	ngOnInit() {
		//Get menu
		this.menu = this.af.list('menu');
		//orders
    this.main = this.af.database.object(this.userMainPath)
    //create base skeleton to make data valid when we push to the orders
    //ToDo :Create Generic error message if someting bad happens, thats necessory.
    // Even Listen for the Auth expire events.
    this.main.subscribe(data => {
			console.log(data);
			if (!data) {
				this.main.set({ amount: 0 });
			}
    },
			err => console.log(err),
			() => console.log("Done"));
   	//No need for UserData to add will get it. From params.
   	this.userOrders = this.af.database.list(this.userOrdersPath);
	}


	calculateOrderAmount() {
		this.af.list('orders/' + this.userData.userId + '/items').subscribe((items) => {
			let totalAmount = items.reduce((acc, item) => { return acc + item.price; }, 0)
			this.af.object('/orders/' + this.userData.userId + '/totalAmount').set(totalAmount);
		})

	}


	addToOrder(item) {
		delete item.$key; // needed, to satify the data structure.
		this.order.items.push(item);
		this.order.amount = this.order.items.reduce((acc, item): number => { return acc + item.price }, 0);

	}

	pushOrder() {
		if (this.order.amount) {
			this.userOrders.push(this.order).then((order) => {
				//write Into current Order
				order.once('value',(snap)=>{
					this.af.object(`current-orders/${snap.key()}`).set(snap.val());
				})
				.then((data)=>{
					//Now reset some of the data and create other phase.
					console.log(data);
				})
			});
		}
	}

	processingOrder(order) {
		this.af
			.object(`${this.userOrdersPath}/${order.$key}/orderStatus`)
			.set(OrderStatusEnum.Processing);
	}

	completeOrder(order) {
		this.af
			.object(`${this.userOrdersPath}/${order.$key}/orderStatus`)
			.set(OrderStatusEnum.complete);
	}



}