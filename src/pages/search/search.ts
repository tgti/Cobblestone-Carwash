import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PageLocations } from '../page-locations/page-locations';
import { ItemPage } from '../item-page/item-page';
//import { CartPage } from '../cart/cart'; // for cart icon

import { Http } from '@angular/http'; // for API
import { GlobalVars } from '../../providers/global';
import 'rxjs/add/operator/map';

/*
  Generated class for the Search page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class Search {

    services: Array<{category: string, title: string, price: number, html: string, img: string, id: string}>;
    selected_services: Array<{category: string, title: string, price: number, html: string, img: string, id: string}>; // oop might be better...all services are of the same class
    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public globalVars: GlobalVars) {
        //get collection of services
        this.http.get(`${this.globalVars.api_url}services`, this.globalVars.api_key_options).map(res => res.json()).subscribe((services) => {
            console.log(services);
            services = services.services;
            this.services = [];
            for (let i = 0; i < services.length; i++) {
                let newService = {
                    category: services[i].category,
                    title: services[i].title,
                    img: services[i].image,
                    price: services[i].price,
                    html: services[i].html,
                    id: services[i].id
                };
                this.services.push(newService);
            }
            this.initializeItems(); // resets selected services
        });
    }
    
    initializeItems() {
        this.selected_services = this.services;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SearchPage');
    }
    
    //search query
    getServices(ev: any) {
        this.initializeItems(); // reset
        let val = ev.target.value; // set val to searchbar query
        if (val && val.trim() != '') { // skip empty query
            this.selected_services = this.selected_services.filter((item) => {
                return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
    }
    
    serviceClick(category, html, price, title, img, id) {
        this.navCtrl.push(ItemPage, { title: title, category: category, html: html, price: price, img: img, id: id}, {animate: true, direction: 'forward'});
    }
    
    openLocations(event) {
        this.navCtrl.setRoot(PageLocations, {}, {animate: true, direction: 'forward'});
    }
    openCart(event) {
        //this.navCtrl.setRoot(CartPage, {}, {animate: true, direction: 'forward'}); // set as root
    }
}