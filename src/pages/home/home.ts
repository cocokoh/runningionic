import { Component } from '@angular/core';
// import { NgForm } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController, NavController, ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { StartPage } from '../start/start';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-user',
  providers: [Facebook, Geolocation],
  templateUrl: 'home.html'
})
export class HomePage {
  StartPage = StartPage;
  MapPage = MapPage;
  submitted: boolean = false;
  supportMessage: string;
  comment: FirebaseListObservable<any[]>;
  images: FirebaseListObservable<any[]>;
  newComment = '';
  fbid: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private fb: Facebook,
    public firebaseProvider: FirebaseProvider,
    public geolocation: Geolocation,
    public afd: AngularFireDatabase
  ) {
  this.comment = this.firebaseProvider.getComment();
  this.images = this.firebaseProvider.getPic();
  }

  addComment() {
  this.firebaseProvider.addComment(this.newComment);
}

  ionViewDidEnter() {
    let toast = this.toastCtrl.create({
      message: 'Welcome',
      duration: 3000
    });
    toast.present();
  }

  // facebookLogin(){
  //   this.fb.login(['email'])
  //   .then((resp)=>{
  //     this.fb.getLoginStatus().then((reply)=>{
  //       if (reply.status == "connected"){
  //       let fbid = reply.authResponse.userID
  //       console.log(fbid)
  //       let result = this.afd.list('/places/', {
  //         query:{
  //           equalTo: fbid
  //         }
  //       })
  //       result.subscribe((data=>{
  //         data.forEach((id)=>{
  //           console.log(id.id, reply.status)
  //           if (id.id == fbid){
  //             alert('next')
  //             this.navCtrl.push(MapPage)
  //           } else {
  //             alert('start')
  //             this.navCtrl.push(StartPage)
  //           }
  //           this.fb.api("/" + reply.authResponse.userID + "?fields=age_range", [])
  //           .then((response)=>{
  //             console.log(response)
  //           })
  //         })
  //       }))
  //       }
  //     })
  //   })
  // }


facebookLogin(){
  var result = this.afd.list('/places/')
  console.log(result)
  this.fb.login(['email'])
  .then((resp)=>{
    this.fb.getLoginStatus().then((reply)=>{
      this.fbid = reply.authResponse.userID
      if(reply.status == "connected"){
        this.navCtrl.push(StartPage)
        this.fb.api("/" + reply.authResponse.userID + "?fields=age_range", [])
        .then((response)=>{
          console.log(response)
        })
      }
    })
  })}

getDetails(){
  this.fb.getLoginStatus()
  .then((response)=>{
    if (response.status == "connected"){
      this.fb.api("/" + response.authResponse.userID + "?fields=age_range", [])
      .then((response)=>{
        alert(JSON.stringify(response))
      }, (error)=> {alert(error)
    })
  } else {
    console.log('not logged in')
  }
  })
}

facebookLogout(){
  this.fb.logout().then((response)=>{
    alert(response.status)
    alert(JSON.stringify(response))
  })
}
  // submit(form: NgForm) {
  //   this.submitted = true;
  //
  //   if (form.valid) {
  //     this.supportMessage = '';
  //     this.submitted = false;
  //
  //     let toast = this.toastCtrl.create({
  //       message: 'Your support request has been sent.',
  //       duration: 3000
  //     });
  //     toast.present();
  //   }
  // }

  // If the user enters text in the support question and then navigates
  // without submitting first, ask if they meant to leave the page
  // ionViewCanLeave(): boolean | Promise<boolean> {
  //   // If the support message is empty we should just navigate
  //   if (!this.supportMessage || this.supportMessage.trim().length === 0) {
  //     return true;
  //   }
  //
  //   return new Promise((resolve: any, reject: any) => {
  //     let alert = this.alertCtrl.create({
  //       title: 'Leave this page?',
  //       message: 'Are you sure you want to leave this page? Your support message will not be submitted.'
  //     });
  //     alert.addButton({ text: 'Stay', handler: reject });
  //     alert.addButton({ text: 'Leave', role: 'cancel', handler: resolve });
  //
  //     alert.present();
  //   });
  // }
}
