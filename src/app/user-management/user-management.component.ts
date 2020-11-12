import { AppUser } from './../models/app-user';
import { UserService } from './../service/user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit} from '@angular/core';
import { take, switchMap} from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: AppUser[] = [];
  filteredUsers: AppUser[] = [];
  user = {};
  id;

  constructor(
    private auth: AuthService, 
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { 
      this.route.params.subscribe((params = {}) => {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) this.userService.get(this.id).valueChanges().pipe(take(1)).
          subscribe(u => this.user = u);
        });
    }

  save(user) {
    if (this.id) this.userService.update(this.id, user);
    else this.auth.createUser(user);
    this.router.navigate(['/user-management']);
  
  }
  clearForm(form:NgForm) {
    this.router.navigate(['/user-management']);
  }

  get(userId){
    return this.userService.get(userId);
  }
  update(userId, user) {
    this.userService.update(userId, user);
  }


  async ngOnInit() {
    this.populateUsers();
  }

  private populateUsers() {
    this.userService
      .getAll()
      .pipe(switchMap(users => {
        this.users = this.filteredUsers= users;
        return this.route.queryParamMap;
      })).subscribe()
  }

  filter(query: string) {
    this.filteredUsers = (query) ?
     this.users.filter(u => u.name.toLowerCase().includes(query.toLowerCase())) :
     this.users;
  }

}
