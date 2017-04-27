import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { PageLocations } from '../page-locations/page-locations'; // for location icon
import { Search } from '../search/search'; // for search icon
import { GlobalVars } from '../../providers/global'; // for storage

import { DealImage } from '../deal-image/deal-image'; // for modal


import { Http } from '@angular/http'; // for api
import 'rxjs/add/operator/map';
/*
  Generated class for the CurrentDeals page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-current-deals',
  templateUrl: 'current-deals.html'
})
export class CurrentDeals {
    deals: Array<{name: string, expiration: string, image: string, id: string}>; /*expiration is in ISO 8601 datetime format*/
    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public globalVars: GlobalVars, public modalCtrl: ModalController, public http: Http) {
        //this.devInitializeProducts(); //this will later be pulled from storage
        this.deals = [];
        this.initDeals();
    }
    
    initDeals() {
        this.http.get(`${this.globalVars.api_url}currentdeals`, this.globalVars.api_key_options).map(res => res.json()).subscribe((deals) => {
            console.log(deals);
            deals = deals.currentDeals;
            this.globalVars.getOldDeals().then ( (oDeals) => {
                for (let deal of deals) {
                    var foundMatch = false;
                    console.log(oDeals);
                    for (let i = 0; i < Object.keys(oDeals).length; i++) {
                        if (oDeals[i].id == deal.id) {
                            foundMatch = true;
                            break;
                        }
                    }
                    if (!foundMatch) {
                        // calculate expiration date
                        let now = new Date(Date.now());
                        console.log(deal.time);
                        now.setDate(now.getDate() + parseInt(deal.time));
                        let pushDeal = {name: deal.name, expiration: now.toISOString(), image: deal.image, id: deal.id};
                        this.globalVars.addOldDeal(pushDeal);
                        this.globalVars.addDownloadedDeal(pushDeal);
                    }
                }
                this.globalVars.getDownloadedDeals().then((cDeals) => {
                    console.log(cDeals);
                    for (let i = 0; i < Object.keys(cDeals).length; i++) {
                        if (new Date(cDeals[i].expiration) < new Date(Date.now())) {
                            this.globalVars.removeDownloadedDeal(cDeals[i].id);
                        }
                        else
                            this.deals.push(cDeals[i]);
                    }
                });
            });
        });
    }

    
    
    /*
    * this function gives products some example data
    */
    /*devInitializeProducts() {
        this.deals = [{
            name: "Free Wash Upgrade",
            expiration: "2017-02-23"
        }, {
            name: "$3 Off Top Tier Wash",
            expiration: "2017-03-30"
        }, {
            name: "20% Off Detail Service",
            expiration: "2017-03-30"
        }];
    }*/
    
    /*
    * converts ISO 8601 datetime format to the format we want to display
    * INPUT: a date in the format YYYY-MM-DD
    * OUTPUT: a date in the format MM/DD/YY
    */
    convertDate(isoDate) {
        let dateData = isoDate.split('-');
        let YY = dateData[0].slice(2, 4); // delete the 20 in 20YY
        let dd = dateData[2].slice(0, 2); // gets just the day instead of time stuff
        return `${dateData[1]}/${dd}/${YY}`;
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
                    text: 'View',
                    handler: () => {
                        //redeemCtrl.dismiss().then(() => {
                            this.redeemProduct(product);
                        //})
                    }
                }
            ]
        });
        redeemCtrl.present();
    }
    
    redeemProductReminder(product) {
        this.globalVars.getReminderResponse().then((response) => {
            console.log("response...");
            console.log(response);
            if (response) {
                console.log("showing warning...");
                // show warning
                let warningCtrl = this.alertCtrl.create();
                warningCtrl.setTitle("Are you sure you want to redeem");
                warningCtrl.setMessage("After redeeming this coupon you will no longer be able to use it");
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
                        this.redeemProduct(product);
                    }
                });
                warningCtrl.present();
            }
            else {
                console.log("redeeming product...");
                this.redeemProduct(product);
            }
        });
    }
    
    redeemProduct(product) {
        // show the image
        let imageModal = this.modalCtrl.create(DealImage, { image: product.image});
        imageModal.present();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CurrentDealsPage');
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