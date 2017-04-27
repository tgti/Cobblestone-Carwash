//import { PageLocations } from '../pages/pageLocations/pageLocations';
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { Auth, User } from '@ionic/cloud-angular'; // so we can store data to the user instead of in storage

import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class GlobalVars {
    _newVar: string;
    CART_ITEMS = 'cartItems';
    BOOKMARKS = 'bookmarks';
    REMINDER = 'reminder';
    DOWNLOADED_DEALS = 'downloaded_deals';
    OLD_DEALS = 'old_deals';
    numberLeft: number;
    API_KEY = 'UjpeAobFC4aNpXTIO7FlY4Fe8o8vDB0J5DzoF1Nn';
    public api_url = 'https://0pktgh8m23.execute-api.us-west-1.amazonaws.com/prod/';
    public api_key_options: any;
    
    //TODO uncomment all API-related things

    // storage is for local storage
    // user is for cross-device user data
    constructor(public storage: Storage, public user: User, public auth: Auth) { //
        let mHeaders = new Headers({ "X-API-KEY":this.API_KEY });
        this.api_key_options = new RequestOptions ({
            headers: mHeaders
        });
    }
    
    initializeBookmarks() {
        var bookmarks = this.user.get(this.BOOKMARKS, null);
        if (bookmarks == null){
            let mArray = [];
            this.user.set(this.BOOKMARKS, mArray);

            this.updateUser();
        }
        
        // do the same for deals
        var deals = this.user.get(this.DOWNLOADED_DEALS, null);
        
        if (deals == null) {
            let mArray = [];
            this.user.set(this.DOWNLOADED_DEALS, mArray);

            this.updateUser();
        }
        var olddeals = this.user.get(this.OLD_DEALS, null);
        if (olddeals == null) {
            let mArray = [];
            this.user.set(this.OLD_DEALS, mArray);

            this.updateUser();
        }
    };
    getBookmarks() {
        return new Promise(resolve => {
            var bookmarks = this.user.get(this.BOOKMARKS, null);
            resolve(bookmarks);
        })
    }
    addBookmark(ID) {
        var bookmarks = this.user.get(this.BOOKMARKS, null);
        //console.log(bookmarks);
        bookmarks.push(ID);
        this.user.set(this.BOOKMARKS, bookmarks);

        this.updateUser();
    }
    removeBookmark(ID) {
        var bookmarks = this.user.get(this.BOOKMARKS, null);
        var index = bookmarks.indexOf(ID, 0);
        if (index > -1) {
            bookmarks.splice(index, 1);
        }
        this.user.set(this.BOOKMARKS, bookmarks);

        this.updateUser();
    }
    
    /* 
    * returns the old deals array
    */
    getOldDeals() {
        return new Promise(resolve => {
            var deals = this.user.get(this.OLD_DEALS, null);
            resolve(deals);
        })
    }
    /*
    * returns the current deals array
    */
    getDownloadedDeals() {
        return new Promise(resolve => {
            var deals = this.user.get(this.DOWNLOADED_DEALS, null);
            resolve(deals);
        });
    }    
    addDownloadedDeal(deal) {
        var deals = this.user.get(this.DOWNLOADED_DEALS, null);
        deals.push(deal);
        this.user.set(this.DOWNLOADED_DEALS, deals);

        this.updateUser();
    }
    removeDownloadedDeal(id) {
        var deals = this.user.get(this.DOWNLOADED_DEALS, null);
        // make an array of ids
        var idArray = [];
        for (let deal of deals) {
            idArray.push(deal.id);
        }
        var index = idArray.indexOf(id, 0); // will always return -1...we're searching deals.id
        if (index > -1) {
            deals.splice(index, 1);
        }
        this.user.set(this.DOWNLOADED_DEALS, deals);

        this.updateUser();
    }
    addOldDeal(deal) {
        var deals = this.user.get(this.OLD_DEALS, null);
        deals.push(deal);
        this.user.set(this.OLD_DEALS, deals);

        this.updateUser();
    }
    
    
    /*
    * checks to see if the user has asked us not to remind them
    * about the 5 minute lifespan of a redeemed product
    */
    getReminderResponse() {
        return new Promise(resolve => {
            this.storage.get(this.REMINDER).then((reminder) => {
                resolve(reminder);
            })
        });
    }
    /*
    * INPUT: a new value that is a boolean value
    */
    setReminderResponse(newValue: boolean) {
        this.storage.set(this.REMINDER, newValue);
    }
    
    initializeReminder() {
        this.getReminderResponse().then((response) => {
            if (response == null) {
                this.setReminderResponse(true);
            }
        });
    }
    
    getCart(IDs) {
        return new Promise(resolve => {
            var returnValues: { [id: string] : number } = {};
            // foreach I D, call this.storage.get with I D and push that value to an array
            this.numberLeft = IDs.length;
            for (let i = 0; i < IDs.length; i++) {
                this.storage.get(IDs[i]).then((value) => {
                    if ((value != 0) && (value != '') && (value != null))
                        returnValues[IDs[i]] = value;
                    this.numberLeft -= 1;
                });
            }
            if (this.numberLeft > 0) {
                this.waitFunction(true).then(() => {
                    resolve(returnValues);
                });
            }
        });
    }
    waitFunction(top: any) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (this.numberLeft > 0) {
                    this.waitFunction(false);
                }
                else {
                    if (top == false) {
                        return;
                    }
                    else {
                        resolve();
                    }
                }
            }, 200);
            console.log("nested function ran");
        })
    }
    addToCart(id: string, qty: number) {
        this.storage.get(id).then((value) => {
            if (!((value != 0) && (value != '') && (value != null))) {
                this.storage.set(id, qty); // add the id of the service and the quantity to the cart
                console.log("added items to cart");
                console.log(value);
            }
            else {
                this.storage.set(id, qty+value); // we're adding more items to the cart
                console.log("appended items to cart");
                console.log(value);
            }
        });
    }
    removeFromCart(id: string) {
        this.storage.remove(id); // remove item from cart with id
    }
    
    
    
    updateUser() {
        if (this.auth.isAuthenticated()) {
            // we can push the data to the server
            this.user.save();
        }
    }
}