import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DBService } from '../app.dbservice';

export class PurchaseModel{
  PurchaseId: number = 0;
  ItemId: number = 0;
  ItemName: string = "";
  Batch: string = "";
  EffectiveDate: Date = new Date();
  Terms: number = 0;
  VenderId: number = 0;
  Series: number = 0;
  Balance: string = "";
  BillNo: string = "";
  DueDate: Date = new Date();
  MainQty: number = 0;
  AltQty: number = 0;
  Price: number = 0;
  Per: string = "";
  BasicAmt: number = 0;
  Discount: string = "";
  DiscountAmt: number = 0;
  TaxAmt: number = 0;
  NetValue: number = 0;
}

export class DropDownProp{
  Id: number = 0;
  Name: string = "";
}

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [MatTableModule, CommonModule, FormsModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent implements OnInit{
  Qry: string = "";
  parameters: any;
  VendorList: DropDownProp[] = [];
  ItemList: DropDownProp[] = [];
  PurchaseModelData: PurchaseModel = new PurchaseModel();
  ItemDataSource: PurchaseModel[] = [];
  displayedColumns = ["ItemName", "Batch", "MainQty", "AltQty", "Free", "Price", "Per", "BasicAmt", "Discount", "DiscountAmt", "Tax", "TaxAmt", "NetValue"];

  constructor(private DBService: DBService){}

  ngOnInit(){
    this.FillVendorList();
    this.FillItemList();
  }

  OnAddBtnClick(){
    let ItemName: any = this.ItemList.find(x => x["Id"] == this.PurchaseModelData.ItemId)?.Name.toString();
    this.PurchaseModelData.ItemName = ItemName;
    this.ItemDataSource.push(JSON.parse(JSON.stringify(this.PurchaseModelData)));
    console.log(this.ItemDataSource);
  }

  FillVendorList(){
    this.VendorList = [];
    this.Qry = "SELECT VendorId As Id, VendorName As Name FROM vendorMaster;";
    let data = this.DBService.query(this.Qry);
    setTimeout(() => {
      if(data.IsErrorExists){
        alert(data.ErrorMessgae);
      }
      else{
        if(data.QueryResultData && data.QueryResultData.length > 0){
          this.VendorList = JSON.parse(JSON.stringify(data.QueryResultData));
        }
      }
      console.log(this.VendorList);
    }, 500);
  }

  OnItemChange(){
    if(this.PurchaseModelData.ItemId > 0){
      this.Qry = "SELECT * FROM itemmaster WHERE ItemId = " + this.PurchaseModelData.ItemId;
      let data = this.DBService.query(this.Qry);
      setTimeout(() => {
        if(data.IsErrorExists){
          alert(data.ErrorMessgae);
        }
        else{
          if(data.QueryResultData && data.QueryResultData.length > 0){
            let newData = JSON.parse(JSON.stringify(data.QueryResultData))
            this.PurchaseModelData.MainQty = newData[0].stockqty;
            //this.PurchaseModelData.AltQty
            this.PurchaseModelData.Price = newData[0].purchaseprice;
            this.PurchaseModelData.BasicAmt = newData[0].baseprice;
            this.PurchaseModelData.Discount = newData[0].discount;
          }
        }
      }, 500);
    }
  }

  FillItemList(){
    this.VendorList = [];
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
      console.log(this.VendorList);
    }, 500);
  }

  AddNewRecord(){
    let Qry = "", parameters: any, data, data2;

    Qry = `SELECT * FROM purchasesummary WHERE VenderId = `+ this.PurchaseModelData.VenderId;
    let CheckRecord = this.DBService.query(Qry);
    if(CheckRecord.QueryResultData && CheckRecord.QueryResultData.length > 0){
      Qry = `INSERT INTO PurchaseDetail VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        parameters = [this.PurchaseModelData.PurchaseId, this.PurchaseModelData.ItemId, this.PurchaseModelData.Batch
          , this.PurchaseModelData.MainQty, this.PurchaseModelData.AltQty,this.PurchaseModelData.Price
          , this.PurchaseModelData.Per, this.PurchaseModelData.BasicAmt, this.PurchaseModelData.Discount
          , this.PurchaseModelData.DiscountAmt, this.PurchaseModelData.TaxAmt, this.PurchaseModelData.NetValue
        ];
  
        data2 = this.DBService.InsertIntoTables(Qry, parameters);
  
        if(!data2.ErrorMessgae && data2.IsQueryExecuted){
          alert("Record Added!!!");
        }
    }
    else{
      Qry = `Insert Into purchasesummary Values(?, ?, ?, ?, ?); SELECT SCOPE_IDENTITY();`;
      parameters = [this.PurchaseModelData.EffectiveDate, this.PurchaseModelData.Terms, this.PurchaseModelData.VenderId
        ,this.PurchaseModelData.Series, this.PurchaseModelData.Balance
      ];
  
      data = this.DBService.InsertIntoTables(Qry, parameters);

      if(!data.ErrorMessgae && data.IsQueryExecuted){
        Qry = `INSERT INTO PurchaseDetail VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        parameters = [this.PurchaseModelData.PurchaseId, this.PurchaseModelData.ItemId, this.PurchaseModelData.Batch
          , this.PurchaseModelData.MainQty, this.PurchaseModelData.AltQty,this.PurchaseModelData.Price
          , this.PurchaseModelData.Per, this.PurchaseModelData.BasicAmt, this.PurchaseModelData.Discount
          , this.PurchaseModelData.DiscountAmt, this.PurchaseModelData.TaxAmt, this.PurchaseModelData.NetValue
        ];
  
        data2 = this.DBService.InsertIntoTables(Qry, parameters);
  
        if(!data2.ErrorMessgae && data2.IsQueryExecuted){
          alert("Record Added!!!");
        }
      }
    }
  }
}
