import { Injectable } from '@angular/core';
import { SignInExistUser, SignInNewUser, APP_USER_ID, RevenueItem, ExpenseItem, UserDetails } from './app-constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private http: HttpClient
  ) {

  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<>>> Sign (In/Out)
  signInExistUser(user: SignInExistUser): Observable<any> {
    return this.http.post("api/login/exist", user);
  }

  singInNewUser(newUser: SignInNewUser): Observable<any> {
    return this.http.post("api/login/new", newUser);
  }





  // >>>>>>>>>>>>><<<<<<<<<<<<<<<>>>>>>>> User Details
  getUserDetails(): Observable<any> {
    let userID = window.localStorage.getItem(APP_USER_ID);
    return this.http.post("api/users/get", { "_id": userID });
  }

  updateUserDetails(updatedDocument: object): Observable<any> {
    let userID = window.localStorage.getItem(APP_USER_ID);
    return this.http.post("api/users/update", [userID, updatedDocument]);
  }

  validPassword(pass: string): Observable<any> {
    let userID = window.localStorage.getItem(APP_USER_ID);
    return this.http.post("api/users/pass", [userID, pass]);
  }

  // getProfilePicture(): Observable<any> {
  //   let userID = window.localStorage.getItem(APP_USER_ID);
  //   return this.http.post("api/profile/get", { "_id": userID });
  // }


  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> User Revenues
  getUserRevenue(): Observable<any> {
    let userID = window.localStorage.getItem(APP_USER_ID);
    return this.http.post("api/revenue/get", { "_id": userID });
  }

  addRowRevenue(document: RevenueItem): Observable<any> {
    return this.http.post("api/revenue/add", document);
  }

  deleteRowRevenue(document: RevenueItem): Observable<any> {
    return this.http.post("api/revenue/delete", document);
  }

  updateRowRevenue(updatedDocument: RevenueItem): Observable<any> {
    return this.http.post("api/revenue/update", updatedDocument);
  }

  updateRowRevenueNotes(updatedDocument: object): Observable<any> {
    return this.http.post("api/revenue/updateNotes", updatedDocument);
  }

  async getTotalMonthlyRevenue(): Promise<number[]> {
    // const month = (new Date()).toLocaleString('default', { month: 'long' });
    let res = this.getUserRevenue().toPromise().then(
      (result) => {
        const monthNames = ["january", "february", "march", "april", "may", "june",
          "july", "august", "september", "october", "november", "december"];
        let revenueItems: RevenueItem[] = result;
        let monthlyRevenue: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < revenueItems.length; i++) {
          for (let x = 0; x < monthNames.length; x++) {
            monthlyRevenue[x] = monthlyRevenue[x] + Number(revenueItems[i][monthNames[x]]);
          }
        }
        return monthlyRevenue;
      }
    );
    return await res;
  }

  async getTotalYearlyRevenue(): Promise<number> {
    let res = this.getUserRevenue().toPromise().then(
      (result) => {
        const monthNames = ["january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"];
        let revenueItems: RevenueItem[] = result;
        let yearlyRevenue: number = 0;
        for (let i = 0; i < revenueItems.length; i++) {
          for (let x = 0; x < monthNames.length; x++) {
            yearlyRevenue = yearlyRevenue + Number(revenueItems[i][monthNames[x]]);
          }
        }
        return yearlyRevenue;
      }
    );
    return await res;
  }



  // >>>>>>>>>>>>>>>>>>>>> User Expenses
  getUserExpense(): Observable<any> {
    let userID = window.localStorage.getItem(APP_USER_ID);
    return this.http.post("api/expense/get", { "_id": userID });
  }

  addRowExpense(document: ExpenseItem): Observable<any> {
    return this.http.post("api/expense/add", document);
  }

  deleteRowExpense(document: ExpenseItem): Observable<any> {
    return this.http.post("api/expense/delete", document);
  }

  updateRowExpense(updatedDocument: ExpenseItem): Observable<any> {
    return this.http.post("api/expense/update", updatedDocument);
  }

  updateRowExpenseNotes(updatedDocument: object): Observable<any> {
    return this.http.post("api/expense/updateNotes", updatedDocument);
  }

  async getTotalMonthlyExpense(): Promise<number[]> {
    // const month = (new Date()).toLocaleString('default', { month: 'long' });
    let res = this.getUserExpense().toPromise().then(
      (result) => {
        const monthNames = ["january", "february", "march", "april", "may", "june",
          "july", "august", "september", "october", "november", "december"];
        let expenseItems: ExpenseItem[] = result;
        let monthlyExpense: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < expenseItems.length; i++) {
          for (let x = 0; x < monthNames.length; x++) {
            monthlyExpense[x] = monthlyExpense[x] + Number(expenseItems[i][monthNames[x]]);
          }
        }
        return monthlyExpense;
      }
    );
    return await res;
  }

  async getTotalYearlyExpense(): Promise<number> {
    let res = this.getUserExpense().toPromise().then(
      (result) => {
        const monthNames = ["january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"];
        let expenseItems: ExpenseItem[] = result;
        let yearlyExpense: number = 0;
        for (let i = 0; i < expenseItems.length; i++) {
          for (let x = 0; x < monthNames.length; x++) {
            yearlyExpense = yearlyExpense + Number(expenseItems[i][monthNames[x]]);
          }
        }
        return yearlyExpense;
      }
    );
    return await res;
  }








}







