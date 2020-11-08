import { AdminAuthGuard } from './service/admin-auth-guard.service';
import { AuthGuard } from './service/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from './../environments/environment';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserManagementComponent } from './user-management/user-management.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    MenuComponent,
    UserManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule,
    RouterModule.forRoot([
    { path:'', 
      component: HomeComponent
    },
    { path: 'login',
       component: LoginComponent 
    },
    { path:'menu', 
      component: MenuComponent, 
      canActivate: [AuthGuard, AdminAuthGuard] 
    },
    { path: 'user-management/:id', 
    component: UserManagementComponent, 
    canActivate: [AuthGuard, AdminAuthGuard]
    },
    { path: 'user-management', 
      component: UserManagementComponent, 
      canActivate: [AuthGuard, AdminAuthGuard]
    }
    ]),
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [ 
    AuthGuard,
    AdminAuthGuard
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
