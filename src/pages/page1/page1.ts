import { Component, Pipe, PipeTransform } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

//import {global} from "../../app/global";
import { PageLocations } from '../page-locations/page-locations'; // for locations icon
import { Search } from '../search/search'; // for search icon
//import { CartPage } from '../cart/cart'; // for cart icon

import { SectionsPage } from '../sections-page/sections-page';
import { TextClub } from '../text-club/text-club';
import { ItemPage } from '../item-page/item-page';
import { CarWashServices } from '../car-wash-services/car-wash-services';
import { DetailServices } from '../detail-services/detail-services';
import { OilLubeServices } from '../oil-lube-services/oil-lube-services';
import { CarWashClubPlans } from '../car-wash-club-plans/car-wash-club-plans';
import { UnlimitedWashPlans } from '../unlimited-wash-plans/unlimited-wash-plans';
import { CurrentDeals } from '../current-deals/current-deals';

//set up ionic.io services
import { Push, PushToken } from '@ionic/cloud-angular'; //TODO uncomment for devices
import { GlobalVars } from '../../providers/global'; // for storage

//import Instafeed from 'instafeed.js';

import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
    cards: Array<{content: string, img: string, link_id: string}>; // will be hooked up to server
    testCardItems: string[];
    testCardImages: string[];
    instagram_clientID: string;
    instagram_cobbleUID: string;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public globalVars: GlobalVars, public push: Push, public http: Http) { /* TODO add 'public push: Push, ' for devices*/
  
    // INPROGRESS jettison IonicDB and use AWS DynamoDB
    //let content = { "X-API-KEY":"UjpeAobFC4aNpXTIO7FlY4Fe8o8vDB0J5DzoF1Nn" }; // , {}, options
      
    /* 
    * gets specials
    */ // .map(res => res.json())
    this.http.get(`${this.globalVars.api_url}specials`, this.globalVars.api_key_options).map(res => res.json()).subscribe((cards) => { // pull specials from database
        console.log(cards);
        cards = cards.specials; // get down into the cards
        this.cards = []; //clear out cards
        // it is an array
        for (let i = 0; i < cards.length; i++) {
            // create a new element
            let newCard = {
                content: cards[i].title,
                img: cards[i].image,
                link_id: cards[i].link_id
            };
            this.cards.push(newCard);
        }
    }, (error) => {
        console.log(error);
    });
      
    /*
    * gets services
    * for testing only
    */ // .map(res => res.json())
    this.http.get(`${this.globalVars.api_url}services`, this.globalVars.api_key_options).map(res => res.json()).subscribe((_services) => {
        console.log("SERVICES");
        console.log(_services);
        // this is just a test of services
    });
      
    //set up push token
    this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
    }).then((t: PushToken) => {
        console.log('Token saved:', t.token);
    });
    
    //handle push
    this.push.rx.notification()
        .subscribe((msg) => {
            let alert = this.alertCtrl.create({
                      title: msg.title,
                      subTitle: msg.text,
                      buttons: ['OK']
                    });
                    alert.present();
        });
   //TODO uncomment for devices
  
    /* initialize bookmarks */
    this.globalVars.initializeBookmarks();
    
    /* initialize reminder for products */
    this.globalVars.initializeReminder();
  
    this.testCardItems = ["Full service carwash", "Oil Change", "Express exterior carwash", "Interior Detail", "Exterior Detail"];
    this.testCardImages = ["assets/img/box_full_service.jpg", "assets/img/box_oil_change.jpg", "assets/img/box_ext_carwash.jpg", "assets/img/box_int_detail.jpg", "assets/img/box_ext_detail.jpg"];
    this.cards = [];
      
    /*for (let i = 0; i < this.testCardItems.length; i++) {
        this.cards.push({
            content: this.testCardItems[i],
            img: this.testCardImages[i]
        })
    }*/
  }
  
  special_navigate(link_id) {
    // we should set up a bunch of read-only variables for each page
    if (link_id == "sections-page") {
        this.navCtrl.setRoot(SectionsPage, {}, {animate: true, direction: 'forward'});
    }
    else if (link_id == "text-club") {
        this.navCtrl.setRoot(TextClub, {}, {animate: true, direction: 'forward'});
    }
    else if (link_id == "locations-page") {
        this.navCtrl.setRoot(PageLocations, {}, {animate: true, direction: 'forward'}); // set as root
    }
    else if (link_id == "express-exterior" || link_id == "full-service-carwash") {
        this.navCtrl.setRoot(CarWashServices, { category: link_id }, {animate: true, animation:'md-transition', direction: 'forward'}); // ios transition is buggy so we use material design
    }
    else if (link_id == "interior-detail" || link_id == "exterior-detail") {
        this.navCtrl.setRoot(DetailServices, { category: link_id }, {animate: true, animation:'md-transition', direction: 'forward'});
    }
    else if (link_id == "fs-plans" || link_id == "ex-plans") {
        // open CarWashClubPlansPage
        this.navCtrl.setRoot(CarWashClubPlans, { category: link_id }, {animate: true, animation:'md-transition', direction: 'forward'});
    }
    else if (link_id == "oil-change" || link_id == "lube-add-ons") {
        // open OilLubeServicesPage
        this.navCtrl.setRoot(OilLubeServices, { category: link_id }, {animate: true, animation:'md-transition', direction: 'forward'});
    }
    else if (link_id == "ex-unlimited" || link_id == "fs-unlimited") {
        // open UnlimitedWashPlansPage
        this.navCtrl.setRoot(UnlimitedWashPlans, { category: link_id }, {animate: true, animation:'md-transition', direction: 'forward'});
    }
    else if (link_id == "current-deals") {
        this.navCtrl.setRoot(CurrentDeals, {}, {animate: true, animation:'md-transition', direction: 'forward'});
    }
    else {
        /*this.db.collection('sections').fetch().subscribe( (sections)=> {
            //console.log(sections);
            /*for (let i = 0; i < sections.length; i++) {
                if (sections[i].category_name == "express-exterior" || sections[i].category_name == "full-service-carwash") {
                    this.navCtrl.push(IndividualSectionPage, { category: sections[i].category_name }, {animate: true, direction: 'forward'});
                }
            }* /
            // if we make it here we have not found something due to the return statement
            
            this.db.collection('services').fetch().subscribe( (services)=> {
                //console.log(services);
                for (let i = 0; i < services.length; i++) {
                    if (services[i].title == link_id) {
                        this.navCtrl.push(ItemPage, { title: services[i].title, category: services[i].category, html: services[i].html, price: services[i].price, img: services[i].blue_image }, {animate: true, direction: 'forward'});
                        return; // we're done
                    }
                }
            });
        });*/
        
        // now we use angular http + amazon api gateway
        this.http.get(`${this.globalVars.api_url}sections`, this.globalVars.api_key_options).map(res => res.json()).subscribe((sections) => {
            // if we make it here we have not found something due to the return statement
            this.http.get(`${this.globalVars.api_url}services`, this.globalVars.api_key_options).map(res => res.json()).subscribe((services) => {
                console.log("SERVICES");
                console.log(services);
                // necessary...
                services = services.services;
                for (let i = 0; i < services.length; i++) {
                    if (services[i].title == link_id) {
                        this.navCtrl.push(ItemPage, { title: services[i].title, category: services[i].category, html: services[i].html, price: services[i].price, img: services[i].blue_image }, {animate: true, direction: 'forward'});
                        return; // we're done
                    }
                }
            });
        });
    }
  }
  
  openLocations(event) {
     this.navCtrl.setRoot(PageLocations, {}, {animate: true, direction: 'forward'}); // set as root
  }
  
  openSearch(event) {
    this.navCtrl.push(Search, {}, {animate: true, direction: 'forward'}); // push
  }
  
  openCart(event) {
    //this.navCtrl.setRoot(CartPage, {}, {animate: true, direction: 'forward'}); // set as root
  }
}