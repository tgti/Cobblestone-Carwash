import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { PageLocations } from '../page-locations/page-locations';
import { DomSanitizer} from '@angular/platform-browser';
import { Http, Headers } from '@angular/http'; //, RequestOptions
import 'rxjs/add/operator/toPromise';
import { Search } from '../search/search'; // for search icon
import { TextClub } from '../text-club/text-club'; // for opting into the text club

import { GlobalVars } from '../../providers/global'; // for api
import 'rxjs/add/operator/map';

@Component({
  selector: 'feedback-page',
  templateUrl: 'feedback-page.html'
})
export class FeedbackPage {
    contact_info: Array<string>;
    ranges: Array<number>;
    locations: Array<string>;
    selected_location: string;
    communication: Array<string>;
    additional_comments: string;
    location_options: any;
    customer_service_options: any;
    contact_options: any;
    opt_into_text: boolean;
    constructor(public navCtrl: NavController, public navParams: NavParams, public sanitizer: DomSanitizer, public alertCtrl: AlertController, public http: Http, public globalVars: GlobalVars) {
        this.ranges = [];
        this.contact_info = [];
        /*this.locations = [{ name: "SCOTTSDALE - FLWright & Hayden" },
        { name: "SCOTTSDALE - Scottsdale Rd & Pinnacle Peak Rd." },
        { name: "PHOENIX - Bell Rd & 51 Fwy." },
        { name: "CHANDLER - Alma School & Germann" },];*/
        // this.locations will be pulled from ionic cloud
        this.http.get(`${this.globalVars.api_url}locations`, this.globalVars.api_key_options).map(res => res.json()).subscribe((locations) => {
            console.log(locations);
            locations = locations.locations;
            this.locations = [];
            let mLocations = locations.locations;
            for (let i = 0; i < mLocations.length; i++) {
                this.locations.push(mLocations[i].title);
            }
        }, (error) => {
            console.log(error);
        });
        
        this.selected_location = "";
        this.communication = [];
        this.additional_comments = "";
        
        for (let i = 0; i < 6; i++) {
            this.ranges.push(5);
        }
        for (let i = 0; i < 3; i++) {
            this.contact_info.push("");
        }
        for (let i = 0; i < 2; i++) {
            this.communication.push("");
        }
        
        // select initialization
        this.location_options = {
            title: 'Which location did you visit?'
        };
        this.customer_service_options = {
            title: 'Would you like for a Customer Service Representative to contact you?'
        };
        this.contact_options = {
            title: 'If you answered "Yes" to the previous question, how would you like to be contacted?'
        };
        
        this.opt_into_text = true; // by default, opt in
    }
    submitForm() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = JSON.stringify({
            contact_info: this.contact_info,
            ranges: this.ranges,
            location: this.selected_location,
            communication: this.communication,
            comments: this.additional_comments,
        });
        console.log(body);
        this.http.post('https://cobblestone-carwash.herokuapp.com/FeedbackForm.php', body, headers)
	       .toPromise()
	       .then(response => { 
                   let alert = this.alertCtrl.create({
                      title: 'Form Submitted!',
                      subTitle: 'Thank you for filling out our feedback form!',
                      buttons: [{
                        text: 'OK',
                        handler: data => {
                            if (this.opt_into_text) {
                                this.navCtrl.push(TextClub, {}, {animate: true, direction: 'forward'}); // push
                            }
                        }
                      }]
                    });
                    alert.present();
                    return response.json(); 
                }, this.handleError);
    }
    handleError(error) {
		console.log(error);
		return error.json().message || 'Server error, please try again later';
	}
    

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }
    updateURL(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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