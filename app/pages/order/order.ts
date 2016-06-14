import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, Toast} from 'ionic-angular';

import {UserModel, OrderStatusEnum, OrderModel, statusValues} from '../../models'
import {MenuItem} from '../../components/menu-item/menu-item';
import {FirebaseRef, AngularFire, FirebaseAuth, FirebaseDatabase, FirebaseListObservable, FirebaseListFactory, FirebaseObjectObservable} from 'angularfire2';

@Component({
  templateUrl: 'build/pages/order/order.html',
  directives: [MenuItem]
})
export class OrderPage implements OnInit{

	userData: UserModel;
	menu: FirebaseListObservable<any>;
	orders: FirebaseListObservable<any>;
	userOrders: FirebaseListObservable<any>;
	order: OrderModel = { items: [], amount: 0, status: OrderStatusEnum.created };

  constructor(public nav: NavController,
		private navParams: NavParams,
		private af: AngularFire
  	) {
		this.userData = navParams.get('userData');
  }

  ngOnInit(){
		this.menu = this.af.list('menu', {
			query: {
				orderByChild: 'available',
				equalTo: true
			}
		});

		this.userOrders = this.af.list(`user-orders/${this.userData.userId}/orders`);
	}

	private _calculateOrderAmount():void {
    this.order.amount = this.order.items.reduce((acc, item): number => { return acc + item.price }, 0);
  }

	addToOrder(item) {
		delete item.$key; // needed, to satify the data structure.
		this.order.items.push(item);
    this._calculateOrderAmount();
	}

	removeOrderItem(indexCount) {
    this.order.items.splice(indexCount, 1);
    this._calculateOrderAmount();
  }

  pushOrder() {
		if (this.order.amount) {
			this.userOrders.push(this.order).then((order) => {
				//write Into current Order
				order.once('value', (snap) => {
					let orderValue = snap.val();
					orderValue.user = this.userData;
					orderValue.userId = this.userData.userId;
					this.af.object(`current-orders/${snap.key()}`).set(orderValue);

				}).then((data) => {
					let toast = Toast.create({
						message: 'Order was added successfully',
						duration: 1200
					});

					toast.onDismiss(() => {
						this.nav.pop();
					});
					this.nav.present(toast);
				});
			});
		}
	}


}
