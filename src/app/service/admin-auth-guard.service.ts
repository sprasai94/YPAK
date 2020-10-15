import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private auth: AuthService, private userService: UserService, private router: Router) { }

  canActivate(route, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.appUser$
    .pipe(map(appUser => {
      if (appUser.isAdmin) return true;
      else {
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
        return false;
      }
   }))
}
}
