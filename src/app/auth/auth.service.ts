import { AppUser } from './../models/app-user';
import { environment } from './../../environments/environment';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserService } from './../service/user.service';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from  "@angular/router";
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "@angular/fire/auth";
import { switchMap, take, map } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User>;
  user2$: Observable<firebase.User>;
  secondary_app;
  Id;

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private userService: UserService) { 
    this.user$ = afAuth.authState;
    }

   async login(formData) {
    var result = await this.afAuth.signInWithEmailAndPassword(
      formData.value.email, 
      formData.value.password
      );
    this.router.navigate(['/']);
  }
  
  async createUser(user) {
    if(!this.secondary_app) {
      this.secondary_app = firebase.initializeApp(environment.firebase, "secondary");
    }
    this.secondary_app.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(firebaseUser => {
        this.db.object('/users/'+ firebaseUser.user.uid).update(user);
      })
      .catch(err => {
        alert(err);
      })
    this.secondary_app.auth().signOut();
    
  }
  async updateEmail(selectedUser, user) {
    console.log("Email update");
    if(!this.secondary_app) {
      this.secondary_app = firebase.initializeApp(environment.firebase, "secondary");
    }
    await this.secondary_app.auth().signInWithEmailAndPassword(selectedUser.email, selectedUser.password)
      .then(async function(userCredential) {
        await userCredential.user.updateEmail(user.email)
        .catch(err => {
          alert(err);
        });
    })
    this.secondary_app.auth().signOut();
    
  }
  async updatePassword(selectedUser, user) {
    console.log("Password Update");
    if(!this.secondary_app) {
      this.secondary_app = firebase.initializeApp(environment.firebase, "secondary");
    }
    await this.secondary_app.auth().signInWithEmailAndPassword(user.email, selectedUser.password)
      .then(await function(userCredential) {
        userCredential.user.updatePassword(user.password)
        .catch(err => {
          alert(err);
        });
    })
    this.secondary_app.auth().signOut();
    
  }


  async logout() {
    await this.afAuth.signOut();
    // localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  async updateUser(userId,user) {
    let selectedUser : any;
    await this.getSingleUser(userId).subscribe(async (item) => {
      selectedUser = item.value;
      if (selectedUser.email.toLowerCase() != user.email.toLowerCase())
        await this.updateEmail(selectedUser, user);
      if (selectedUser.password != user.password)
        await this.updatePassword(selectedUser, user);
      
    });
    // sub.unsubscribe();
    // if (selectedUser.email != user.email)
    //   this.updateEmail(selectedUser, user);
     this.userService.update(userId,user);
    // console.log("here")
  }

  get(userId) {
    return this.db.object('/users/' + userId);
  }

get appUser$() : Observable<AppUser> {
  return this.user$
   .pipe(switchMap(user => {
     if (user) return this.userService.get(user.uid).valueChanges();
     return Observable.of(null);}))
}
getSingleUser(uid: string) {
  return this.db
    .object(`users/${uid}`)
    .snapshotChanges()
    .pipe(map(item => {
      const value = item.payload.val();
      const key = item.payload.key;
      return {key, value };
    }))
}

}
