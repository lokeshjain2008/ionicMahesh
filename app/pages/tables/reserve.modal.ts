import {Page, ViewController, NavParams} from 'ionic-angular';
import {Table} from './table';

@Page({
  template: `
  <ion-content padding>
    <ion-card>
      <ion-card-header>
        {{table.name}} Reservation Confirmed
      </ion-card-header>
      <ion-card-content>
        Reservation of {{table.name}} is confirmed which can be occupied by {{table.chairs.length}} people.
      </ion-card-content>
      <button light round small (click)="close()" item-right>Close</button>
    </ion-card>
  </ion-content>
  `,
  styles:[ `
    ion-content {
      text-align: center;
    };
    ion-card-content {
      color: #343434
    };
  `]
})

export class ReserveTableModal {
  
  table:Table;
  
  constructor(
    private viewCtrl: ViewController,
    private params: NavParams) {
      this.table = params.data;
    }

  close() {
    this.viewCtrl.dismiss();
  }
}