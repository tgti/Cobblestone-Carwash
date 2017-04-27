import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { PageLocations } from '../page-locations/page-locations'; // for location icon
import { Search } from '../search/search'; // for search icon
import { GlobalVars } from '../../providers/global'; // for storage

import { Http } from '@angular/http'; // for api
import 'rxjs/add/operator/map';
/*
  Generated class for the Wallet page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html'
})
export class Wallet {
    products: Array<{name: string, expiration: string}>; /*expiration is in ISO 8601 datetime format*/
    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public globalVars: GlobalVars, public http: Http) {
        this.devInitializeProducts(); //this will later be pulled from storage
    }
    
    /*
    * this function gives products some example data
    */
    devInitializeProducts() {
        this.products = [{
            name: "Free Wash Upgrade",
            expiration: "2017-02-23"
        }, {
            name: "$3 Off Top Tier Wash",
            expiration: "2017-03-30"
        }, {
            name: "20% Off Detail Service",
            expiration: "2017-03-30"
        }];
    }
    
    /*
    * converts ISO 8601 datetime format to the format we want to display
    * INPUT: a date in the format YYYY-MM-DD
    * OUTPUT: a date in the format MM/DD/YY
    */
    convertDate(isoDate) {
        let dateData = isoDate.split('-');
        let YY = dateData[0].slice(2, 4); // delete the 20 in 20YY
        return `${dateData[1]}/${dateData[2]}/${YY}`;
    }
    
    /*
    * allows user to use a wallet item
    */
    promptUseWalletItem(product) {
        let disclaimer = `Expires ${this.convertDate(product.expiration)}. Most Cars. Not Valid with any other discount or offer. Vehicles with 3+ rows of seats add $1 to full serve car washes`;
        let redeemCtrl = this.alertCtrl.create({
            title: product.name,
            message: disclaimer,
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                        console.log("cancelled");
                    }
                },
                {
                    text: 'Redeem',
                    handler: () => {
                        //redeemCtrl.dismiss().then(() => {
                            this.redeemProductReminder();
                        //})
                    }
                }
            ]
        });
        redeemCtrl.present();
    }
    
    redeemProductReminder() {
        this.globalVars.getReminderResponse().then((response) => {
            console.log("response...");
            console.log(response);
            if (response) {
                console.log("showing warning...");
                // show warning
                let warningCtrl = this.alertCtrl.create();
                warningCtrl.setTitle("Are you sure you want to redeem");
                warningCtrl.setMessage("You will have 5 minutes to use the coupon before it is removed from your wallet.");
                warningCtrl.addInput({
                    type: 'checkbox',
                    label: 'Do not show again',
                    value: 'y'
                });
                warningCtrl.addButton('Cancel'); // will cancel
                warningCtrl.addButton({
                    text: 'Redeem',
                    handler: data => {
                        if (data == 'y') {
                            this.globalVars.setReminderResponse(false);
                        }
                        this.redeemProduct();
                    }
                });
                warningCtrl.present();
            }
            else {
                console.log("redeeming product...");
                this.redeemProduct();
            }
        });
    }
    
    redeemProduct() {
        console.log("product redeemed!");
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad WalletPage');
    }
    /* event listener to open locations
    * in ion-header
    */
    openLocations(event) {
        this.navCtrl.setRoot(PageLocations, {}, {animate: true, direction: 'forward'});
    }
    
    /* event listener to open search
    * in ion-header
    */
    openSearch(event) {
        this.navCtrl.push(Search, {}, {animate: true, direction: 'forward'}); // push
    }
}