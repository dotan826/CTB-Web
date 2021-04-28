import { Injectable } from '@angular/core';
import { APP_USER_ID } from './app-constants';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(

  ) {

  }

  private userName: string = "";

  setUserName(name: string): void {
    this.userName = name;
  }
  
  getUserName(): string {
    return this.userName;
  }

  public profilePicture: any = `https://storage.googleapis.com/finance-overall-storage/Guest.jpg`;

  setProfilePicture(picture: any): void {
    this.profilePicture = picture;
  }

  getProfilePicture(): any {
    return this.profilePicture;
  }

}
