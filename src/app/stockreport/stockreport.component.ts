import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DBService } from '../app.dbservice';

export class DropDownProp{
  Id: number = 0;
  Name: string = "";
}

@Component({
  selector: 'app-stockreport',
  standalone: true,
  imports: [MatTableModule, CommonModule, FormsModule],
  templateUrl: './stockreport.component.html',
  styleUrl: './stockreport.component.css'
})
export class StockreportComponent implements OnInit {
  Qry: string = "";
  ItemList: DropDownProp[] = [];

  constructor(private DBService: DBService){}

  ngOnInit(){
  this.FillItemList();
  }

  FillItemList(){
    this.Qry = "SELECT ItemId As Id, ItemName As Name FROM itemmaster;";
    let data = this.DBService.query(this.Qry);
    setTimeout(() => {
      if(data.IsErrorExists){
        alert(data.ErrorMessgae);
      }
      else{
        if(data.QueryResultData && data.QueryResultData.length > 0){
          this.ItemList = JSON.parse(JSON.stringify(data.QueryResultData));
        }
      }
    }, 500);
  }
}
