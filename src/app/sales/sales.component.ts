import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { DBService, DBServiceModel } from '../app.dbservice';

export class SalesModel {
  SalesId: number = 0;
  CustomerId: number = 0;
  ItemId: number = 0;
  ItemName: string = '';
  SalesDate: Date = new Date();
  Terms: number = 0;
  DesignNo: number = 0;
  Series: number = 0;
  Balance: string = '';
  BillNo: string = '';
  DueDate: Date = new Date();
  StockQty: number = 0;
  SaleQty: number = 0;
  AltQty: number = 0;
  Price: number = 0;
  Per: string = '';
  BasicAmt: number = 0;
  Discount: number = 0;
  DiscountAmt: number = 0;
  TaxSlab: number = 0;
  TaxAmt: number = 0;
  NetValue: number = 0;
  TotalAmt: number = 0;
  IsKhacha:boolean = false;
}

export class DropDownProp {
  Id: number = 0;
  Name: string = '';
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule,MatTableModule,MatSlideToggleModule,FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {
  currentDateTime:any = new Date();
  Qry: string = '';
  CustomerData:any = '';
  ItemData:any = '';
  parameters: any;
  CustomerList = [];
  ItemList = [];
  SalesModelData: SalesModel = new SalesModel();
  SalesArrModel: SalesModel[] = [];
  ItemDataSource: SalesModel[] = [];
  SalesDataSource: [] = [];
  IsAddSection: boolean = false;
  displayedColumns = [
    'DesignNo',
    'StockQty',
    'SaleQty',
    'AltQty',
    'Price',
    'Per',
    'BasicAmt',
    'Discount',
    'DiscountAmt',
    'TaxSlab',
    'TaxAmt',
    'NetValue',
  ];

  colums = [
    'CustomerName',
    'ItemName',
    'SalesDate',
    'Terms',
    'TotalAmt'
  ];

  constructor(private DBService: DBService) {}

  ngOnInit() {
    this.GetPurchasedData();
    this.FillCustomerList();
    this.FillItemList();
  }

  AddBtnClick() {
    this.IsAddSection = !this.IsAddSection;
    if (this.IsAddSection) {
      this.ClearData();
    }
  }

  GetPurchasedData() {
    this.Qry = `SELECT SS.SalesId,CM.CustomerId,CM.CustomerName,IM.ItemId,IM.ItemName,SS.SalesDate,SS.Terms,SS.TotalAmt  
    FROM SalesSummary SS
    INNER JOIN CustomerMaster CM ON CM.CustomerId = SS.CustomerId
    INNER JOIN SalesDetail SD ON SD.SalesId = SS.SalesId
    INNER JOIN ItemMaster IM ON IM.ItemId = SD.ItemId;`;
    let data = this.DBService.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        alert(data.ErrorMessgae);
      } else {
        if (data.QueryResultData && data.QueryResultData.length > 0) {
          this.SalesDataSource = JSON.parse(
            JSON.stringify(data.QueryResultData)
          );
        }
      }
      console.log(this.SalesModelData.SalesId);
    }, 500);
  }

  OnAddBtnClick() {
    this.ItemDataSource = [];
    this.SalesArrModel.push(
      JSON.parse(JSON.stringify(this.SalesModelData))
    );
    if (this.SalesArrModel && this.SalesArrModel.length > 0) {
      this.ItemDataSource = JSON.parse(JSON.stringify(this.SalesArrModel));
      this.SalesModelData.TotalAmt += this.SalesModelData.NetValue;
      this.ClearItemData();
    } else {
      this.ItemDataSource = [];
    }
  }

  ClearItemData(){
    this.SalesModelData.ItemId = 0;
    this.SalesModelData.DesignNo = 0;
    this.SalesModelData.StockQty = 0;
    this.SalesModelData.SaleQty = 0;
    this.SalesModelData.AltQty = 0;
    this.SalesModelData.Price = 0;
    this.SalesModelData.Per = "";
    this.SalesModelData.BasicAmt = 0;
    this.SalesModelData.Discount = 0;
    this.SalesModelData.DiscountAmt = 0;
    this.SalesModelData.TaxSlab = 0;
    this.SalesModelData.TaxAmt = 0;
    this.SalesModelData.NetValue = 0;  
  }

  FillCustomerList() {
    this.CustomerList = [];
    this.Qry = 'SELECT * FROM CustomerMaster;';
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

  OnCustomerChange() {
    if(this.SalesModelData.CustomerId){
      let a = this.CustomerList.find((i) => i['customerid'] == this.SalesModelData.CustomerId);
      this.CustomerData = a;
      this.SalesModelData.Balance = this.CustomerData.openingbal;
    }
  }

  OnItemChange() {
    if (this.SalesModelData.ItemId) {
      let a = this.ItemList.find((i) => i['ItemId'] == this.SalesModelData.ItemId);



      this.Qry =
        'SELECT * FROM itemmaster WHERE ItemId = ' +
        this.SalesModelData.ItemId;
      let data = this.DBService.query(this.Qry);
      setTimeout(() => {
        if (data.IsErrorExists) {
          alert(data.ErrorMessgae);
        } else {
          if (data.QueryResultData && data.QueryResultData.length > 0) {
            let newData = JSON.parse(JSON.stringify(data.QueryResultData));
            this.SalesModelData.StockQty = newData[0].StockQty;
            this.SalesModelData.DesignNo = newData[0].DesignNo;
            this.SalesModelData.AltQty = newData[0].ItemUnitPerRate;
            this.SalesModelData.Per = newData[0].ItemUnit;
            this.SalesModelData.Discount = newData[0].Discount;
            this.SalesModelData.TaxSlab = newData[0].TaxSlab;
          }
        }
      }, 500);
    }
  }

  OnInputChange() {
    this.SalesModelData.BasicAmt =
      this.SalesModelData.Per == 'SQ FT'
        ? this.SalesModelData.Price * this.SalesModelData.AltQty * this.SalesModelData.SaleQty
        : this.SalesModelData.Price * this.SalesModelData.SaleQty;
        this.SalesModelData.NetValue = this.SalesModelData.BasicAmt;
  }

  ClearData() {
    this.ItemDataSource = [];
    this.SalesArrModel = [];
    this.SalesModelData = new SalesModel();
  }

  FillItemList() {
    this.ItemList = [];
    this.Qry = 'SELECT * FROM ItemMaster;';
    let data = this.DBService.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        alert(data.ErrorMessgae);
      } else {
        if (data.QueryResultData && data.QueryResultData.length > 0) {
          this.ItemList = JSON.parse(JSON.stringify(data.QueryResultData));
        }
      }
    }, 500);
  }

  AddNewRecord() {
    let data: DBServiceModel = new DBServiceModel();

    this.Qry =
      `SELECT * FROM SalesSummary WHERE CustomerId = ` +
      this.SalesModelData.CustomerId +
      " AND SalesDatex = '" +
      this.SalesModelData.SalesDate +
      "'";
    let CheckRecord = this.DBService.query(this.Qry);
    if (CheckRecord.QueryResultData && CheckRecord.QueryResultData.length > 0) {
      let table = JSON.parse(JSON.stringify(CheckRecord.QueryResultData));
      this.SalesModelData.SalesId = table[0].SalesId;
      if (this.InsertIntoDetail()) {
        alert('Record Added!!!');
      }
    } else {
      this.Qry = `INSERT INTO SalesSummary(CustomerId,SalesDate,Terms,Balance,TotalAmt,IsKhacha,CreatedDate,ModifiedDate)
       VALUES(?, ?, ?, ?, ?,?,?,?);`;
      this.parameters = [
        this.SalesModelData.CustomerId,
        this.SalesModelData.SalesDate,
        this.SalesModelData.Terms,
        this.SalesModelData.Balance,
        this.SalesModelData.TotalAmt,
        this.SalesModelData.IsKhacha,
        this.currentDateTime,
        this.currentDateTime
      ];

      data = this.DBService.InsertIntoTables(this.Qry, this.parameters);

      setTimeout(() => {
        this.SalesModelData.SalesId = JSON.parse(
          JSON.stringify(data.QueryResultData)
        )['insertId'];
        this.InsertIntoDetail();
        this.GetPurchasedData();
        this.IsAddSection = !this.IsAddSection;
      }, 500);
    }
  }

  InsertIntoDetail(): boolean {
    console.log(this.SalesModelData.SalesId);
    let data: DBServiceModel = new DBServiceModel();
    if (this.SalesArrModel && this.SalesArrModel.length > 0) {
      for (let i = 0; i < this.SalesArrModel.length; i++) {
        this.Qry = `INSERT INTO SalesDetail(SalesId, ItemId, StockQty, SalesQty, AltQty, Price, Per, BasicAmt, DisPercentage,
          DiscountAmt, TaxPercentage, TaxAmount, NetValue) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
        this.parameters = [
          this.SalesModelData.SalesId,
          this.SalesArrModel[i].ItemId,
          this.SalesArrModel[i].StockQty,
          this.SalesArrModel[i].SaleQty,
          this.SalesArrModel[i].AltQty,
          this.SalesArrModel[i].Price,
          this.SalesArrModel[i].Per,
          this.SalesArrModel[i].BasicAmt,
          this.SalesArrModel[i].Discount,
          this.SalesArrModel[i].DiscountAmt,
          this.SalesArrModel[i].TaxSlab,
          this.SalesArrModel[i].TaxAmt,
          this.SalesArrModel[i].NetValue,
        ];
        data = this.DBService.InsertIntoTables(this.Qry, this.parameters);
        if (data.IsErrorExists) {
          alert(data.ErrorMessgae);
          break;
        }
      }
      setTimeout(() => {}, 500);
      return data.IsQueryExecuted;
    } else {
      return false;
    }
  }
}
