import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { DatabaseService } from '../../database.service';
import { RevenueItem, ExpenseItem } from '../../app-constants';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.css']
})
export class StatisticsPageComponent implements OnInit {

  constructor(
    private database: DatabaseService
  ) {

  }

  ngOnInit(): void {

    this.initAll();

  }

  userRevenue: RevenueItem[] = [];
  userExpense: ExpenseItem[] = [];

  totalMonthlyRevenue: number[];
  totalMonthlyExpense: number[];
  totalYearlyRevenue: number = 0;
  totalYearlyExpense: number = 0;

  overallNumbersTime: string; // toggle between Monthly / Yearly (Overall Numbers)
  overallNumbersRevenue: number;
  overallNumbersExpense: number;
  overallNumbersTotal: number;
  overallNumbersYearlyRevenue: number;
  overallNumbersYearlyExpense: number;
  overallNumbersMonthlyRevenue: number;
  overallNumbersMonthlyExpense: number;

  revenueCategories: RevenueCategory[] = [];
  selectedRevenueCategory: RevenueCategory;
  revenueCategory: number = 0;

  expenseCategories: ExpenseCategory[] = [];
  selectedExpenseCategory: ExpenseCategory;
  expenseCategory: number = 0;

  piePanelCategory: string; // toggele between Revenue / Expense (Pie)
  pieChartLabelRevenue: Label[] = [];
  pieChartLabelExpense: Label[] = [];

  pieChartOptions: ChartOptions = {};
  pieChartLabels: Label[] = [];
  pieChartData: number[] = [];
  pieChartDataRevenue: number[] = [];
  pieChartDataExpense: number[] = [];
  pieChartType: ChartType = 'pie';
  pieChartLegend: boolean = true;
  pieChartPlugins = [];
  pieChartColors = [];

  initAll(): void {
    this.overallNumbersTime = "Monthly";
    this.database.getTotalMonthlyRevenue().then(
      (result) => {
        this.totalMonthlyRevenue = result; // save for later use !
        const currentMonth = new Date().getMonth();
        this.overallNumbersMonthlyRevenue = result[currentMonth];
        this.overallNumbersRevenue = result[currentMonth];

        this.database.getTotalMonthlyExpense().then(
          (result) => {
            this.totalMonthlyExpense = result; // save for later use
            const currentMonth = new Date().getMonth();
            this.overallNumbersMonthlyExpense = result[currentMonth];

            // Reset Overall Numbers :
            this.overallNumbersExpense = result[currentMonth];
            this.overallNumbersTotal = this.overallNumbersMonthlyRevenue - this.overallNumbersMonthlyExpense;

            // Reset Numbers By Category :
            this.database.getUserRevenue().subscribe(
              (result) => {
                this.userRevenue = result; // save for later use
                // for(let revenue of result){ // save category names only
                //   this.revenueCategories.push({name: revenue["category"]});
                // }
                for (let i = 0; i < result.length; i++) {
                  if (i === 0) { // save first category name
                    this.revenueCategories.push({ name: result[i]["category"] });
                  }
                  for (let x = i - 1; x >= 0; x--) { // iterate on all category names
                    if (result[i]["category"].localeCompare(result[x]["category"]) === 0) { // check if we have double name  - if so - move on without saving it
                      // console.log("Found Double! >>> ", result[x]["category"]); // Testing !
                      break;
                    }
                    else if (x === 0) { // if this is the final check - then save category name
                      this.revenueCategories.push({ name: result[i]["category"] });
                    }
                  }
                }
              }
            );
            this.database.getUserExpense().subscribe(
              (result) => {
                this.userExpense = result; // save for later use
                // for(let expense of result){
                //   this.expenseCategories.push({name: expense["category"]});
                // }
                for (let i = 0; i < result.length; i++) {
                  if (i === 0) { // save first category name
                    this.expenseCategories.push({ name: result[i]["category"] });
                  }
                  for (let x = i - 1; x >= 0; x--) { // iterate on all category names
                    if (result[i]["category"].localeCompare(result[x]["category"]) === 0) { // check if we have double name  - if so - move on without saving it
                      // console.log("Found Double! >>> ", result[x]["category"]); // Testing !
                      break;
                    }
                    else if (x === 0) { // if this is the final check - then save category name
                      this.expenseCategories.push({ name: result[i]["category"] });
                    }
                  }
                }
              }
            );

            // Reset Pie :
            this.piePanelCategory = "Revenue";
            this.database.getUserRevenue().subscribe(
              (result) => {
                for (let i = 0; i < result.length; i++) {
                  if (i === 0) { // save first category name
                    this.pieChartLabelRevenue.push(result[i]["category"]);
                  }
                  for (let x = i - 1; x >= 0; x--) { // iterate on all category names
                    if (result[i]["category"].localeCompare(result[x]["category"]) === 0) { // check if we have double name  - if so - move on without saving it
                      break;
                    }
                    else if (x === 0) { // if this is the final check - then save category name
                      this.pieChartLabelRevenue.push(result[i]["category"]);
                    }
                  }
                }

                this.pieChartLabels = this.pieChartLabelRevenue; // reset pie categories as Revenue
                let randomColors: string[] = [];
                for (let i = 0; i < this.pieChartLabelRevenue.length; i++) { // reset pie colors as random
                  randomColors.push(
                    'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')'
                  );
                }
                this.pieChartColors = [{ backgroundColor: randomColors }];

                let listOfUserRevenue: RevenueItem[] = result;
                let count: number = 0; // count each category
                let countAll: number[] = []; // save all categories (after count)
                for (let i = 0; i < this.pieChartLabelRevenue.length; i++) { // iterate over all category names
                  for (let revenue of listOfUserRevenue) {
                    if (revenue["category"].localeCompare(String(this.pieChartLabelRevenue[i])) === 0) {
                      const monthNames = ["january", "february", "march", "april", "may", "june",
                        "july", "august", "september", "october", "november", "december"];
                      for (let i = 0; i < 12; i++) {
                        count = count + Number(revenue[monthNames[i]]);
                      }
                    }
                  }
                  countAll.push(count);
                  count = 0;
                }
                this.pieChartDataRevenue = countAll; // save revenue for later use
                this.pieChartData = countAll; // reset pie data as revenue


              }
            );
            this.database.getUserExpense().subscribe(
              (result) => {
                for (let i = 0; i < result.length; i++) {
                  if (i === 0) { // save first category name
                    this.pieChartLabelExpense.push(result[i]["category"]);
                  }
                  for (let x = i - 1; x >= 0; x--) { // iterate on all category names
                    if (result[i]["category"].localeCompare(result[x]["category"]) === 0) { // check if we have double name  - if so - move on without saving it
                      break;
                    }
                    else if (x === 0) { // if this is the final check - then save category name
                      this.pieChartLabelExpense.push(result[i]["category"]);
                    }
                  }
                }

                let listOfUserExpense: ExpenseItem[] = result;
                let count: number = 0; // count each category
                let countAll: number[] = []; // save all categories (after count)
                for (let i = 0; i < this.pieChartLabelExpense.length; i++) { // iterate over all category names
                  for (let expense of listOfUserExpense) {
                    if (expense["category"].localeCompare(String(this.pieChartLabelExpense[i])) === 0) {
                      const monthNames = ["january", "february", "march", "april", "may", "june",
                        "july", "august", "september", "october", "november", "december"];
                      for (let i = 0; i < 12; i++) {
                        count = count + Number(expense[monthNames[i]]);
                      }
                    }
                  }
                  countAll.push(count);
                  count = 0;
                }
                this.pieChartDataExpense = countAll; // save revenue for later use

              }
            );


            this.pieChartOptions = {
              responsive: true,
              legend: {
                position: 'top',
              },
              plugins: {
                datalabels: {
                  formatter: (value, ctx) => {
                    const label = ctx.chart.data.labels[ctx.dataIndex];
                    return label;
                  },
                },
              }
            };
            // this.pieChartLabels = ["Salary", "Parents", "Investment"];
            // this.pieChartData = [300, 500, 100];
            this.pieChartType = 'pie';
            this.pieChartLegend = true;
            this.pieChartPlugins = [];
            // this.pieChartColors = [
            //   {
            //     backgroundColor: ['green', 'red', 'rgb(172, 150, 193)'],
            //   },
            // ];

          }
        );

      }
    );
    this.database.getTotalYearlyRevenue().then(
      (result) => {
        this.totalYearlyRevenue = result;
        this.overallNumbersYearlyRevenue = result;

        this.database.getTotalYearlyExpense().then(
          (result) => {
            this.totalYearlyExpense = result;
            this.overallNumbersYearlyExpense = result;

          }
        );

      }
    );

    this.onChangeOverallNumbersTime();
  }

  onChangeOverallNumbersTime(): void {
    if (this.overallNumbersTime.localeCompare("Monthly") === 0) {
      this.overallNumbersRevenue = this.overallNumbersMonthlyRevenue;
      this.overallNumbersExpense = this.overallNumbersMonthlyExpense;
      this.overallNumbersTotal = this.overallNumbersMonthlyRevenue - this.overallNumbersMonthlyExpense;
    }
    else if ((this.overallNumbersTime.localeCompare("Yearly") === 0)) {
      this.overallNumbersRevenue = this.overallNumbersYearlyRevenue;
      this.overallNumbersExpense = this.overallNumbersYearlyExpense;
      this.overallNumbersTotal = this.overallNumbersYearlyRevenue - this.overallNumbersYearlyExpense;
    }
  }

  onChangeRevenueCategory(): void {
    if (this.selectedRevenueCategory !== null) {
      let count = 0;
      for (let revenue of this.userRevenue) {
        if (revenue["category"].localeCompare(this.selectedRevenueCategory.name) === 0) {
          const monthNames = ["january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"];
          for (let i = 0; i < 12; i++) {
            count = count + Number(revenue[monthNames[i]]);
          }
        }
      }
      this.revenueCategory = count;
    }
    else {
      this.revenueCategory = 0;
    }
  }

  onChangeExpenseCategory(): void {
    if (this.selectedExpenseCategory !== null) {
      let count = 0;
      for (let expense of this.userExpense) {
        if (expense["category"].localeCompare(this.selectedExpenseCategory.name) === 0) {
          const monthNames = ["january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"];
          for (let i = 0; i < 12; i++) {
            count = count + Number(expense[monthNames[i]]);
          }
        }
      }
      this.expenseCategory = count;
    }
    else {
      this.expenseCategory = 0;
    }
  }

  onChangePieTime(): void {
    if (this.piePanelCategory.localeCompare("Revenue") === 0) {
      let randomColors: string[] = [];
      for (let i = 0; i < this.pieChartLabelRevenue.length; i++) { // reset pie colors as random
        randomColors.push(
          'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')'
        );
      }
      this.pieChartColors = [{ backgroundColor: randomColors }];

      this.pieChartLabels = this.pieChartLabelRevenue; // reset pie categories as Revenue
      this.pieChartData = this.pieChartDataRevenue; // reset pie data as Revenue
    }
    else if (this.piePanelCategory.localeCompare("Expense") === 0) {
      let randomColors: string[] = [];
      for (let i = 0; i < this.pieChartLabelExpense.length; i++) { // reset pie colors as random
        randomColors.push(
          'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')'
        );
      }
      this.pieChartColors = [{ backgroundColor: randomColors }];

      this.pieChartLabels = this.pieChartLabelExpense; // reset pie categories as Expense
      this.pieChartData = this.pieChartDataExpense; // reset piw data as Expense
    }
  }



} // end of class

interface RevenueCategory {
  name: string;
}

interface ExpenseCategory {
  name: string;
}