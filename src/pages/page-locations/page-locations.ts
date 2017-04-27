import { Component, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController, NavParams, Content, Platform, Events, LoadingController } from 'ionic-angular';
import { Geolocation, LaunchNavigator, GeolocationOptions } from 'ionic-native';
import { Search } from '../search/search'; // for search icon
import { CartPage } from '../cart/cart'; // for cart icon
import {
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapsLatLng,
 CameraPosition,
 GoogleMapsMarkerOptions,
 GoogleMapsMarker
} from 'ionic-native';
import { Database } from '@ionic/cloud-angular';

import { Http } from '@angular/http';
import { GlobalVars } from '../../providers/global';
import 'rxjs/add/operator/map';

declare var window;

/*
  Generated class for the PageLocations page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-page-locations',
  templateUrl: 'page-locations.html'
})
export class PageLocations {
    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('scrollcontent') scrollContent: ElementRef;
    @ViewChild(Content) content: Content;
    
    map: any;
    fixedheight: any;
    ready_to_load: boolean;
    // set up all the locations
    locations: Array<{lat: number, lon: number, name: string, address: string, phone: string, distance: number, directions: any}>;
    loadingSpinner: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, private sanitization:DomSanitizer, public db: Database, public plt: Platform, private events: Events, public loadingCtrl: LoadingController, public http: Http, public globalVars: GlobalVars) {
        this.locations = [];
        //use db
        this.http.get(`${this.globalVars.api_url}locations`, this.globalVars.api_key_options).map(res => res.json()).subscribe((locations) => {
            let mLocations = locations.locations;
            for (let i = 0; i < mLocations.length; i++) {
                let latlng = mLocations[i].latlon.split(",");
                let newLocation = {
                    lat: latlng[0],
                    lon: latlng[1],
                    name: mLocations[i].title,
                    phone: mLocations[i].phone,
                    address: mLocations[i].street,
                    distance: 0,
                    directions: ""
                };
                this.locations.push(newLocation);
            }
            if (this.ready_to_load) {
                this.loadMap();
            }
            else {
                setTimeout(() => {
                    if (this.ready_to_load) {
                        this.loadMap();
                    }
                    else {
                        setTimeout(() => {
                            if (this.ready_to_load) {
                                this.loadMap();
                            }
                            else {
                                // wow we're slow
                                setTimeout(() => {
                                    this.loadMap(); // go for it at this point
                                }, 2000);
                            }
                        }, 1500);
                    }
                }, 1000);
            }
        }, (error) => {
            console.log(error);
        });
        
        /*this.locations = [{lat: 33.629719, lon: -111.892592, name: "SCOTTSDALE - FLWright & Hayden", address: "15816 North Pima Road Scottsdale, AZ 85260", phone: "tel:+14805960689", distance: 0},
        {lat: 33.686938, lon: -111.924435, name: "SCOTTSDALE - Scottsdale Rd & Pinnacle Peak Rd.", address: "22111 N Scottsdale Rd Scottsdale, AZ 85255", phone: "tel:+14805639500", distance: 0},
        {lat: 33.639903, lon: -112.001040, name: "PHOENIX - Bell Rd & 51 Fwy.", address: "3739 E Bell Rd. Phoenix, AZ 85032", phone: "tel:+16027870469", distance: 0},
        {lat: 33.27528, lon: -111.85794, name: "CHANDLER - Alma School & Germann", address: "2021 S Alma School Rd. Chandler, AZ 85248", phone: "tel:+14802220963", distance: 0},
        {lat: 33.638141, lon: -112.357151, name: "SURPRISE - Bell Rd & Grand Ave", address: "13811 W Bell Rd. Surprise, AZ 85374", phone: "tel:+16232090053", distance: 0},
        {lat: 33.38219, lon: -111.59846, name: "MESA - Signal Butte S of US 60", address: "1855 S Signal Butte Mesa, AZ 85209", phone: "tel:+14806266000", distance: 0},
        {lat: 33.393180, lon: -111.717394, name: "MESA - Southern & Higley", address: "5425 E Southern Ave Mesa, AZ 85206", phone: "tel:+14803240100", distance: 0}];*/
        
        //instead use cloud services
    }
    callNumber(number) {
        window.location = `tel:+1${number}`;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PageLocations');
        this.ready_to_load = true;
    }
    loadMap () {
        // open loading spinner
        this.loadingSpinner = this.loadingCtrl.create({
            content: 'Getting the location closest to you...'
        });
        this.loadingSpinner.present();
        setTimeout(() => {
            if (this.loadingSpinner) {
                this.loadingSpinner.dismiss();
            }
        }, 11000); // give up after eleven seconds
        
        let optionsForGeolocation: GeolocationOptions = {
            timeout: 10000
        };
        
        Geolocation.getCurrentPosition(optionsForGeolocation).then((resp) => {
            let latLng: GoogleMapsLatLng = new GoogleMapsLatLng(33.5153135,-112.0824266);
            let position: CameraPosition = {
                target: latLng,
                zoom: 8
            }

            this.map = new GoogleMap(this.mapElement.nativeElement);
            this.map.moveCamera(position);
            this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {

                this.events.subscribe('sidebar:open', () => {
                    this.map.setClickable(false);
                });

                this.events.subscribe('sidebar:close', () => {
                    this.map.setClickable(true)
                });
                console.log("map is ready");
                for (var location of this.locations) {
                    this.addMarker(location.lat, location.lon, location.name);
                }            
            });
            let myLocation: GoogleMapsLatLng = new GoogleMapsLatLng(resp.coords.latitude, resp.coords.longitude);
            /*let marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: {lat: resp.coords.latitude, lng: resp.coords.longitude}
            });*/
            // we will use the location to calculate the distance to the different locations
            for (let i = 0; i < this.locations.length; i++) {
                this.locations[i].distance = this.getDistanceBetweenPoints(myLocation, new GoogleMapsLatLng(this.locations[i].lat,this.locations[i].lon), 'miles');
                console.log(`distance: ${this.locations[i].distance}`);
            }
            console.log(`my location longitude: ${resp.coords.longitude}`);
            // sort the locations based on the distance from the person
            this.locations = this.locations.sort((n1, n2) => {
                if (n1.distance > n2.distance) {
                    return 1;
                }
                if (n1.distance < n2.distance) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
            this.loadingSpinner.dismiss();
        }, (error) => {
            alert("No location detected, please check to see that location services are enabled");
            console.log("Could not detect location");
            console.log(error);
            //prompt to turn on location
            //this.diagnostic.switchToLocationSettings(); // won't work on iOS
            
            //still load map            
            let latLng: GoogleMapsLatLng = new GoogleMapsLatLng(33.5153135,-112.0824266);
            let position: CameraPosition = {
                target: latLng,
                zoom: 8
            }

            this.map = new GoogleMap(this.mapElement.nativeElement);
            this.map.moveCamera(position);
            this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {

                this.events.subscribe('sidebar:open', () => {
                    this.map.setClickable(false);
                });

                this.events.subscribe('sidebar:close', () => {
                    this.map.setClickable(true)
                });

                for (var location of this.locations) {
                    this.addMarker(location.lat, location.lon, location.name);
                }            
            });
            this.loadingSpinner.dismiss();
        });
    }
    goToAddress(ad) {
    LaunchNavigator.navigate(ad);
    }
  addMarker(lat, lon, name) {
    let mPosition: GoogleMapsLatLng = new GoogleMapsLatLng(lat,lon);
    // animation: plugin.google.maps.Animation.DROP,
    let markerOptions: GoogleMapsMarkerOptions = {
        position: mPosition,
        title: name
    };
    //let content = `<p>${name}</p>`;
    //this.addInfoWindow(marker, content);
    this.map.addMarker(markerOptions).then((marker: GoogleMapsMarker) => {
        //marker.showInfoWindow();
    });
  }
  /*addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
        content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
    })
  }*/
  
  // click event listener for each card
  cardClickEvent(lat, lon) {
    let latLng: GoogleMapsLatLng = new GoogleMapsLatLng(lat,lon);
    this.content.scrollToTop();
    this.map.animateCamera({
        target: latLng,
        duration: 600,
        zoom: 12,
    });
  }
  
  getDistanceBetweenPoints(start, end, units){
 
        let earthRadius = {
            miles: 3958.8,
            km: 6371
        };
 
        let R = earthRadius[units || 'miles'];
        let lat1 = start.lat;
        let lon1 = start.lng;
        let lat2 = end.lat;
        let lon2 = end.lng;
        console.log(`start: ${lat1}, ${lon1} end: ${lat2}, ${lon2}`);
 
        let dLat = this.toRad((lat2 - lat1));
        let dLon = this.toRad((lon2 - lon1));
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        
        var rounded = Math.round( d * 10 ) / 10;
        rounded = parseFloat(rounded.toFixed(1));
 
        return rounded;
 
    }
 
    toRad(x){
        return x * Math.PI / 180;
    }
    
    ionViewWillLeave() {
        this.events.unsubscribe('sidebar:open');
        this.events.unsubscribe('sibebar:close');
    }
    
    openSearch(event) {
        this.navCtrl.push(Search, {}, {animate: true, direction: 'forward'}); // push
    }
    openCart(event) {
        this.navCtrl.setRoot(CartPage, {}, {animate: true, direction: 'forward'}); // set as root
    }
}