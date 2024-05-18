import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { DBService, DBServiceModel } from '../app.dbservice';

export class DropDownProp {
  Id: number = 0;
  Name: string = '';
}

@Component({
  selector: 'app-bill',
  standalone: true,
  imports: [MatTableModule, CommonModule,FormsModule,MatSlideToggleModule],
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent implements OnInit{
  DataSource: [] = [];
  WithRateDataSource: [] = [];
  SummaryDataSource: [] = [];
  CustomerList:DropDownProp[] = [];
  CustomerId:number = 0;
  CustomerName:any = "";
  currentDate:any = "";
  IsKhacha:boolean = false;
  Qry: string = '';
  data: any;
  SplitAfter:number=15;
  MatProductDataSource:any[] = [];
  WithRatecolumns = ["WithRate"];
  columns = ["WithOutRate"];
  Summarycolumns = ["Thick","ShortName","Qty"];
  ProductDataSource = [{
    ProductName: ""
  }];

  constructor(private DBService: DBService) {}
  ngOnInit(): void {
    this.FillCustomerList();
  }

  FillCustomerList() {
    this.CustomerList = [];
    this.Qry = 'SELECT CustomerId AS Id,CustomerName AS Name FROM CustomerMaster;';
    let data = this.DBService.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        alert(data.ErrorMessgae);
      } else {
        if (data.QueryResultData && data.QueryResultData.length > 0) {
          this.CustomerList = JSON.parse(JSON.stringify(data.QueryResultData));
        }
      }
    }, 500);
  }
  
  OnCustomerChange(){
    if (!!this.CustomerId && this.CustomerId > 0 && this.currentDate != ""){
      this.CustomerName = (this.CustomerList.find((i) => i['Id'] == this.CustomerId)?.Name);
      this.Qry = `Select concat(IM.Designno,':',SD.SalesQty) AS WithOutRate,concat(IM.Designno,':',SD.SalesQty,':',SD.Price) AS WithRate
                  FROM SalesSummary SS
                  INNER JOIN CustomerMaster CM ON CM.CustomerId = SS.CustomerId
                  INNER JOIN SalesDetail SD ON SD.SalesId = SS.SalesId
                  INNER JOIN ItemMaster IM ON IM.ItemId = SD.ItemId
                  WHERE CM.CustomerId = `+this.CustomerId+` AND SS.SalesDate = '`+ this.currentDate +`+'
                  ORDER BY IM.Thickness,IM.Designno;`;
                  let data = this.DBService.query(this.Qry);
                  setTimeout(() => {
                    if (data.IsErrorExists) {
                      alert(data.ErrorMessgae);
                    } else {
                      if (data.QueryResultData && data.QueryResultData.length > 0) {
                        this.DataSource = JSON.parse(JSON.stringify(data.QueryResultData));
                      }
                    }
                  }, 500);

        this.funGetSummary();            
    }
    else{
      alert("Please Select Date");
    }
  }
  
  funGetSummary(){
    this.Qry = `Select IM.Thickness AS Thick,IM.ShortName,SUM(SD.SalesQty) AS Qty
    FROM SalesSummary SS
    INNER JOIN CustomerMaster CM ON CM.CustomerId = SS.CustomerId
    INNER JOIN SalesDetail SD ON SD.SalesId = SS.SalesId
    INNER JOIN ItemMaster IM ON IM.ItemId = SD.ItemId
    WHERE CM.CustomerId = `+this.CustomerId+` AND SS.SalesDate = '`+ this.currentDate +`+'
    Group BY IM.Thickness,IM.ShortName,SD.SalesQty;`;
    let data = this.DBService.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        alert(data.ErrorMessgae);
      } else {
        if (data.QueryResultData && data.QueryResultData.length > 0) {
          this.SummaryDataSource = JSON.parse(JSON.stringify(data.QueryResultData));
        }
      }
    }, 500);
  }

  splitCols(DS:any[]){
    let mainArr:any[] = [];
    let colArr:string[] = [];

   let parts = Math.ceil(DS.length/this.SplitAfter);

    for(let i=0;i<this.SplitAfter;i++){
      let positions = this.getPositions(i,parts);
      let obj:any={};
      for(let j=0;j<positions.length;j++){
        let ele = DS[positions[j]];
        obj['ProductName'+(j+1)]= ele ? ele['ProductName'] : null;
      } 

      mainArr.push(obj);  
    }

    for(let i=0;i<parts;i++){
      colArr.push('ProductName'+(i+1));
    }

    this.MatProductDataSource = mainArr;
    this.columns = colArr;

  }  

  getPositions(num:number,parts:number) {
    let positions = [];
    for (let i = 0; i < parts; i++) {
      let index = num + i * 10;
      positions.push(index);
    }
    return positions;
  }

  

  PrintData(){
    let printsection = document.getElementById("printsection")?.innerHTML;
    let popwindow = window.open("", "", "top = 0, left = 0, height = 100%, width = auto");
    popwindow?.document.open();
    popwindow?.document.write(`
    <html>
    <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    </head>
    <body onload="window.print(); window.close()">
    ${printsection}
    </body>
    </html>
    `);
    popwindow?.document.close();
  }
}

