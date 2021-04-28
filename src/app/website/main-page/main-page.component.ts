import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { StoreService } from '../../store.service';
import { APP_USER_ID, GUEST_USER_ID, BACK_END_URL, UserDetails } from '../../app-constants';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from '../../database.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(
    public store: StoreService,
    private http: HttpClient,
    private database: DatabaseService
  ) {

  }

  ngOnInit(): void {

    // Get User Details before showing component view !
    this.database.getUserDetails().subscribe(
      (result) => {
        let user = result as UserDetails;
        this.name = user.name;
        this.jobDescription = user.occupation;
        // if(user.name.localeCompare("Guest") === 0){ // if Guest then initiate Guest Picture
        //   // this.profilePicture = `uploads/Guest.jpg`; // use case for Local Environment
        //   this.profilePicture = `https://storage.googleapis.com/finance-overall-storage/Guest.jpg`; // use case for Internet Environment
        // }
        // else{
        //   // this.profilePicture = `uploads/${window.localStorage.getItem(APP_USER_ID)}.jpg`; // use case for Local Environment
        //   this.profilePicture = `https://storage.googleapis.com/finance-overall-storage/${window.localStorage.getItem(APP_USER_ID)}.jpg?t=${new Date().getTime()}`; // use case for Internet Environment
        // }
      },
      (error) => {
        window.alert("Can't Get User Details.\nCheck Internet Connection and Try Again.");
        throw error;
      }
    );
    
    this.getMonthly().then(
      (result) => {
        this.lineChartData = result;
      }
    );

    this.database.getTotalYearlyRevenue().then(
      (result) => {
        this.revenue = result;
      }
    );

    this.database.getTotalYearlyExpense().then(
      (result) => {
        this.expense = result;
      }
    );




    // const month = (new Date()).toLocaleString('default', { month: 'long' });
    // console.log("month : ", new Date().getMonth()); // get current month (january=0, ... , december=11)

    this.lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.lineChartOptions = {
      responsive: true
    }
    this.lineChartColors = [
      {
        borderColor: 'green',
        backgroundColor: 'rgba(55, 216, 51, 0.5)',
      },
      {
        borderColor: 'rgba(255, 0, 0, 0.5)',
        backgroundColor: 'rgba(255, 0, 0, 0.5)'
      }
    ];
    this.lineChartLegend = true;
    this.lineChartPlugins = [];
    this.lineChartType = "line";



  }

  async getMonthly(): Promise<ChartDataSets[]> {
    let temp: ChartDataSets[] = [];
    await this.database.getTotalMonthlyRevenue().then(
      (result) => {
        temp.push(
          { data: result, label: 'Revenue' }
        );
      }
    );
    await this.database.getTotalMonthlyExpense().then(
      (result) => {
        temp.push(
          { data: result, label: 'Expense' }
        );
      }
    );
    return temp;
  }

  name: string = ""; // Name of the User
  jobDescription: string = ""; // Job Description
  revenue: number = 0; // Revenue (Monthly/Yearly)
  expense: number = 0; // Expense (Monthly/Yearly)

  // Chart Variables
  lineChartData: ChartDataSets[] = [];
  lineChartLabels: Label[];
  lineChartOptions: any;
  lineChartColors: Color[];
  lineChartLegend: boolean;
  lineChartPlugins: any;
  lineChartType: string;

  // profilePicture: any;
  



}
