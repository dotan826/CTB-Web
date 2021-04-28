import { Component, OnInit } from '@angular/core';
import { RevenueItem, APP_USER_ID } from '../../app-constants';
import { DatabaseService } from '../../database.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-revenue-page',
  templateUrl: './revenue-page.component.html',
  styleUrls: ['./revenue-page.component.css'],
  providers: [MessageService]
})
export class RevenuePageComponent implements OnInit {

  constructor(
    private database: DatabaseService,
    private messageService: MessageService
  ) {

  }

  ngOnInit(): void {

    this.initTableData();

    this.database.getTotalMonthlyRevenue().then(
      (result) => {
        this.monthlyRevenue = result;
      }
    );
    

  }

  initTableData(): void {
    this.database.getUserRevenue().subscribe(
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
        this.revenue = result;
      }
    );
  }

  revenue: RevenueItem[] = [];
  modalDisplay: boolean = false;
  displayedNote: string = "";
  selectedRowNotes: RevenueItem;
  monthlyRevenue: number[] = [];

  showRowNotes(row: RevenueItem): void {
    this.selectedRowNotes = row;
    this.displayedNote = row.notes;
    this.modalDisplay = !this.modalDisplay;
  }

  closeRowNotes(): void {
    this.modalDisplay = !this.modalDisplay;
  }

  saveRowNotes(): void {
    let updatedRow: RevenueItem = {
      _id: this.selectedRowNotes._id,
      _uid: this.selectedRowNotes._uid,
      category: this.selectedRowNotes.category,
      name: this.selectedRowNotes.name,
      notes: this.displayedNote
    }
    this.database.updateRowRevenueNotes(updatedRow).subscribe(
      (result) => {
        if(result){
          for(let i=0; i<this.revenue.length; i++){
            if(this.revenue[i]._id.localeCompare(this.selectedRowNotes._id) === 0){
              this.revenue[i].notes = this.displayedNote;
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

  saveRowChanges(row: RevenueItem): void {
    this.database.updateRowRevenue(row).subscribe(
      (result) => {
        if(result){
          this.database.getTotalMonthlyRevenue().then(
            (result) => {
              this.monthlyRevenue = result;
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

  deleteRow(row: RevenueItem): void {
    this.database.deleteRowRevenue(row).subscribe(
      (result) => {
        if(result){
          this.initTableData();
          this.database.getTotalMonthlyRevenue().then(
            (result) => {
              this.monthlyRevenue = result;
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
    let newDocument: RevenueItem = {
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
    this.database.addRowRevenue(newDocument).subscribe(
      (result) => {
        if(result){
          newDocument["_id"] = result.ops[0]["_id"];
          this.revenue.push(newDocument);
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

