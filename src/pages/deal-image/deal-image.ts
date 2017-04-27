import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the DealImage page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-deal-image',
  templateUrl: 'deal-image.html'
})
export class DealImage {
    coupon_src: string;
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
        this.coupon_src = this.navParams.get("image");
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealImagePage');
  }
    dismiss(data?: any) {
        this.viewCtrl.dismiss(data);
    }
}