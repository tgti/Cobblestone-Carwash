import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Database } from '@ionic/cloud-angular';
import { PageLocations } from '../page-locations/page-locations';
import { IndividualSectionPage } from '../individual-section-page/individual-section-page';
import { Search } from '../search/search'; // for search icon
//import { CartPage } from '../cart/cart'; // for cart icon

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GlobalVars } from '../../providers/global'; // for api
/*
  Generated class for the SectionsPage page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sections-page',
  templateUrl: 'sections-page.html'
})
export class SectionsPage {
    sections: Array<{title: string, img: string, category_name: string}>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public globalVars: GlobalVars) {
    this.http.get(`${this.globalVars.api_url}sections`, this.globalVars.api_key_options).map(res => res.json()).subscribe((sections) => {
        console.log(sections);
        sections = sections.sections;
        this.sections = [];
        for (let i = 0; i < sections.length; i++) {
            let newCard = {
                title: sections[i].title,
                img: sections[i].img,
                category_name: sections[i].category_name
            };
            this.sections.push(newCard);
        }
    });
  
  }
  cardClick(title, category) {
    this.navCtrl.push(IndividualSectionPage, { title: title, category: category }, {animate: true, direction: 'forward'});
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SectionsPage');
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