import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Database } from '@ionic/cloud-angular';
import { PageLocations } from '../page-locations/page-locations';
import { ItemPage } from '../item-page/item-page';
import { Search } from '../search/search'; // for search icon
//import { CartPage } from '../cart/cart'; // for cart icon

import { Http } from '@angular/http';
import { GlobalVars } from '../../providers/global'; // for api
import 'rxjs/add/operator/map';

/*
  Generated class for the IndividualSectionPage page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-individual-section-page',
  templateUrl: 'individual-section-page.html'
})
export class IndividualSectionPage {
    title: string;
    category: string;
    services: Array<{title: string, price: number, html: string, img: string, hidden: boolean, id: string, bookmarked: boolean, color: string, order: number}>;
    constructor(public navCtrl: NavController, public navParams: NavParams, public db: Database, public globalVars: GlobalVars, public http: Http) {
        this.title = this.navParams.get('title');
        this.category = this.navParams.get('category');
        console.log("navParams: " + this.navParams.data);
        console.log("category is: " + this.category);
        this.http.get(`${this.globalVars.api_url}services`, this.globalVars.api_key_options).map(res => res.json()).subscribe((services) => {
            console.log(services);
            services = services.services;
            this.services = [];
            for (let i = 0; i < services.length; i++) {
                if (services[i].category == this.category) {
                    let newService = {
                        title: services[i].title,
                        img: services[i].image,
                        price: services[i].price,
                        html: services[i].html,
                        id: services[i].id,
                        hidden: true,
                        icon_name: 'icon-down',
                        bookmarked: false,
                        color: 'cobblestonegray',
                        order: services[i].order
                    };
                    this.services.push(newService);
                }
            }
            // sort this.services by order
            this.services = this.services.sort((n1, n2) => {
                if (n1.order > n2.order) {
                    return 1;
                }
                
                if (n1.order < n2.order) {
                    return -1;
                }
                
                return 0;
            });
            console.log(this.services);
            // initialize bookmarks
            this.initializeBookmarks();
        });
    }
  
  /*
  * set up the bookmarks
  */
  initializeBookmarks() {
    this.globalVars.getBookmarks().then((bookmarks) => {
        console.log(bookmarks);
        for (let i = 0; i < Object.keys(bookmarks).length; i++) {
            console.log("bookmark" + bookmarks[i]);
            for (var service of this.services) {
                if (service.id == bookmarks[i]) {
                    service.bookmarked = true;
                    service.color = 'danger';
                }
            }
        }
    });
  }
  
  /*
  * bookmark a service
  */
  changeBookmarkStatus(service) {
    service.bookmarked = !service.bookmarked;
    if (service.bookmarked) {
        this.globalVars.addBookmark(service.id);
        service.color = 'danger';
    }
    else {
        this.globalVars.removeBookmark(service.id);
        service.color = 'cobblestonegray';
    }
  }
  
  showDetails(service) {
    service.hidden = !service.hidden;
    if (service.hidden) {
        service.icon_name = 'icon-down';
    }
    else {
        service.icon_name = 'icon-up';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndividualSectionPagePage');
  }
  
  serviceClick(category, html, price, title, img, id) {
    //this.navCtrl.push(ItemPage, { title: title, category: category, html: html, price: price, img: img, id: id }, {animate: true, direction: 'forward'}); //not navigating right now
  }
  
  
  openLocations(event) {
     this.navCtrl.setRoot(PageLocations, {}, {animate: true, direction: 'forward'});
  }
    openSearch(event) {
        this.navCtrl.push(Search, {}, {animate: true, direction: 'forward'}); // push
    }
      openCart(event) {
    //this.navCtrl.setRoot(CartPage, {}, {animate: true, direction: 'forward'}); // set as root
  }
}