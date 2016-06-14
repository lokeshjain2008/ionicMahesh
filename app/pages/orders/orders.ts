import {NavController, NavParams} from 'ionic-angular';
import {Component, OnInit} from '@angular/core';
import {FirebaseRef, AngularFire, FirebaseAuth, FirebaseDatabase, FirebaseListObservable, FirebaseListFactory, FirebaseObjectObservable} from 'angularfire2';
import {Loader} from '../../helpers/loader';
import {UserModel, OrderStatusEnum, OrderModel, statusValues} from '../../models'
import {OrderPage} from '../order/order';


@Component({
	templateUrl: "build/pages/orders/orders.html"

})
export class OrdersPage implements OnInit {

	main: FirebaseObjectObservable<any>;
	userData: UserModel;

	orders: FirebaseListObservable<any>;
	userOrders: FirebaseListObservable<any>;
	statusEnum = OrderStatusEnum;
	userMainPath: string;
	userOrdersPath: string;
	userTotalAmount: number;

	constructor(private _nav: NavController,
		private _navParams: NavParams,
		private af: AngularFire
		) {
		this.userData = _navParams.get('userData');
		this.userMainPath = `user-orders/${this.userData.userId}`;
		this.userOrdersPath = `user-orders/${this.userData.userId}/orders`;

	}

	ngOnInit() {

		//orders
    this.main = this.af.database.object(this.userMainPath)
    //create base skeleton to make data valid when we push to the orders
    //ToDo :Create Generic error message if someting bad happens, thats necessory.
    // Even Listen for the Auth expire events.
    this.main.subscribe(data => {
			if (!data) {
				this.main.set({ amount: 0 });
			}
			this.userTotalAmount = data.amount || 0;
    },
			err => console.log(err),
			() => console.log("Done"));
   	//No need for UserData to add will get it. From params.
   	this.userOrders = this.af.database.list(this.userOrdersPath,{query:{
   		limitToLast: 20,
   		orderByKey: true
   	}});
	}

	createOrder(){
		this._nav.push(OrderPage, { userData: this.userData });
	}

	cancelOrder(order) {
		let key = order.$key;
		this.userOrders.remove(order.$key)
		.then(()=>{
			this.af.object(`current-orders/${key}`).remove();
		},()=>{
			console.log("Error happende");
		})

	}

	displayOrderItems(order){
		return order.items.map(item=>item.name)
	}

	completeOrder(order) {
		this.af
			.object(`${this.userOrdersPath}/${order.$key}/status`)
			.set(OrderStatusEnum.complete)
			.then(()=>{
				let newAmount = this.userTotalAmount + order.amount;
				this.main.update({ amount: newAmount});
			})
			.then(()=>{
				this.af.object(`current-orders/${order.$key}`).remove();
			});
	}




}
