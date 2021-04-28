import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../database.service';
import { APP_USER_ID, GUEST_USER_ID, UserDetails } from '../../app-constants';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { StoreService } from '../../store.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css'],
  providers: [MessageService]
})
export class SettingsPageComponent implements OnInit {

  constructor(
    private database: DatabaseService,
    private messageService: MessageService,
    public store: StoreService
  ) {

  }

  ngOnInit(): void {

    this.database.getUserDetails().subscribe(
      (result) => {
        let user = result as UserDetails;
        this.nameBeforeChange = user.name;
        this.name = user.name;
        this.jobDescription = user.occupation;
        // if(this.nameBeforeChange.localeCompare("Guest") === 0){ // if Guest then initiate Guest Picture
        //   // this.profilePicture = `uploads/Guest.jpg`; // use case for Local Environment
        //   this.profilePicture = `https://storage.googleapis.com/finance-overall-storage/Guest.jpg`; // use case for Internet Environment
        // }
        // else{
        //   // this.profilePicture = `uploads/${window.localStorage.getItem(APP_USER_ID)}.jpg`; // use case for Local Environment
        //   this.profilePicture = `https://storage.googleapis.com/finance-overall-storage/${window.localStorage.getItem(APP_USER_ID)}.jpg?t=${new Date().getTime()}`; // use case for Internet Environment
        // }
      },
      (error) => {
        // window.alert("Can't Get User Details.\nCheck Internet Connection and Try Again.");
        this.messageService.add({severity:'error', summary: 'User Details Uknown', detail: 'Can\'t Get User Details.\nCheck Internet Connection and Try Again.', sticky: true});
        throw error;
      }
    );

    // this.database.getProfilePicture().subscribe( // get profile picture from server
    //   (picture) => {
    //     console.log(picture);
    //     this.profilePicture = picture;
    //   }
    // );

  }

  nameBeforeChange: string = "";
  name: string = ""; // Name of the User
  jobDescription: string = ""; // Job Description
  oldPassword: string = ""; // Old Password
  newPassword: string = ""; // New Password
  confirmPassword: string = ""; // Confirm Password

  updateUserDetails(): void {
    if (this.nameBeforeChange.localeCompare("Guest") === 0) {
      // window.alert("Guests Can't Update Details.\n");
      this.messageService.add({severity:'warn', summary: 'Guest Restriction', detail: 'Guests Can\'t Update Details.', sticky: true});
    }
    else {
      let updatedDocument: object = {};

      if (
        this.oldPassword.localeCompare("") === 0 ||
        this.newPassword.localeCompare("") === 0 ||
        this.confirmPassword.localeCompare("") === 0
      ) {
        updatedDocument = {
          name: this.name,
          occupation: this.jobDescription,
        }
        this.database.updateUserDetails(updatedDocument).subscribe(
          (result) => {
            if (result) {
              // window.alert("Update Succeful !");
              this.messageService.add({severity:'success', summary: `Update successfully`, detail: 'User Details has been Updated.'});
            }
            else {
              // window.alert("Failed to Save New Details.\nPlease try again later.");
              this.messageService.add({severity:'error', summary: 'Update Failed', detail: 'Failed to Save New Details.\nPlease try again later.', sticky: true});
            }
          }
        );
      }
      else {
        this.database.validPassword(this.oldPassword).subscribe(
          (result) => {
            if (result) { // if old password the same as in database - then we can update to New Password !
              if(this.newPassword.localeCompare(this.confirmPassword) === 0){ // if new password and confirm is the same then we can continue
                updatedDocument = {
                  name: this.name,
                  occupation: this.jobDescription,
                  password: this.newPassword
                }
                this.database.updateUserDetails(updatedDocument).subscribe(
                  (result) => {
                    if (result) {
                      // window.alert("Update Succeful !");
                      this.messageService.add({severity:'success', summary: `Update successfully`, detail: 'User Details has been Updated.'});
                    }
                    else {
                      // window.alert("Failed to Save New Details.\nPlease try again later.");
                      this.messageService.add({severity:'error', summary: 'Update Failed', detail: 'Failed to Save New Details.\nPlease try again later.', sticky: true});
                    }
                  }
                );
              }
              else{
                // window.alert("New Password and Confirm Password is NOT the same.\nPlease fix it and try again.");
                this.messageService.add({severity:'warn', summary: 'Passwords not the same', detail: 'New Password and Confirm Password is NOT the same.\nPlease fix it and try again.', sticky: true});
              }
            }
            else {
              // window.alert("Old Password is wrong.\nPlease fix it and try again.");
              this.messageService.add({severity:'warn', summary: 'Old Password', detail: 'Old Password is wrong.\nPlease fix it and try again.', sticky: true});
            }
          }
        );

      }

    }
  }

  userID = window.localStorage.getItem(APP_USER_ID);
  uploadURL: string = `api/profile/set/${this.userID}`;
  // profilePicture: any;

  onUploadFinish(event: any): void {
    // console.log(event.originalEvent);
    // console.log(event.files);
    // window.location.reload(); // refresh page to update profile picture

    // this.profilePicture = `https://storage.googleapis.com/finance-overall-storage/${window.localStorage.getItem(APP_USER_ID)}.jpg?t=${new Date().getTime()}`; // refresh profile picture
    this.store.setProfilePicture(`https://storage.googleapis.com/finance-overall-storage/${window.localStorage.getItem(APP_USER_ID)}.jpg?t=${new Date().getTime()}`);
  }
  
  onSelect(event: any, element: any): void {
    // console.log(formData);
    // event["currentFiles"][0] = null;
    if(this.name.localeCompare("Guest") === 0){
      element.clear();
      // window.alert("Guest can't change profile picture.");
      this.messageService.add({severity:'warn', summary: 'Guest Restriction', detail: 'Guest can\'t change profile picture.', sticky: true});
    }
  }



}
