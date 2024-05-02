import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DBService, DBServiceModel } from '../app.dbservice';

export class PurchaseModel {
  PurchaseId: number = 0;
  ItemId: number = 0;
  ItemName: string = '';
  Batch: string = '';
  EffectiveDate: Date = new Date();
  Terms: number = 0;
  DesignNo: string = '';
  VenderId: number = 0;
  Series: number = 0;
  Balance: string = '';
  BillNo: string = '';
  DueDate: Date = new Date();
  MainQty: number = 0;
  AltQty: number = 0;
  Price: string = '';
  Per: string = '';
  BasicAmt: number = 0;
  Discount: number = 0;
  DiscountAmt: number = 0;
  TaxAmt: number = 0;
  NetValue: number = 0;
}

export class DropDownProp {
  Id: number = 0;
  Name: string = '';
}

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [MatTableModule, CommonModule, FormsModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css',
})
export class PurchaseComponent implements OnInit {
  Qry: string = '';
  parameters: any;
  VendorList: DropDownProp[] = [];
  ItemList: DropDownProp[] = [];
  PurchaseModelData: PurchaseModel = new PurchaseModel();
  PurchaseArrModel: PurchaseModel[] = [];
  ItemDataSource: PurchaseModel[] = [];
  displayedColumns = [
    'ItemName',
    'DesignNo',
    'MainQty',
    'AltQty',
    'Free',
    'Price',
    'Per',
    'BasicAmt',
    'Discount',
    'DiscountAmt',
    'Tax',
    'TaxAmt',
    'NetValue',
  ];

  constructor(private DBService: DBService) {}

  ngOnInit() {
    this.FillVendorList();
    this.FillItemList();
  }

  OnAddBtnClick() {
    this.ItemDataSource = [];
    let ItemName: any = this.ItemList.find(
      (x) => x['Id'] == this.PurchaseModelData.ItemId
    )?.Name.toString();
    this.PurchaseModelData.ItemName = ItemName;
    this.PurchaseArrModel.push(
      JSON.parse(JSON.stringify(this.PurchaseModelData))
    );
    if (this.PurchaseArrModel && this.PurchaseArrModel.length > 0) {
      this.ItemDataSource = JSON.parse(JSON.stringify(this.PurchaseArrModel));
    } else {
      this.ItemDataSource = [];
    }
    console.log(this.ItemDataSource);
  }

  FillVendorList() {
    this.VendorList = [];
    this.Qry = 'SELECT VendorId As Id, VendorName As Name FROM vendorMaster;';
    let data = this.DBService.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        alert(data.ErrorMessgae);
      } else {
        if (data.QueryResultData && data.QueryResultData.length > 0) {
          this.VendorList = JSON.parse(JSON.stringify(data.QueryResultData));
        }
      }
      console.log(this.VendorList);
    }, 500);
  }

  OnItemChange() {
    if (this.PurchaseModelData.ItemId > 0) {
      this.Qry =
        'SELECT * FROM itemmaster WHERE ItemId = ' +
        this.PurchaseModelData.ItemId;
      let data = this.DBService.query(this.Qry);
      setTimeout(() => {
        if (data.IsErrorExists) {
          alert(data.ErrorMessgae);
        } else {
          if (data.QueryResultData && data.QueryResultData.length > 0) {
            let newData = JSON.parse(JSON.stringify(data.QueryResultData));
            this.PurchaseModelData.MainQty = newData[0].stockqty;
            this.PurchaseModelData.Balance = newData[0].stockvalue;
            this.PurchaseModelData.DesignNo = newData[0].designno;
            //this.PurchaseModelData.AltQty
            this.PurchaseModelData.Price = newData[0].purchaseprice;
            this.PurchaseModelData.BasicAmt =
              newData[0].UnitPerPrice == 'SQ ft'
                ? newData[0].purchaseprice * newData[0].altqty
                : newData[0].purchaseprice * this.PurchaseModelData.MainQty;
            this.PurchaseModelData.Discount = newData[0].discount;
          }
        }
      }, 500);
    }
  }

  FillItemList() {
    this.VendorList = [];
    this.Qry = 'SELECT ItemId As Id, ItemName As Name FROM itemmaster;';
    let data = this.DBService.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        alert(data.ErrorMessgae);
      } else {
        if (data.QueryResultData && data.QueryResultData.length > 0) {
          this.ItemList = JSON.parse(JSON.stringify(data.QueryResultData));
        }
      }
      console.log(this.VendorList);
    }, 500);
  }

  AddNewRecord() {
    let data: DBServiceModel = new DBServiceModel();

    this.Qry =
      `SELECT * FROM purchasesummary WHERE VendorId = ` +
      this.PurchaseModelData.VenderId +
      " AND purchasedate = '" +
      this.PurchaseModelData.EffectiveDate +
      "'";
    let CheckRecord = this.DBService.query(this.Qry);
    if (CheckRecord.QueryResultData && CheckRecord.QueryResultData.length > 0) {
      let table = JSON.parse(JSON.stringify(CheckRecord.QueryResultData));
      this.PurchaseModelData.PurchaseId = table[0].purchaseId;
      if (this.InsertIntoDetail()) {
        alert('Record Added!!!');
      }
    } else {
      this.Qry = `INSERT INTO purchasesummary(purchasedate, terms, vendorId, series, balance) VALUES(?, ?, ?, ?, ?);`;
      this.parameters = [
        this.PurchaseModelData.EffectiveDate,
        this.PurchaseModelData.Terms,
        this.PurchaseModelData.VenderId,
        this.PurchaseModelData.Series,
        this.PurchaseModelData.Balance,
      ];

      data = this.DBService.InsertIntoTables(this.Qry, this.parameters);

      setTimeout(() => {
            this.PurchaseModelData.PurchaseId = JSON.parse(JSON.stringify(data.QueryResultData))['insertId'];
            if (this.InsertIntoDetail()) {
              alert('Record Added!!!');
            }
      }, 500);
    }
  }

  InsertIntoDetail(): boolean {
    let data: DBServiceModel = new DBServiceModel();
    if (this.PurchaseArrModel && this.PurchaseArrModel.length > 0) {
      for (let i = 0; i < this.PurchaseArrModel.length; i++) {
        this.Qry = `INSERT INTO PurchaseDetail(purchaseId, itemId, Batch, MainQty, altqty, free, per, basicqty, discount, discountamt, taxamt, netvalue) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        this.parameters = [
          this.PurchaseModelData.PurchaseId,
          this.PurchaseArrModel[i].ItemId,
          this.PurchaseArrModel[i].Batch,
          this.PurchaseArrModel[i].MainQty,
          this.PurchaseArrModel[i].AltQty,
          this.PurchaseArrModel[i].Price,
          this.PurchaseArrModel[i].Per,
          this.PurchaseArrModel[i].BasicAmt,
          this.PurchaseArrModel[i].Discount,
          this.PurchaseArrModel[i].DiscountAmt,
          this.PurchaseArrModel[i].TaxAmt,
          this.PurchaseArrModel[i].NetValue,
        ];
        data = this.DBService.InsertIntoTables(this.Qry, this.parameters);
        if (data.IsErrorExists) {
          alert(data.ErrorMessgae);
          break;
        }
      }
      setTimeout(() => {
        
      }, 500);
      return data.IsQueryExecuted;
    } else {
      return false;
    }
  }
}
