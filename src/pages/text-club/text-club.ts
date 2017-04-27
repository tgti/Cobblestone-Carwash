import { Component, Pipe, PipeTransform } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PageLocations } from '../page-locations/page-locations';
import { DomSanitizer} from '@angular/platform-browser';
import { Search } from '../search/search'; // for search icon
//import { CartPage } from '../cart/cart'; // for cart icon

/*
  Generated class for the TextClub page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-text-club',
  templateUrl: 'text-club.html'
})
export class TextClub {
    //iframeURL: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    //this.iframeUrl = 'http://www.optspot.me/cobblestonepandora';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TextClubPage');
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

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}