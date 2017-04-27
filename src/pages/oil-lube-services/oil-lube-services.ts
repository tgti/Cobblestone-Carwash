import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { PageLocations } from '../page-locations/page-locations'; // for locations icon
import { Search } from '../search/search'; // for search icon
import { Database } from '@ionic/cloud-angular'; // database 
import { IndividualSectionPage } from '../individual-section-page/individual-section-page'; // component for tabs
import { FavoritesTab } from '../favorites-tab/favorites-tab';

import { Http } from '@angular/http';
import { GlobalVars } from '../../providers/global'; // for api
import 'rxjs/add/operator/map';

/*
  Generated class for the OilLubeServices page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-oil-lube-services',
  templateUrl: 'oil-lube-services.html'
})
export class OilLubeServices {

    @ViewChild('tabsContainer') tabRef: Tabs;

    functional_tabs: Array<{title: string, component: any, params: any}>;
    fav_tab: any;
    fav_params: {categories: Array<string>};
    num_tabs: number;
    category: string;
    constructor(public navCtrl: NavController, public navParams: NavParams, public db: Database, public http: Http, public globalVars: GlobalVars) {
        //this.fav_params = {categories: []};
        this.functional_tabs = [];
        this.fav_tab = FavoritesTab;
        this.category = this.navParams.get("category"); // might be null
        this.fav_params = {categories: ["oil-change", "lube-add-ons"]}; //TODO figure out way to not hard-code this
        this.http.get(`${this.globalVars.api_url}settings`, this.globalVars.api_key_options).map(res => res.json()).subscribe((settings) => {
            settings = settings.settings;
            let setting = settings.lube;
            this.fav_tab = FavoritesTab;
            //this.fav_params = { categories: setting.categories };
            for (let i = 0; i < setting.num_tabs; i++) {
                let new_tab = {
                    title: setting.titles[i],
                    component: IndividualSectionPage,
                    params: {title: setting.titles[i], category: setting.categories[i]}
                };
                //console.log("from here, " + setting.categories[i]);
                this.functional_tabs.push(new_tab);
            }
            // set the selected tab
            if (this.category == this.fav_params.categories[1]) {
                setTimeout(()=>{
                    this.tabRef.select(2);
                    console.log("selecting index 2...");
                }, 1);
            }
            else {
                setTimeout(()=>{
                    this.tabRef.select(1);
                    console.log("selecting index 1...");
                }, 1);
            }
            
        });
    }

    openLocations(event) {
        this.navCtrl.setRoot(PageLocations, {}, {animate: true, direction: 'forward'}); // set as root
    }
    openSearch(event) {
        this.navCtrl.push(Search, {}, {animate: true, direction: 'forward'}); // push
    }
}