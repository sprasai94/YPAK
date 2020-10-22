import { UserService } from './../service/user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit} from '@angular/core';
import { take} from 'rxjs/operators';
import { pipe } from 'rxjs-compat';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users$;
  constructor(
    private auth: AuthService, 
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { 
      this.users$ = this.userService.getAll();
    }

  save(user) {
    this.auth.createUser(user);
    this.router.navigate(['/user-management']);
  }

  ngOnInit(): void {
  }

}
