import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { GlobalVars } from '../../providers/global'; // for storage
import { Database } from '@ionic/cloud-angular'; // for database

import { Http } from '@angular/http'; // for api
import 'rxjs/add/operator/map';
/*
  Generated class for the FavoritesTab page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-favorites-tab',
  templateUrl: 'favorites-tab.html'
})
export class FavoritesTab {
    services: Array<{title: string, price: number, html: string, img: string, hidden: boolean, id: string, bookmarked: boolean, color: string}>;
    show_blank: boolean;
    categories: Array<string>;
    constructor(public navCtrl: NavController, public navParams: NavParams, public db: Database, public globalVars: GlobalVars, public http: Http) {
        this.categories = this.navParams.get('categories');
        // load favorites in ionViewWillEnter event
        this.show_blank = true;
    }
    ionViewWillEnter() {
        // refresh favorites
        // we do this in case the user bookmarked anything in the other tabs
        this.http.get(`${this.globalVars.api_url}services`, this.globalVars.api_key_options).map(res => res.json()).subscribe((services) => {
            services = services.services; // for api
            this.services = [];
            this.globalVars.getBookmarks().then((bookmarks) => {
                if (Object.keys(bookmarks).length > 0) {
                    this.show_blank = false;
                }
                for (let i = 0; i < services.length; i++) {
                    for (let j = 0; j < Object.keys(bookmarks).length; j++) {
                        if (services[i].id === bookmarks[j]) {
                            for (let category of this.categories) {
                                //console.log("categories: ");
                                //console.log(this.categories);
                                if (services[i].category == category) {
                                    let newService = {
                                        title: services[i].title,
                                        img: services[i].image,
                                        price: services[i].price,
                                        html: services[i].html,
                                        id: services[i].id,
                                        hidden: true,
                                        icon_name: 'icon-down',
                                        bookmarked: true,
                                        color: 'danger'
                                    };
                                    this.services.push(newService);
                                }
                            }
                            break;
                        }
                    }
                }
            });
        });        
    }
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesTabPage');
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
  
  // called when a service is clicked
  // for now this exists to avoid a syntax error
  serviceClick(category, html, price, title, img, id) {
    //this.navCtrl.push(ItemPage, { title: title, category: category, html: html, price: price, img: img, id: id }, {animate: true, direction: 'forward'}); //not navigating right now
  }
}