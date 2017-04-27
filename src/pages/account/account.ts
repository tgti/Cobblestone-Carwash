import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PageLocations } from '../page-locations/page-locations'; // for locations icon
import { Search } from '../search/search'; // for search icon
import { Login } from '../login/login';

import { Auth, User } from '@ionic/cloud-angular'; // authentication services

/*
  Generated class for the Account page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class Account {
    
    name: string;
    constructor(public navCtrl: NavController, public navParams: NavParams, public auth: Auth, public user: User) {
        this.name = this.user.details.name;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AccountPage');
    }
    
    
    openLocations(event) {
        this.navCtrl.setRoot(PageLocations, {}, {animate: true, direction: 'forward'}); // set as root
    }
    openSearch(event) {
        this.navCtrl.push(Search, {}, {animate: true, direction: 'forward'}); // push
    }
    
    /* logs out the current user
    *
    */
    logout() {
        this.auth.logout();
        alert("Logged out");
        this.navCtrl.setRoot(Login, {}, {animate: true, direction: 'forward'}); // set as root
    }
}