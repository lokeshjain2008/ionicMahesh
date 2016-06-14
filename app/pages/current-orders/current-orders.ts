import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavController} from 'ionic-angular';

import {AngularFire, FirebaseListObservable, FirebaseRef} from 'angularfire2';

import { statusValues, OrderStatusEnum } from '../../models';


/*
  Generated class for the CurrentOrdersPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/current-orders/current-orders.html',
})
export class CurrentOrdersPage implements OnInit {

	statusValues = statusValues();
	orders: FirebaseListObservable<any>;

  constructor(public nav: NavController, private af: AngularFire) { }

  ngOnInit() {
		this.orders = this.af.list('current-orders');
  }

  displayOrderItems(order) {
		return order.items.map(item => item.name)
	}

	changeOrderStatus(order, status) {
		order.status = +status;
		if (order.status === OrderStatusEnum.complete) {

			this.orders.remove(order.$key)
				.then(() => {
					this.af.object(`user-orders/${order.userId}/orders/${order.$key}/status`)
						.set(order.status)
						.then(() => {
							let subscription = this.af.object(`user-orders/${order.userId}/amount`)
								.subscribe(amount => {
									let totalAmount = amount + order.amount;
									subscription.unsubscribe();
									this.af.object(`user-orders/${order.userId}/amount`).set(totalAmount);
								});
						});

				});
		}
		else if (order.status === OrderStatusEnum.paid) {
			this.orders.remove(order.$key)
				.then(() => {
					this.af.object(`user-orders/${order.userId}/orders/${order.$key}/status`).set(order.status);
				});
		} else { //processing or can delete ???
			let key = order.$key;
			delete order.$key;
			this.orders.update(`${key}`, order)
				.then(() => {
					this.af.object(`user-orders/${order.userId}/orders/${key}/status`).set(order.status);
				});

		}

	}



}
