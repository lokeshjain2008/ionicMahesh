import {NavController, NavParams} from 'ionic-angular';
import {Component ,OnInit} from '@angular/core';
import {FirebaseRef, AngularFire, FirebaseAuth, FirebaseDatabase, FirebaseListObservable, FirebaseListFactory, FirebaseObjectObservable} from 'angularfire2';

import 'rxjs/Rx';

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
	order: OrderModel = { items: [], amount: 0, orderStatus: OrderStatusEnum.created };


	userMainPath: string;
	userOrdersPath: string;

	constructor(private _nav: NavController, private _navParams: NavParams,
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
    // .subscribe(data=>console.log(data));
   	//No need for UserData to add will get it. From params.
   	this.userOrders = this.af.database.list(this.userOrdersPath);
	}


	calculateOrderAmount(){
		this.af.list('orders/' + this.userData.userId + '/items').subscribe((items) => {
			let totalAmount = items.reduce((acc, item) => { return acc + item.price; }, 0)

			this.af.object('/orders/' + this.userData.userId + '/totalAmount').set(totalAmount);
		})

	}


	addToOrder(item) {
		delete item.$key; // needed, to satify the data structure.
		this.order.items.push(item);
		this.order.amount = this.order.items.reduce((acc, item):number => {return acc + item.price}, 0);

	}

	pushOrder(){
		if(this.order.amount) {
			this.userOrders.push(this.order);
		}
	}

	processingOrder(order){
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