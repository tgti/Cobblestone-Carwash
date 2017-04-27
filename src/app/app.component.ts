import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Database, Auth, User } from '@ionic/cloud-angular';

import { Page1 } from '../pages/page1/page1';
import { PageLocations } from '../pages/page-locations/page-locations';
import { TextClub } from '../pages/text-club/text-club';
import { SectionsPage } from '../pages/sections-page/sections-page';
import { CartPage } from '../pages/cart/cart';
import { Wallet } from '../pages/wallet/wallet';
import { BookmarkPage } from '../pages/bookmark-page/bookmark-page';
import { Rewards } from '../pages/rewards/rewards';
import { CurrentDeals } from '../pages/current-deals/current-deals';

import { Account } from '../pages/account/account';

import { Login } from '../pages/login/login';

import { CarWashServices } from '../pages/car-wash-services/car-wash-services';
import { CarWashClubPlans } from '../pages/car-wash-club-plans/car-wash-club-plans';
import { UnlimitedWashPlans } from '../pages/unlimited-wash-plans/unlimited-wash-plans';
import { OilLubeServices } from '../pages/oil-lube-services/oil-lube-services';
import { DetailServices } from '../pages/detail-services/detail-services';

import { FeedbackPage } from '../pages/feedback-page/feedback-page';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Page1;

  pages: Array<{title: string, component: any, icon: string, badge: string}>;
  counter: number;
  account_page: {title: string, component: any };
  hasInit: boolean;
  numDeals: string;

  constructor(public platform: Platform, private events: Events, public db: Database, public user: User, public auth: Auth, public splashScreen: SplashScreen, public statusBar: StatusBar) {
    this.hasInit = false;
    //this.initializeApp();
    //so we don't get a null runtime error
    this.numDeals = '0';
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: Page1, icon: 'home', badge: 'none' },
      //{ title: 'Wallet', component: WalletPage, icon: 'icon-account-balance-wallet', badge: '1' }, //account_balance_wallet
      { title: 'App Discounts', component: CurrentDeals, icon: 'icon-money', badge: 'none'},
      //{ title: 'Rewards', component: RewardsPage, icon: 'happy', badge: '1234 points' },
      { title: 'Car Wash Services', component: CarWashServices, icon: 'icon-local-carwash', badge: 'none' },
      { title: 'Prepaid Club Plans', component: CarWashClubPlans, icon: 'icon-club-plans', badge: 'none' },
      { title: 'Unlimited Wash Plans', component: UnlimitedWashPlans, icon: 'refresh', badge: 'none' },
      { title: 'Oil and Lube Services', component: OilLubeServices, icon: 'build', badge: 'none'},
      { title: 'Detail Services', component: DetailServices, icon: 'icon-taxi', badge: 'none' },
      { title: 'Your Favorites', component: BookmarkPage, icon: 'star', badge: 'none' },
      { title: 'Locations', component: PageLocations, icon: 'pin', badge: 'none' },
      { title: 'Text Club', component: TextClub, icon: 'text', badge: 'none' },
      { title: 'Feedback', component: FeedbackPage, icon: 'happy', badge: 'none' },
      /*{ title: 'Cart', component: CartPage, icon: 'shopping_cart', badge: 'none' },*/ //temporarily remove cart
    ];
    this.counter = 0;
    if (this.auth.isAuthenticated()) {
        this.account_page = { title: 'Your Account', component: Account };
        // let's also load up the data from the server
        this.user.load().then(() => {
            console.log("successfully loaded user data");
        });
    }
    else
        this.account_page = { title: 'Your Account', component: Login };
    // initialize database
    this.initializeDatabase();
  }

  initializeApp() {
    if (!this.hasInit) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initializeDeals();
      
      // set up Android back button
      
      this.platform.registerBackButtonAction(() => {
        if (this.nav.canGoBack()) { // pop a page from nav
            this.nav.pop();
        }
        else {
            // for debugging
            console.log(this.nav.getActive().name); // will return 't' due to minification
            if (this.nav.getActive().instance instanceof Page1) { // exit the app
                this.platform.exitApp();
            }
            else {
                this.nav.setRoot(Page1); // go to Page1
            }
        }
      });
      
    });
    }
    this.hasInit = true;
  }
  
  initializeDatabase() {
    this.db.connect();
    if (this.counter > 4) // we're not loading the database :(
    {
        this.initializeApp();
    }
    this.db.status().subscribe( (status) => {
      if (status.type == 'error') {
        this.db.disconnect();
          //let loading = this.loadingCtrl.create();
          //loading.present();
          console.log("got error");
          setTimeout(()=>{
            this.db.connect();
          }, 4000);
      }
      else if (status.type == 'reconnecting') {
        this.db.disconnect();
        setTimeout(()=>{
            this.db.connect();
            this.initializeApp();
        }, 4000)
        console.log("was reconnecting");
      }
      else if (status.type == 'disconnected') {
        setTimeout(() => {
            this.db.connect();
            this.initializeApp();
        }, 4000);
        console.log("was disconnected");
      }
      else {
        this.initializeApp();
      }
        //Here I load my Services with watch for realtime connections
    });
  }
  initializeDeals() {
    this.numDeals = '3';
    // TODO:
    /*
    let downloadedDeals = get from storage array current deals
    this.numDeals = downloadedDeals.length;
    AND make sure that downloadedDeals does not return null...
    * if downloadedDeals
        this.numDeals = downloadedDeals.length
    */
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
    /*
    * this function opens either the login or account page based on the value of this.auth.isAuthenticated()
    */
    openAccountPage() {
        // check if authenticated
        if (this.auth.isAuthenticated()) {
            this.nav.setRoot(Account);
        }
        else {
            this.nav.setRoot(Login);
        }
    }
  
  onMenuOpen(event) {
    this.events.publish('sidebar:open');
    }

    onMenuClose(event) {
        this.events.publish('sidebar:close');
    }
    
    useBorder(title) {
        if (title == "Rewards") {
            return '2px solid #456592';
        }
        else{
            return '';
        }
    }
}
