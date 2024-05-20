import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DBService, DBServiceModel } from '../app.dbservice';
import Swal from 'sweetalert2';

export class PurchaseModel {
  PurchaseId: number = 0;
  GroupName: string = '';
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
  Price: number = 0;
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
  GroupNameList: DropDownProp[] = [];
  PurchaseModelData: PurchaseModel = new PurchaseModel();
  PurchaseArrModel: PurchaseModel[] = [];
  ItemDataSource: PurchaseModel[] = [];
  PurchaseDataSource: [] = [];
  IsAddSection: boolean = false;
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

  colums = [
    'VendorName',
    'ItemName',
    'PurchaseDate',
    'MainQty',
    'AltQty',
    'Per',
    'BasicAmt',
    'Discount',
    'DiscountAmt',
    'TaxAmt',
    'NetValue',
  ];

  constructor(private DBService: DBService) {}

  ngOnInit() {
    this.GetPurchasedData();
    this.FillVendorList();
    this.FillGroupNameList();
  }

  AddBtnClick() {
    this.IsAddSection = !this.IsAddSection;
    if (this.IsAddSection) {
      this.ClearData();
    }
  }

  GetPurchasedData() {
    this.Qry = `Select * FROM purchaseSummary PS
                INNER JOIN VendorMaster VM ON VM.VendorId = PS.VendorId
                INNER JOIN purchasedetail PD ON PD.purchaseId = PD.purchaseId
                INNER JOIN ItemMaster IM ON IM.ItemId = PD.ItemId;`;
    let data = this.DBService.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        Swal.fire(data.ErrorMessgae, "", "error");
      } else {
        if (data.QueryResultData && data.QueryResultData.length > 0) {
          this.PurchaseDataSource = JSON.parse(
            JSON.stringify(data.QueryResultData)
          );
          console.log(this.PurchaseDataSource);
        }
      }
      console.log(data);
    }, 500);
  }

  PrintScreen() {
    window.print();
  }

  OnAddBtnClick() {
    this.ItemDataSource = [];
    // let ItemName: any = this.ItemList.find(
    //   (x) => x['Id'] == this.PurchaseModelData.
    // )?.Name.toString();
    // this.PurchaseModelData.ItemName = ItemName;
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
        Swal.fire(data.ErrorMessgae, "", "error");
      } else {
        if (data.QueryResultData && data.QueryResultData.length > 0) {
          this.VendorList = JSON.parse(JSON.stringify(data.QueryResultData));
        }
      }
      console.log(this.VendorList);
    }, 500);
  }

  OnVendorChange() {
    this.Qry =
      'select * from VendorMaster WHERE VendorId = ' +
      this.PurchaseModelData.VenderId;
    let data = this.DBService.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        Swal.fire(data.ErrorMessgae, "", "error");
      } else {
        if (data.IsQueryExecuted) {
          let newDT = JSON.parse(JSON.stringify(data.QueryResultData));
          this.PurchaseModelData.Balance = newDT[0].openingbal;
        }
      }
    }, 500);
  }

  OnItemChange() {
    if (this.PurchaseModelData.GroupName) {
      this.Qry =
        'SELECT * FROM itemmaster WHERE GroupName = ' +
        this.PurchaseModelData.GroupName;
      let data = this.DBService.query(this.Qry);
      setTimeout(() => {
        if (data.IsErrorExists) {
          Swal.fire(data.ErrorMessgae, "", "error");
        } else {
          if (data.QueryResultData && data.QueryResultData.length > 0) {
            let newData = JSON.parse(JSON.stringify(data.QueryResultData));
            this.PurchaseModelData.MainQty = newData[0].StockQty;
            this.PurchaseModelData.DesignNo = newData[0].DesignNo;
            this.PurchaseModelData.AltQty = newData[0].ItemUnitPerRate;
            this.PurchaseModelData.Per = newData[0].ItemUnit;
            this.PurchaseModelData.Discount = newData[0].Discount;
            this.PurchaseModelData.TaxAmt = newData[0].TaxSlab;
          }
        }
      }, 500);
    }
  }

  OnInputChange() {
    this.PurchaseModelData.BasicAmt =
      this.PurchaseModelData.Per == 'SQ FT'
        ? this.PurchaseModelData.Price * this.PurchaseModelData.AltQty
        : this.PurchaseModelData.Price * this.PurchaseModelData.MainQty;
  }

  ClearData() {
    this.ItemDataSource = [];
    this.PurchaseArrModel = [];
    this.PurchaseModelData = new PurchaseModel();
  }

  FillGroupNameList() {
    this.VendorList = [];
    this.Qry = 'SELECT GroupName As Id, GroupName As Name FROM itemmaster;';
    let data = this.DBService.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        Swal.fire(data.ErrorMessgae, "", "error");
      } else {
        if (data.QueryResultData && data.QueryResultData.length > 0) {
          this.GroupNameList = JSON.parse(JSON.stringify(data.QueryResultData));
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
      this.InsertIntoDetail()
      Swal.fire("Record Added!!", "", 'success');
    } else {
      this.Qry = `INSERT INTO purchasesummary(purchasedate, terms, vendorId, series, balance) VALUES(?, ?, ?, ?, ?);`;
      this.parameters = [
        this.PurchaseModelData.EffectiveDate,
        this.PurchaseModelData.Terms,
        this.PurchaseModelData.VenderId,
        this.PurchaseModelData.Series,
        this.PurchaseModelData.Balance,
      ];

      data = this.DBService.InsertUpdateTables(this.Qry, this.parameters);

      setTimeout(() => {
        this.PurchaseModelData.PurchaseId = JSON.parse(
          JSON.stringify(data.QueryResultData)
        )['insertId'];
        this.InsertIntoDetail();
        Swal.fire("Record Added!!", "", 'success');
        this.GetPurchasedData();
        this.IsAddSection = !this.IsAddSection;
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
          this.PurchaseArrModel[i].GroupName,
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
        data = this.DBService.InsertUpdateTables(this.Qry, this.parameters);
        if (data.IsErrorExists) {
          Swal.fire("Error: " + data.ErrorMessgae, "", 'error');
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
