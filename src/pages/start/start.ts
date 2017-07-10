import { Component } from '@angular/core';
// import { NgForm } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { MapPage } from '../map/map';
import { AlertController, NavController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

@Component({
  selector: 'page-user',
  providers: [Geolocation, Facebook],
  templateUrl: 'start.html'
})
export class StartPage {
  MapPage = MapPage;
  public fbid: string;
  public myLatLng: any;
  places: FirebaseListObservable<any[]>;
  constructor (public navCtrl: NavController, private geolocation: Geolocation, public firebaseProvider: FirebaseProvider, private fb: Facebook){}

// onLocatePosition(){
// let position = this.geolocation.getCurrentPosition()
// position.then((resp) => {
//     this.navCtrl.push(resp.coords.latitude.toString())
// }).catch((error) => {
//   console.log('Error getting location', error);
// });
// }

addLocation(){
  this.fb.getLoginStatus()
  .then((response)=>{
    this.fbid = response.authResponse.userID
    this.myLatLng = { lat: 1.2737864, lng: 103.8174964 };
    this.firebaseProvider.addPlace(this.fbid, this.myLatLng);
    
    this.navCtrl.push(MapPage);
});
}

// goMap() {
//     this.navCtrl.push(MapPage);
// }



}
