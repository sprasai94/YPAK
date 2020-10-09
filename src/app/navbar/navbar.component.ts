import { AuthService } from './../auth/auth.service';
import { AppUser } from './../models/app-user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  appUser: AppUser;
  constructor(private auth: AuthService) {
  
    auth.appUser$.subscribe(appUser => this.appUser = this.appUser);
  }

  

}
