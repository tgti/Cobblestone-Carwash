import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';

import { Account } from '../account/account';

/*
  Generated class for the CreateAccount page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html'
})
export class CreateAccount {
    
    email: string;
    pwd: string;
    pwd2: string;
    name: string;
    phone: string;
    cc: string;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public auth: Auth, public user: User, public viewCtrl: ViewController) {
        this.email = "";
        this.pwd = "";
        this.pwd2 = "";
        this.name = "";
        this.phone = "";
        this.cc = "";
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CreateAccount');
    }
    
    /*
    * creates a new account with the information given
    */
    create_account() {
        let validated = this.validate_input();
        if (validated.status) {
            // make user details
            let details: UserDetails = { 'email': this.email, 'password': this.pwd, 'name': this.name };

            this.auth.signup(details).then(() => {
                // we are successfully signed up
                
                alert('Success!');
                
                // now we immediately login
                let details2 = {'email': this.email, 'password': this.pwd};
                this.auth.login('basic', details2).then((response) => {
                    if (this.auth.isAuthenticated()) {
                        //success!
                        // we now need to set some user data
                        // name is set under details
                        // we need custom fields for license plate, phone, rewards points, and favorites

                        this.user.set('cc', this.cc);
                        this.user.set('phone', this.phone);
                        this.user.save(); // push to server

                        // TODO get rewards points from Cobblestone database based on email and license plate
                        
                        this.navCtrl.setRoot(Account, {}, {animate: true, direction: 'forward'});
                    }
                    else {
                        // an error occurred
                        alert("Created account but failed to login");
                    }
                });
                
            }, (err: IDetailedError<string[]>) => {
                for (let e of err.details) {
                    if (e === 'conflict_email') {
                        alert('Email already exists.');
                    } else {
                        // handle other errors
                        alert('An error occurred. Please try again.');
                    }
                }
            });

        }
        else {
            alert(validated.message);
        }
    }
    
    /*
    * validates input
    */
    validate_input() {
        if (this.pwd != this.pwd2) {
            return { status: false, message: "Passwords do not match" };
        }
        else if (!this.validate_email(this.email)) {
            return { status: false, message: "Invalid email address" };
        }
        else if (this.pwd.length < 6) {
            return { status: false, message: "Password must be at least six characters in length" };
        }
        else if (this.name.length < 1) {
            return { status: false, message: "Please enter a name" };
        }
        else if (this.phone.length < 1) {
            return { status: false, message: "Please enter a phone number" };
        }
        else if (this.cc.length < 1) {
            return { status: false, message: "Please enter a license plate number" };
        }
        else {
            return { status: true, message: "Success!" };
        }
    }
    
    /*
    * validates email
    * helper function to validate_input()
    */
    validate_email(email) {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        if (email != "" && (email.length <= 5 || !EMAIL_REGEXP.test(email))) {
            return false;
        }
        else {
            return true;
        }
    }
    
    dismiss(data?: any) {
        this.viewCtrl.dismiss(data);
    }
}