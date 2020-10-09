import { AppUser } from '../models/app-user';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: any[]
  constructor(private db: AngularFireDatabase) { 
    // db.list('/users').valueChanges()
    //   .subscribe(users => {
    //     this.users = users;
    //     console.log(this.users);
    //   });
  }

  save(user: firebase.User) {
    this.db.object('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email

    });
  }
  get(uid: string): AngularFireObject<AppUser> {
    return this.db.object('/users/' + uid);
  }
}
