import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { ConferenceData } from '../../providers/conference-data';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform, ModalController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {DomSanitizer} from '@angular/platform-browser';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { FirebaseApp } from 'angularfire2';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { ModalPage } from './modal-page';
declare var google: any;
declare var cordova: any;

@Component({
  selector: 'page-map',
  providers: [Camera, Geolocation, File, Transfer, SocialSharing, Facebook],
  templateUrl: 'map.html'
})
export class MapPage {
  public photos: any;
  public base64Image: string;
  public image: string;
  public fbid: string;
  public myLatLng: any;
  public places: any;
  public key: string;
  public lat: number;
  public lng: number;
  images: FirebaseListObservable<any[]>;
  @ViewChild('mapCanvas') mapElement: ElementRef;
  constructor(private camera: Camera, public confData: ConferenceData, public platform: Platform, private geolocation: Geolocation, public _DomSanitizationService: DomSanitizer, private file: File, private transfer: Transfer, private socialSharing: SocialSharing, public firebaseProvider: FirebaseProvider, private fb: Facebook, public modalCtrl: ModalController, public afd: AngularFireDatabase) {
    this.places = this.firebaseProvider.getPlace()
  }

  ngOnInit() {
    this.photos = [];
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 50,
      saveToPhotoAlbum: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    const fileTransfer: TransferObject = this.transfer.create();
    const server = "https://api.cloudinary.com/v1_1/auguried/image/upload";
    this
      .camera
      .getPicture(options)
      .then((imageURI) => {
        var image = imageURI;
        var currentName = imageURI.replace(/^.*[\\\/]/, '');
        var d = new Date(),
          n = d.getTime(),
          newFileName = n + ".jpeg";
        const ftOptions: FileUploadOptions = {
          fileKey: "file",
          fileName: newFileName,
          chunkedMode: false,
          params: {
            "upload_preset": "hpxl4iuh"
          }
        }
        fileTransfer.upload(imageURI, server, ftOptions).then((result) => {
          alert('upload!')
          var response = JSON.parse(result.response)
          this.base64Image = response.secure_url
          this
            .photos
            .push(this.base64Image);
          this
            .photos
            .reverse();
        })
      }, (err) => {
        console.log(err);
      });
  }

  shareFb() {
    this.socialSharing.shareViaFacebook("Ridge Running!", this.image, this.base64Image)
  }


  ionViewDidLoad() {
    this.fb.getLoginStatus()
      .then((response) => {
        this.fbid = response.authResponse.userID
      })
    let result = this.afd.list('/places/', {
      query: {
        equalTo: this.fbid
      }
    })
    result.subscribe((data => {
      data.forEach((id)=>{
        if(id.id==this.fbid){
          this.key = id.$key
        }
      })
    }))

    this.confData.getMap().subscribe((mapData: any) => {
      let mapEle = this.mapElement.nativeElement;

      var styledMapType = new google.maps.StyledMapType(
        [
          { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#c9b2a6' }]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#dcd2be' }]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ae9e90' }]
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{ color: '#dfd2ae' }]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#dfd2ae' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#93817c' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{ color: '#a5b076' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#447530' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#f5f1e6' }]
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{ color: '#fdfcf8' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#f8c967' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#e9bc62' }]
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [{ color: '#e98d58' }]
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#db8555' }]
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#806b63' }]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{ color: '#dfd2ae' }]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#8f7d77' }]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#ebe3cd' }]
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{ color: '#dfd2ae' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{ color: '#b9d3c2' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#92998d' }]
          }
        ],
        { name: 'Styled Map' });

      let map = new google.maps.Map(mapEle, {
        center: { lat: 1.2761007, lng: 103.813255 },
        zoom: 14,
        mapTypeControlOptions: {
          mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
            'styled_map']
        }
      });

      // var flightPlanCoordinates = [
      //   { lat: 1.2737864, lng: 103.8174964 },
      //   { lat: 1.2761007, lng: 103.813255 },
      //   { lat: 1.2782322, lng: 103.8110981 },
      //   { lat: 1.2804993, lng: 103.8017108 },
      //   { lat: 1.2792443, lng: 103.8014168 },
      //   { lat: 1.2794723, lng: 103.7996038 },
      //   { lat: 1.2807203, lng: 103.7980268 }
      // ];
      // var flightPath = new google.maps.Polyline({
      //   path: flightPlanCoordinates,
      //   geodesic: true,
      //   strokeColor: '#FF0000',
      //   strokeOpacity: 1.0,
      //   strokeWeight: 2
      // });
      var watchid = 0;
      let watch = this.geolocation.watchPosition();
        watch.subscribe((resp) => {
          console.log('location' + watchid);
          watchid= watchid + 1;
          this.firebaseProvider.updateLocation(this.key, {lat: resp.coords.latitude, lng: resp.coords.longitude})
      });
      result.subscribe((data => {
        data.forEach((id)=>{
          console.log('plotting location of' + id.id)
          var marker = new google.maps.Marker({
            position: id.latlng,
            map: map,
            title: 'Hello World!'
          })
          if(id.id==this.fbid){
            var marker = new google.maps.Marker({
              position: { lat: id.latlng.lat, lng: id.latlng.lng },
              map: map,
              title: 'Hello World!'
            })
        }
        })
      }))

      google.maps.event.addListenerOnce(map, 'idle', () => {
        mapEle.classList.add('show-map');
      });
      map.mapTypes.set('styled_map', styledMapType);
      map.setMapTypeId('styled_map');
      // flightPath.setMap(map);
    })
  }


  savePic() {
    this.fb.getLoginStatus()
      .then((response) => {
        this.fbid = response.authResponse.userID
      })
    this.geolocation.getCurrentPosition().then((resp) => {
      this.myLatLng = { lat: resp.coords.latitude, lng: resp.coords.longitude };
      console.log(this.myLatLng)
      // this.setMarkers();
    })
    this.firebaseProvider.savePic(this.fbid, this.base64Image, this.myLatLng)
  }

  updateLocation() {
    let fbid = "1823166311331121"
    this.places.forEach((place: any) => {
      place.forEach((lo: any) => {
        if (lo.id == fbid) {
          this.firebaseProvider.updateLocation(lo.$key, { lat: 2.3, lng: 3.4 })
        }
      })
    });
  }

}
