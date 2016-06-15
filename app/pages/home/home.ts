import {Modal, NavController} from 'ionic-angular';
import {Component, OnInit, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {LoginPage} from '../login/login'
import {NewItemModal} from '../item/newItem';
// import {MomentDate} from '../../lib/MomentDate'

//User pages
import {OrdersPage} from '../orders/orders';
import {OrderPage} from '../order/order';


//Admin pages
import {MenuPage}  from '../menu/menu';
import {UsersPage} from '../users/users';
import {CurrentOrdersPage} from '../current-orders/current-orders';

import {UserModel} from '../../models';


import 'rxjs';
import {Firebase} from 'firebase';
import {FirebaseAuth, AuthProviders, AuthMethods, FirebaseRef, AngularFire } from 'angularfire2';

@Component({
    templateUrl: 'build/pages/home/home.html',
    pipes: [
        // MomentDate
    ]
})
export class HomePage implements OnInit {
    textItems: Observable<any[]>;
    usersWithMessages: Observable<any[]>;
    authInfo: any;
    userData: UserModel;
    appPages: Array<Object> = [];
    OrderPage = OrderPage;
    isAdmin: boolean = false;
    adminPages: Array<Object> = [{ name: "Orders", component:CurrentOrdersPage},
    { name: "All Users", component:UsersPage},
    { name: "Manage Menu", component: MenuPage },
    ];
    userPages: Array<{name:string,component:Function}> =
    [{ name: "Your Orders", component:OrdersPage}];


    constructor(
        @Inject(FirebaseRef) public ref: Firebase,
        public af: AngularFire,
        public auth: FirebaseAuth,
        public _nav: NavController) {
        // dont do anything heavy here... do it in ngOnInit
    }

    ngOnInit() {

        // subscribe to the auth object to check for the login status
        // of the user, if logged in, save some user information and
        // execute the firebase query...
        // .. otherwise
        // show the login modal page
        this.auth.subscribe((data) => {
            if (data) {
                if (data.google) {
                    this.authInfo = data.google;
                    this.authInfo.userId = data.uid;
                    this.authInfo.displayName = data.google.displayName;
                    //Create user to save into database
                    this.userData = {
                        email: data.google.email,
                        displayName: data.google.displayName,
                        userId: data.google.userId,
                        profileImageURL: data.google.profileImageURL,
                    };
                    this.ref.child("users").child(data.uid).update(this.userData);

                } else {
                    this.authInfo = data.password
                    this.authInfo.displayName = data.password.email
                }
                //prepare pages Array
                let decider = this.af.object(`users/${data.uid}/role`);
                decider.subscribe((data)=>{
                    if(data=='father') {
                        this.appPages = this.adminPages;
                        this.isAdmin = true;
                    }else{
                        this.appPages = this.userPages;

                    }
                });

                // this.textItems = this.af.database.list('/textItems');

                //this.getMoreData()

            } else {
                this.authInfo = null
                this.displayLoginModal()
            }
        });
    }

    getMoreData() {
        this.usersWithMessages = this.af.list('/users').map((_users) => {
            return _users.map((_user) => {
                _user.messages = this.af.object("/userObjects/public-messages/" + _user.$key)
                return _user;
            });
        });
    }

    /**
     * displays the login window
     */
    displayLoginModal() {
        let loginPage = Modal.create(LoginPage);
        this._nav.present(loginPage);
    }

    /**
     * adds a new item to firebase /textItems
     *
     * pass in the auth information to the modal to associate the user with the newly
     * created entry
     */
    // addNewItemClicked(_data) {
    //     let newItemPage = Modal.create(NewItemModal, { "user": this.authInfo });
    //     this._nav.present(newItemPage);
    // }


    // goToOrderPage() {
    //     this._nav.push(OrdersPage, { userData: this.userData });
    // }

    gotoPage(page) {
        this._nav.push(page,{userData: this.userData});
    }

    /**
     * logs out the current user
     */
    logoutClicked() {

        if (this.authInfo && (this.authInfo.email || this.authInfo.accessToken)) {
            this.auth.logout();
            return;
        }
    }
}
