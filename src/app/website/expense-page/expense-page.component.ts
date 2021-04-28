import { Component, OnInit } from '@angular/core';
import { ExpenseItem, APP_USER_ID } from '../../app-constants';
import { DatabaseService } from '../../database.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-expense-page',
  templateUrl: './expense-page.component.html',
  styleUrls: ['./expense-page.component.css'],
  providers: [MessageService]
})
export class ExpensePageComponent implements OnInit {

  constructor(
    private database: DatabaseService,
    private messageService: MessageService
  ) {

  }

  ngOnInit(): void {

    this.initTableData();

    this.database.getTotalMonthlyExpense().then(
      (result) => {
        this.monthlyExpense = result;
      }
    );

  }

  initTableData(): void {
    this.database.getUserExpense().subscribe(
      (result) => {
        const monthNames = ["january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"];
        let temp: number = 0;
        for(let i=0; i<result.length; i++){
          for(let x=0; x<monthNames.length; x++){
            temp = temp + Number(result[i][monthNames[x]]);
          }
          result[i].total = temp;
          temp = 0;
        }
        this.expense = result;
      }
    );
  }

  expense: ExpenseItem[] = [];
  modalDisplay: boolean = false;
  displayedNote: string = "";
  selectedRowNotes: ExpenseItem;
  monthlyExpense: number[] = [];

  showRowNotes(row: ExpenseItem): void {
    this.selectedRowNotes = row;
    this.displayedNote = row.notes;
    this.modalDisplay = !this.modalDisplay;
  }

  closeRowNotes(): void {
    this.modalDisplay = !this.modalDisplay;
  }

  saveRowNotes(): void {
    let updatedRow: ExpenseItem = {
      _id: this.selectedRowNotes._id,
      _uid: this.selectedRowNotes._uid,
      category: this.selectedRowNotes.category,
      name: this.selectedRowNotes.name,
      notes: this.displayedNote
    }
    this.database.updateRowExpenseNotes(updatedRow).subscribe(
      (result) => {
        if(result){
          for(let i=0; i<this.expense.length; i++){
            if(this.expense[i]._id.localeCompare(this.selectedRowNotes._id) === 0){
              this.expense[i].notes = this.displayedNote;
            }
          }
          // console.log("Notes has been Updated.");
          this.messageService.add({severity:'success', summary: `Row ${this.selectedRowNotes.category}_${this.selectedRowNotes.name}`, detail: 'Notes has been Updated.'});
          this.closeRowNotes();
        }
        else{
          // console.log("Can't Update Notes.");
          this.messageService.add({severity:'error', summary: 'Update Failed', detail: 'Can\'t Update Notes. Please try again.', sticky: true});
        }
      }
    );
  }

  saveRowChanges(row: ExpenseItem): void {
    this.database.updateRowExpense(row).subscribe(
      (result) => {
        if(result){
          this.database.getTotalMonthlyExpense().then(
            (result) => {
              this.monthlyExpense = result;
            }
          );
          this.initTableData();
          // console.log("Row has been Updated.");
          this.messageService.add({severity:'success', summary: `Row ${row.category}_${row.name}`, detail: 'Row has been Updated.'});
        }
        else{
          // console.log("Can't Update Row.");
          this.messageService.add({severity:'error', summary: 'Update Failed', detail: 'Can\'t Update Row. Please try again.', sticky: true});
        }
      }
    );
  }

  deleteRow(row: ExpenseItem): void {
    this.database.deleteRowExpense(row).subscribe(
      (result) => {
        if(result){
          this.initTableData();
          this.database.getTotalMonthlyExpense().then(
            (result) => {
              this.monthlyExpense = result;
            }
          );
          // console.log("Row has been Deleted.");
          this.messageService.add({severity:'success', summary: `Row ${row.category}_${row.name}`, detail: 'Row has been Deleted.'});
        }
        else{
          // console.log("Can't Delete Row.");
          this.messageService.add({severity:'error', summary: 'Delete Failed', detail: 'Can\'t Delete Row. Please try again.', sticky: true});
        }
      }
    );
  }

  addRow(): void {
    // let id = new ObjectId();
    let userID = window.localStorage.getItem(APP_USER_ID);
    let newDocument: ExpenseItem = {
      // _id: id.toHexString(),
      _id: null,
      _uid: userID,
      category: "New-Category",
      name: "New-Name",
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
      notes: ""
    }
    this.database.addRowExpense(newDocument).subscribe(
      (result) => {
        if(result){
          newDocument["_id"] = result.ops[0]["_id"];
          this.expense.push(newDocument);
          this.initTableData();
          // console.log("Row has been Created.");
          this.messageService.add({severity:'success', summary: `Row Creation successfully`, detail: 'Row has been Created.'});
        }
        else{
          // console.log("Can't Add new Row.");
          this.messageService.add({severity:'error', summary: 'Row Creation Failed', detail: 'Can\'t Create Row. Please try again.', sticky: true});
        }
      }
    );
  }





}
