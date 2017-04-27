import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PageLocations } from '../page-locations/page-locations'; // for location icon
import { Search } from '../search/search'; // for search icon
import { GlobalVars } from '../../providers/global'; // for storage

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the BookmarkPage page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  
  This page will load all the bookmarked specials and services
  
*/
@Component({
  selector: 'page-bookmark',
  templateUrl: 'bookmark-page.html'
})
export class BookmarkPage {

    services: Array<{title: string, price: number, html: string, img: string, hidden: boolean, id: string, bookmarked: boolean, color: string, category: string}>;
    show_blank: boolean;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalVars: GlobalVars, public http: Http) {
        this.show_blank = true;
        //this.categories = this.navParams.get('categories');
        this.http.get(`${this.globalVars.api_url}services`, this.globalVars.api_key_options).map(res => res.json()).subscribe((services) => {
            this.services = [];
            services = services.services // necessary
            this.globalVars.getBookmarks().then((bookmarks) => {
                if (Object.keys(bookmarks).length > 0) {
                    this.show_blank = false;
                }
                for (let i = 0; i < services.length; i++) {
                    for (let j = 0; j < Object.keys(bookmarks).length; j++) {
                        if (services[i].id === bookmarks[j]) {
                            //console.log("categories: ");
                            //console.log(this.categories);
                            let newService = {
                                title: services[i].title,
                                img: services[i].image,
                                price: services[i].price,
                                html: services[i].html,
                                id: services[i].id,
                                hidden: true,
                                icon_name: 'icon-down',
                                bookmarked: true,
                                color: 'danger',
                                category: services[i].category
                            };
                            this.services.push(newService);
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
        console.log('ionViewDidLoad BookmarkPage');
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