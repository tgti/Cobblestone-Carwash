import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpModule } from '@angular/http';

import { Page1 } from '../pages/page1/page1';
import { PageLocations } from '../pages/page-locations/page-locations';
import { TextClub, SafePipe } from '../pages/text-club/text-club';
import { FeedbackPage } from '../pages/feedback-page/feedback-page';
import { SectionsPage } from '../pages/sections-page/sections-page';
import { IndividualSectionPage } from '../pages/individual-section-page/individual-section-page';
import { ItemPage } from '../pages/item-page/item-page';
import { Search } from '../pages/search/search';
import { CartPage } from '../pages/cart/cart';
import { ContactPage } from '../pages/contact-page/contact-page';
import { BookmarkPage } from '../pages/bookmark-page/bookmark-page';
import { Wallet } from '../pages/wallet/wallet';
import { Rewards } from '../pages/rewards/rewards';
import { CurrentDeals } from '../pages/current-deals/current-deals';

import { Account } from '../pages/account/account';
import { Login } from '../pages/login/login';
import { CreateAccount } from '../pages/create-account/create-account';

import { CarWashServices } from '../pages/car-wash-services/car-wash-services';
import { CarWashClubPlans } from '../pages/car-wash-club-plans/car-wash-club-plans';
import { UnlimitedWashPlans } from '../pages/unlimited-wash-plans/unlimited-wash-plans';
import { OilLubeServices } from '../pages/oil-lube-services/oil-lube-services';
import { DetailServices } from '../pages/detail-services/detail-services';
import { FavoritesTab } from '../pages/favorites-tab/favorites-tab';
import { DealImage } from '../pages/deal-image/deal-image';

import { IonicStorageModule } from '@ionic/storage'; // for storage provider

import { GlobalVars } from '../providers/global';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
    'core': {
        'app_id': '65c846ce'
    },
    'push': {
        'sender_id': '559520855261',
        'pluginConfig': {
            'ios': {
                'badge': true,
                'sound': true
            },
            'android': {
                'iconColor': '#343434',
            }
        }
    }
}

@NgModule({
  declarations: [
    MyApp,
    Page1,
    PageLocations,
    TextClub,
    FeedbackPage,
    SafePipe,
    SectionsPage,
    IndividualSectionPage,
    ItemPage,
    Search,
    CartPage,
    ContactPage,
    BookmarkPage,
    Wallet,
    Rewards,
    CurrentDeals,
    Account,
    Login,
    CreateAccount,
    CarWashServices,
    CarWashClubPlans,
    UnlimitedWashPlans,
    OilLubeServices,
    DetailServices,
    FavoritesTab,
    DealImage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot(),
    BrowserModule, // for ionic 3.0.1
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    PageLocations,
    TextClub,
    FeedbackPage,
    SectionsPage,
    IndividualSectionPage,
    ItemPage,
    Search,
    CartPage,
    ContactPage,
    BookmarkPage,
    Wallet,
    Rewards,
    CurrentDeals,
    Account,
    Login,
    CreateAccount,
    CarWashServices,
    CarWashClubPlans,
    UnlimitedWashPlans,
    OilLubeServices,
    DetailServices,
    FavoritesTab,
    DealImage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalVars
  ]
})
export class AppModule {}
