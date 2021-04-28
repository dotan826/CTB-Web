import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_USER_ID, GUEST_USER_ID, UserDetails } from '../../app-constants';
import { StoreService } from '../../store.service';
import { DatabaseService } from '../../database.service';

@Component({
  selector: 'app-website-page',
  templateUrl: './website-page.component.html',
  styleUrls: ['./website-page.component.css']
})
export class WebsitePageComponent implements OnInit {

  constructor(
    private router: Router,
    public store: StoreService,
    private database: DatabaseService
  ) {

  }

  ngOnInit(): void {
    
    this.database.getUserDetails().subscribe(
      (result) => {
        let user = result as UserDetails;
        if(user.name.localeCompare("Guest") === 0){ // if Guest then initiate Guest Picture
          // this.profilePicture = `uploads/Guest.jpg`; // use case for Local Environment
          // this.profilePicture = `https://storage.googleapis.com/finance-overall-storage/Guest.jpg`; // use case for Internet Environment
          this.store.setProfilePicture(`https://storage.googleapis.com/finance-overall-storage/Guest.jpg`); // use case for Internet Environment
        }
        else{
          // this.profilePicture = `uploads/${window.localStorage.getItem(APP_USER_ID)}.jpg`; // use case for Local Environment
          // this.profilePicture = `https://storage.googleapis.com/finance-overall-storage/${window.localStorage.getItem(APP_USER_ID)}.jpg?t=${new Date().getTime()}`; // use case for Internet Environment
          this.store.setProfilePicture(`https://storage.googleapis.com/finance-overall-storage/${window.localStorage.getItem(APP_USER_ID)}.jpg?t=${new Date().getTime()}`); // use case for Internet Environment
        }
      }
    );

  }

  logOutUser(): void {
    window.localStorage.removeItem(APP_USER_ID); // remove saved User Name (in Browser)
    this.router.navigate(['login']); // navigate back to Login Page
  }

  // profilePicture: any;



}
