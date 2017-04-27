import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Toast } from 'ionic-native';
import { Search } from '../search/search'; // for search icon
import { PageLocations } from '../page-locations/page-locations';
//import { CartPage } from '../cart/cart'; // for cart icon
import { GlobalVars } from '../../providers/global';

/*
  Generated class for the ItemPage page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-item-page',
  templateUrl: 'item-page.html'
})
export class ItemPage {
    title: string;
    category: string;
    html: string;
    price: number;
    shownPrice: number;
    img: string;
    id: string;
    quantity: number;
    qstr: string;
    qoptions: Array<number>;
    buttonHeight: string;
    color: string;
    bookmarked: boolean;
    
    icon_name: string;
    hidden: boolean;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public globalVars: GlobalVars) {
        this.title = this.navParams.get('title');
        this.category = this.navParams.get('category');
        this.html = this.navParams.get('html');
        this.price = this.navParams.get('price');
        this.img = this.navParams.get('img');
        this.id = this.navParams.get('id');
        this.qstr = " - 1";
        this.qoptions = [1,2,3,4,5,6,7,8];
        this.shownPrice = this.price;
        this.quantity = 1;
        
        this.hidden = false;
        this.icon_name = 'icon-down'; // both these values are set...we're not hiding/showing the details
        
        this.color = 'cobblestonegray';
        this.bookmarked = false;
        
        this.buttonHeight = "max-width: 4.4em;";
        
        this.initializeBookmarks();
  }
  /*
  * set up the bookmarks
  */
  initializeBookmarks() {
    this.globalVars.getBookmarks().then((bookmarks) => {
        console.log(bookmarks);
        for (let i = 0; i < Object.keys(bookmarks).length; i++) {
            if (this.id == bookmarks[i]) {
                this.bookmarked = true;
                this.color = 'danger';
            }
        }
    });
  }
  
  runActionSheet() {
    let actionsButtons: Array<{text: string, handler: any}> = [];
    for (let i = 0; i < this.qoptions.length; i++) {
        actionsButtons.push({
            text: ""+this.qoptions[i],
            handler: ()=>{
                this.updateQSTR(this.qoptions[i]);
            }
        });
    }
    let actionSheet = this.actionSheetCtrl.create({
        title: 'Quantity',
        buttons: actionsButtons
    });
    actionSheet.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemPagePage');
  }
  addItemToCart() {
    // here we will add an item to the cart
    // the storage is this.globalVars
    // avaliable functions are addToCart(id: string, qty: number)
    // removeFromCart(id: string, qty: number)
    this.globalVars.addToCart(this.id, this.quantity);
    Toast.showShortCenter(`Added ${this.quantity} items to cart`).subscribe(
        toast => {
            console.log('Success', 'toast');
        }
    );
  }
    changeBookmarkStatus() {
        this.bookmarked = !this.bookmarked;
        if (this.bookmarked) {
            this.globalVars.addBookmark(this.id);
            this.color = 'danger';
        }
        else {
            this.globalVars.removeBookmark(this.id);
            this.color = 'cobblestonegray';
        }
    }
  
    openLocations(event) {
        this.navCtrl.setRoot(PageLocations, {}, {animate: true, direction: 'forward'});
    }
    openSearch(event) {
        this.navCtrl.push(Search, {}, {animate: true, direction: 'forward'}); // push
    }
    /*openCart(event) {
        this.navCtrl.setRoot(CartPage, {}, {animate: true, direction: 'forward'}); // set as root
    }*/
    
    updateQSTR(newVal) {
        this.quantity = newVal;
        this.qstr = ` - ${newVal}`;
        this.shownPrice = newVal * this.price;
    }
}