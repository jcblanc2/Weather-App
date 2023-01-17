import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {City} from "../../models/city";

@Injectable({
  providedIn: 'root'
})
export class FbService {

  constructor(public auth: AngularFireAuth, public fs: AngularFirestore) {
  }

  userUid : string = '';
  isAuth() {
    return this.auth.currentUser !== null;
  }

  signin(email:string, pass:string) {
    return this.auth.signInWithEmailAndPassword(email, pass);
  }

  signup(email:string, pass:string) {
    return this.auth.createUserWithEmailAndPassword(email, pass);
  }

  addCity(city:City) {
    city.id = this.fs.createId();
    return this.fs.collection("/Cities").add(city);
  }

  getCities(){
    return this.fs.collection('/Cities').snapshotChanges();
  }

}
