import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PageLocations } from '../page-locations/page-locations'; // for locations icon
import { Search } from '../search/search'; // for search icon
import { GlobalVars } from '../../providers/global'; // for cart storage
import { Database } from '@ionic/cloud-angular';

/*
  Generated class for the Cart page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
    
    products: Array<{title: string, qty: number, price: number, id: string}>;
    IDs: string[];
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalVars: GlobalVars, public db: Database) {
        this.db.collection('services').fetch().subscribe( (services)=> {
            console.log(services);
            this.IDs = [];
            this.products = [];
            // create a dictonary for all the values
            let titleDictionary : { [id: string] : string} = {};
            let priceDictionary : { [id: string] : number} = {};
            for (let service of services) {
                this.IDs.push(service.id);
                titleDictionary[service.id] = service.title
                priceDictionary[service.id] = service.price;
            }
            this.globalVars.getCart(this.IDs).then((returnValues) => { // returnValues is a dictionary... returnValues: { [id: string] : number } = {};
                //console.log(returnValues);
                //console.log(Object.keys(returnValues).length);
                for (var key in returnValues) {
                    this.products.push({title: titleDictionary[key], qty: returnValues[key], price: +((priceDictionary[key] * returnValues[key]).toFixed(2)), id: key});
                }
                console.log(this.products);
            });
        });
    }
    deleteProduct(id: string) {
        this.globalVars.removeFromCart(id);
        for (let i = 0; i < this.products.length; i++) {
            if (id == this.IDs[i]) {
                this.IDs.splice(i, 1);
            }
            if (this.products[i].id == id) {
                this.products.splice(i, 1);
            }
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CartPage');
    }
    openLocations(event) {
        this.navCtrl.setRoot(PageLocations, {}, {animate: true, direction: 'forward'}); // set as root
    }

    openSearch(event) {
        this.navCtrl.push(Search, {}, {animate: true, direction: 'forward'}); // push
    }


}