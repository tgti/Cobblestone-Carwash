import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { PageLocations } from '../page-locations/page-locations'; // for locations icon
import { Search } from '../search/search'; // for search icon

import { Auth, User } from '@ionic/cloud-angular'; // for authentication services

import { Account } from '../account/account';
import { CreateAccount } from '../create-account/create-account';

/*
  Generated class for the Login page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
    
    email: string;
    password: string;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public auth: Auth, public user: User, public modalCtrl: ModalController) {
        
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }
    openLocations(event) {
        this.navCtrl.setRoot(PageLocations, {}, {animate: true, direction: 'forward'}); // set as root
    }
    openSearch(event) {
        this.navCtrl.push(Search, {}, {animate: true, direction: 'forward'}); // push
    }
    
    /* attempts to login the user
    * email -- the email
    * password -- the password
    * if the user successfully logs in, navigate to account page
    * otherwise, display an error message and ask them to try again
    */
    login_click(email: string, password: string) {
        let details = {'email': email, 'password': password};
        this.auth.login('basic', details).then((response) => {
            if (this.auth.isAuthenticated()) {
                //success!
                alert("Success!");
                // let's also load up the data from the server
                this.user.load().then(() => {
                    console.log("successfully loaded user data");
                });
                // wait 300 ms so the user sees the success message
                setTimeout(() =>{
                    this.navCtrl.setRoot(Account, {}, {animate: true, direction: 'forward'});
                }, 300);
            }
            else {
                // an error occurred
                alert("Login failure. Please check to make sure you have the right email and password");
            }
        });
    }
    
    /*
    * opens a new account modal window
    */
    create_account() {
        this.modalCtrl.create(CreateAccount).present();
    }
}