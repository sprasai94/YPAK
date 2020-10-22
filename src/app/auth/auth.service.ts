import { environment } from './../../environments/environment';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserService } from './../service/user.service';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from  "@angular/router";
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AppUser } from '../models/app-user';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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


  async logout() {
    await this.afAuth.signOut();
    // localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  async updateUser(user) {
    let id = (await this.afAuth.currentUser).uid;
    console.log(id);
    //this.db.object('/users/'+ id).update(user);
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

}
