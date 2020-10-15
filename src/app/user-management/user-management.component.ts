import { AuthService } from './../auth/auth.service';
import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  constructor(private auth: AuthService) { }

  save(user) {
    this.auth.createUser(user.email, user.password);
  }

  ngOnInit(): void {
  }

}
