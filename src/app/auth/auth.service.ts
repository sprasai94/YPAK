import { UserService } from './../service/user.service';
import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AppUser } from '../models/app-user';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User>;

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private userService: UserService) { 
    this.user$ = afAuth.authState;
    }
  //   {
  //   this.afAuth.authState.subscribe(user => {
  //     if(user) {
  //       this.user$ = user;
  //       localStorage.setItem('user', JSON.stringify(this.user$));
  //     } else {
  //       localStorage.setItem('user', null);
  //     }
  //   })
  //  }

   async login(formData) {
    var result = await this.afAuth.signInWithEmailAndPassword(
      formData.value.email, 
      formData.value.password
      );
    this.router.navigate(['/menu']);
  }

  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

//   get isLoggedIn(): boolean {
//     const  user  =  JSON.parse(localStorage.getItem('user'));
//     return  user  !==  null;
// }

get appUser$() : Observable<AppUser> {
  return this.user$
   .pipe(switchMap(user => {
     if (user) return this.userService.get(user.uid).valueChanges();
     return Observable.of(null);}))
}

}
