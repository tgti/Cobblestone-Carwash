import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FeedbackPage } from '../feedback-page/feedback-page';
import { Search } from '../search/search'; // for search icon
import { PageLocations } from '../page-locations/page-locations';
import { CartPage } from '../cart/cart'; // for cart icon

/*
  Generated class for the ContactPage page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-contact-page',
  templateUrl: 'contact-page.html'
})
export class ContactPage {
    
    contact_info: Array<{name: string, icon: string}>;
    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.contact_info = [];
        let emailInfo = {
            name: "Email",
            icon: "mail"
        }
        let phoneInfo = {
            name: "Phone",
            icon: "call"
        }
        let feedback = {
            name: "Feedback",
            icon: "person"
        }
        this.contact_info.push(emailInfo);
        this.contact_info.push(phoneInfo);
        this.contact_info.push(feedback);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ContactPage');
    }
    
    openLinks(name) {
        for (var contact of this.contact_info) {
            if (contact.name == name) {
                if (name == "Email") {
                    this.openEm();
                }
                else if (name == "Phone") {
                    this.openPhone();
                }
                else {
                    this.openFeedback();
                }
            }
        }
    }
    
    openEm() {
        window.open('mailto:wecare@cobblestone.com');
    }
    openPhone() {
        window.open('tel:+16027889274');
    }
    openFeedback() {
        this.navCtrl.setRoot(FeedbackPage, {}, {animate: true, direction: 'forward'}); // set root
    }
    
    // menu buttons
    openLocations(event) {
        this.navCtrl.setRoot(PageLocations, {}, {animate: true, direction: 'forward'});
    }
    openSearch(event) {
        this.navCtrl.push(Search, {}, {animate: true, direction: 'forward'}); // push
    }
    openCart(event) {
        this.navCtrl.setRoot(CartPage, {}, {animate: true, direction: 'forward'}); // set as root
    }

}