import { AuthService } from './../auth/auth.service';
import { AppUser } from '../models/app-user';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import * as firebase from 'firebase';
import { getObservableFromList } from '../firebase-extension';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: any[]
  constructor(private db: AngularFireDatabase) { 
  }

  save(user: firebase.User) {
    this.db.object('/users/' + user.uid).update({
      email: user.email

    });
  }

  get(uid: string): AngularFireObject<AppUser> {
    return this.db.object('/users/' + uid);
  }
  
  update(userId, user) {
    this.db.object('/users/'+ userId).update(user);
  }
  getAll() {
    let list = this.db.list('/users');
    return getObservableFromList(list);
  }
}
