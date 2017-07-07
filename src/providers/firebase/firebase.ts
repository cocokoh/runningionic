import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  constructor(public http: Http, public afd: AngularFireDatabase) {
    console.log('Hello FirebaseProvider Provider');
  }

  getComment() {
    return this.afd.list('/comment/');
  }

  addComment(name: any) {
    this.afd.list('/comment/').push(name);
  }

  removeComment(id: any) {
    this.afd.list('/comment/').remove(id);
  }

  savePic(id: any, url: string, latlng: object){
    this.afd.list('/images/').push({id: id, url: url, latlng: latlng})
  }

  getPic(){
    return this.afd.list('/images/');
  }

  getPlace(){
    return this.afd.list('/places')
  }

  addPlace(id: string, latlng: object){
    this.afd.list('/places/').push({id: id, latlng: latlng})
  }

  updateLocation(key: string, latlng: object){
    this.afd.list('/places/').update(key, {latlng: latlng})
  }

}
