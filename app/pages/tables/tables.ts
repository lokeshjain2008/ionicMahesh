import {NavController, Modal } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseAuth } from 'angularfire2';
import {OnInit,Component} from '@angular/core';

import {LoginPage} from '../login/login'
import {Table} from './table';
import {UserModel} from '../../models';

import {Reservation} from './reservation';
import {ReserveTableModal} from './reserve.modal';


@Component({
  templateUrl: 'build/pages/tables/tables.html',
  styles: [`
    ion-avatar > ion-icon {
      font-size: 2em;
    }
    ion-icon.person {
      font-size: 1.5em;
      padding: 1px;
      background: greenyellow;
    }
    div.spinner {
      margin: auto;
      position: absolute;
      top: 0; left: 0; bottom: 0; right: 0;
      height: 185px;
      text-align: center;
    }
    .spinner svg {
      width: 50% !important;
      height: 185px !important;
    }
  `]
})
export class TablesPage implements OnInit{
  selectedTable: any;
  tables: Array<Table>;
  reservations: Array<Reservation>;
  showSpinner: boolean;
  userData: UserModel;
  authInfo:any;

  constructor(private nav: NavController, public afb: AngularFire,
              public auth: FirebaseAuth) {
    this.tables = [];
  }

  ngOnInit(){
    // Loading.
    this.showSpinner = true;

    // Authentication
    this.auth.subscribe((data) => {
        console.log("in auth subscribe", data)
        if (data) {
          this.authInfo = data.google;
          this.authInfo.userId = data.uid;
          this.authInfo.displayName = data.google.displayName;
          //Create user to save into database
          // this.userData = {
          //     email: data.google.email,
          //     displayName: data.google.displayName,
          //     userId: data.google.userId,
          //     profileImageURL: data.google.profileImageURL,
          // };

          // this.ref.child("users").child(data.uid).update(this.userData);

        } else {
            this.authInfo = null
            this.displayLoginModal()
        }
    })

    this.afb.database.list('/reservations').subscribe((data) => {
      this.reservations = data;
    });

    this.afb.database.list('/tables').subscribe((data) => {
      this.tables = data;
      this.showSpinner = false;
    });

  }

  reservationStatus(table){
    let status = '';
    let rElement = this.reservations.filter((rElement) => {
      return table.name === rElement.table;
    })[0];

    if (rElement) {
      status = `Reserved By ${rElement.person}`;
    }

    return status;
  }

  istableAvailable(table){
    let filteredElement;
    filteredElement = this.reservations.filter((rElement) => {
      return ((!rElement.end) && (table.name === rElement.table));
    })[0];
    return !filteredElement;
  }

  reserveTable(table) {
    // logic for making reservation
   let reservationObj = {
     "table": table.name,
     "person": "XYZ",
     "start": Date.now(),
     "end": 0
   };
   this.reservations.map((element) => { delete element['$key']});
   this.reservations.push(reservationObj);
   this.afb.database.object('/reservations').set(this.reservations);
   // Display the Modal
   let tableModal = Modal.create(ReserveTableModal);
   this.nav.present(tableModal, table);
  }

  releaseTable(table){
    // End of the Reservation
    let reservationObj = this.reservations.filter((rElement) => { return rElement.table === table.name }).sort((a, b) => {
      return a.start - b.start;
    }).pop();

    let key = reservationObj['$key'];
    delete reservationObj['$key'];
    reservationObj.end = Date.now();
    // Update in FireBase
    this.afb.database.object('/reservations/' + key).update(reservationObj);
  }

  displayLoginModal() {
      let loginPage = Modal.create(LoginPage);
      this.nav.present(loginPage);
  }

}
