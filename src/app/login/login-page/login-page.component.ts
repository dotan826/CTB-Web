import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_USER_ID, GUEST_USER_ID, UserDetails } from '../../app-constants';
import { StoreService } from '../../store.service';
import { DatabaseService } from '../../database.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  providers: [MessageService]
})
export class LoginPageComponent implements OnInit {

  constructor(
    private router: Router,
    private store: StoreService,
    private database: DatabaseService,
    private messageService: MessageService
  ) {

  }

  ngOnInit(): void {

  }

  loginExist: boolean = true; // toggle Join Us / Back to Login
  rememberMe: boolean = false; // toggle Remember Me login option

  email: string = "";    // Login Exist User
  password: string = ""; // ...

  newName: string = "";          // Login New User
  newEmail: string = "";         // ...
  newPassword: string = "";      // ...
  confirmPassword: string = "";  // ...

  setLoginStatus(): void {
    this.loginExist = !this.loginExist;
  }

  signInNewUser(): void {
    if (this.isEmptyNewUser()) {
      this.database.singInNewUser({ name: this.newName, email: this.newEmail, password: this.newPassword }).subscribe(
        (result) => {
          if (result) {
            window.localStorage.setItem(APP_USER_ID, (result as UserDetails)._id); // save user name for future login (in Browser)
            this.router.navigate(['web', 'main']); // enter site
          }
          else {
            // window.alert("Failed to Create New User.\nPlease try again later.");
            this.messageService.add({severity:'error', summary: 'Creation Failed', detail: 'Failed to Create New User.\nMaybe this user already exist.\nPlease try to login or fill another new details.', sticky: true});
          }
        }
      );
    }
  }

  signInExistUser(): void {
    // if(this.rememberMe){ // if user want to be Remembered

    // }
    if (this.isEmptyExistUser()) {
      this.database.signInExistUser({ email: this.email, password: this.password }).subscribe(
        (result) => {
          if (result) {
            window.localStorage.setItem(APP_USER_ID, (result as UserDetails)._id); // save user name for future login (in Browser)
            this.router.navigate(['web', 'main']); // enter site
          }
          else {
            // window.alert("Login Failed.\nUser Not Exist.");
            this.messageService.add({severity:'error', summary: 'Login Failed', detail: 'Login Failed.\nUser Not Exist.', sticky: true});
          }
        }
      );
    }

  }

  guestLogin(): void {
    this.database.singInNewUser({ name: "Guest", email: "", password: "" }).subscribe(
      (result) => {
        if (result) {
          window.localStorage.setItem(APP_USER_ID, (result as UserDetails)._id); // save user name for future login (in Browser)
          this.router.navigate(['web', 'main']); // enter site
        }
        else {
          // window.alert("Failed to Create New User.\nPlease try again later.");
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to enter as a Guest.\nTry again later.', sticky: true});
        }
      }
    );

    // window.localStorage.setItem(APP_USER_ID, GUEST_USER_ID); // save user name for future login (in Browser)
    // this.router.navigate(['web', 'main']); // enter site
  }

  isEmptyExistUser(): boolean {
    if (
      this.email.localeCompare("") === 0 ||
      this.password.localeCompare("") === 0
    ) {
      // window.alert("One of the fields are empty.\nPlease fill them and try again.");
      this.messageService.add({severity:'info', summary: 'Empty Fields', detail: 'One of the fields are empty.\nPlease fill them and try again.', sticky: true});
      return false;
    }
    else {
      return true;
    }
  }

  isEmptyNewUser(): boolean {
    if (
      this.newName.localeCompare("") === 0 ||
      this.newEmail.localeCompare("") === 0 ||
      this.newPassword.localeCompare("") === 0 ||
      this.confirmPassword.localeCompare("") === 0
    ) {
      // window.alert("One of the fields are empty.\nPlease fill them and try again.");
      this.messageService.add({severity:'info', summary: 'Empty Fields', detail: 'One of the fields are empty.\nPlease fill them and try again.', sticky: true});
      return false;
    }
    else if(this.newPassword.localeCompare(this.confirmPassword) !== 0){
      this.messageService.add({severity:'info', summary: 'Passwords not the same', detail: 'Passwords not the same.\nPlease fix them and try again.', sticky: true});
      return false;
    }
    else if(this.newName.localeCompare("Guest") === 0){
      this.messageService.add({severity:'info', summary: 'Unavailable Name', detail: 'Cannot use name "Guest".\nPlease choose another name and try again.', sticky: true});
      return false;
    }
    else {
      return true;
    }
  }

}
