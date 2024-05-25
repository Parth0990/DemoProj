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
  ItemGroupId: number = 0;
  Batch: string = '';
  PurchaseDate: Date = new Date();
  Terms: number = 0;
  DesignNo: string = '';
  VendorId: number = 0;
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
  OperationType: string = '';
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
    'Action',
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
    this.Qry = `SELECT PS.PurchaseId,VM.VendorId,VM.VendorName,IM.ItemGroupId,IM.ItemName,Cast(PS.PurchaseDate as char(11)) As PurchaseDate
                ,PS.Terms, PS.Series, IM.StockQty, IM.DesignNo, PS.Balance, PD.MainQty, PD.AltQty, PD.Free, PD.Per, PD.BasicQty
                , PD.Discount, PD.DiscountAmt, PD.TaxAmt, PD.NetValue
                FROM purchaseSummary PS
                INNER JOIN VendorMaster VM ON VM.VendorId = PS.VendorId
                INNER JOIN purchasedetail PD ON PD.purchaseId = PD.purchaseId
                INNER JOIN ItemMaster IM ON IM.ItemId = PD.ItemId
                INNER JOIN ItemGroupId IG ON IG.ItemGroupId = PS.ItemGroupId;`;
    let data = this.DBService.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        Swal.fire(data.ErrorMessgae, '', 'error');
      } else {
        this.PurchaseDataSource = JSON.parse(
          JSON.stringify(data.QueryResultData)
        );
        console.log(this.PurchaseDataSource);
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
        Swal.fire(data.ErrorMessgae, '', 'error');
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
      this.PurchaseModelData.VendorId;
    let data = this.DBService.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        Swal.fire(data.ErrorMessgae, '', 'error');
      } else {
        if (data.IsQueryExecuted) {
          let newDT = JSON.parse(JSON.stringify(data.QueryResultData));
          this.PurchaseModelData.Balance = newDT[0].openingbal;
        }
      }
    }, 500);
  }

  OnItemChange() {
    if (this.PurchaseModelData.ItemGroupId) {
      this.Qry =
        'SELECT * FROM itemmaster WHERE itemgroupId = ' +
        this.PurchaseModelData.ItemGroupId;
      let data = this.DBService.query(this.Qry);
      setTimeout(() => {
        if (data.IsErrorExists) {
          Swal.fire(data.ErrorMessgae, '', 'error');
        } else {
          if (data.QueryResultData && data.QueryResultData.length > 0) {
            let newData = JSON.parse(JSON.stringify(data.QueryResultData));
            this.PurchaseModelData.ItemName = newData[0].ItemName;
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
    this.Qry =
      'SELECT ItemGroupId As Id, itemGroupName As Name FROM itemgroupmaster;';
    let data = this.DBService.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        Swal.fire(data.ErrorMessgae, '', 'error');
      } else {
        if (data.QueryResultData && data.QueryResultData.length > 0) {
          this.GroupNameList = JSON.parse(JSON.stringify(data.QueryResultData));
        }
      }
      console.log(this.VendorList);
    }, 500);
  }

  CrudPanel(element: any, Action: string = '') {
    this.PurchaseModelData = Object.assign({}, element);
    this.PurchaseArrModel = [];
    this.PurchaseArrModel.push(
      JSON.parse(JSON.stringify(this.PurchaseArrModel))
    );
    if (this.PurchaseArrModel && this.PurchaseArrModel.length > 0) {
      this.ItemDataSource = JSON.parse(JSON.stringify(this.PurchaseArrModel));
      //this.PurchaseModelData += this.PurchaseModelData.NetValue;
    } else {
      this.ItemDataSource = [];
    }
    if (Action.toLowerCase() == 'edit') {
      this.IsAddSection = true;
      this.OperationType = Action;
    }
    if (Action.toLowerCase() == 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        icon: 'info',
        confirmButtonText: 'Yes',
        showCloseButton: true,
      }).then((result) => {
        if (result['isConfirmed']) {
          this.Qry =
            'Delete From SalesDetail WHERE PurchaseId = ' +
            this.PurchaseModelData.PurchaseId;
          let data = this.DBService.query(this.Qry);
          setTimeout(() => {
            if (data.IsErrorExists) {
              Swal.fire(data.ErrorMessgae, '', 'error');
            } else {
              this.Qry =
                'DELETE FROM SalesSummary WHERE PurchaseId = ' +
                this.PurchaseModelData.PurchaseId;
              data = this.DBService.query(this.Qry);
              setTimeout(() => {
                if (data.IsErrorExists) {
                  Swal.fire(data.ErrorMessgae, '', 'error');
                } else {
                  Swal.fire('Deleted!!', '', 'success');
                  this.GetPurchasedData();
                  this.IsAddSection = false;
                }
              }, 500);
            }
          }, 500);
          console.log(data);
        }
      });
      this.OperationType = Action;
    }
  }

  AddNewRecord() {
    let data: DBServiceModel = new DBServiceModel();
    if (this.OperationType.toLowerCase() == 'edit') {
      this.Qry =
        `UPDATE SalesSummary SET VendorId = ?, PurchaseDate = ?, Terms = ?, Balance = ? WHERE SalesId = ` +
        this.PurchaseModelData.PurchaseId;
      this.parameters = [
        this.PurchaseModelData.VendorId,
        this.PurchaseModelData.PurchaseDate,
        this.PurchaseModelData.Terms,
        this.PurchaseModelData.Balance,
      ];

      let data = this.DBService.InsertUpdateTables(this.Qry, this.parameters);
      setTimeout(() => {
        if (data.IsErrorExists) {
          Swal.fire(data.ErrorMessgae, '', 'error');
        } else {
          data = this.InsertUpdateIntoDetail();
          setTimeout(() => {
            if (data.ErrorMessgae) {
              Swal.fire(data.ErrorMessgae, '', 'error');
            } else {
              Swal.fire('Record Updated!!!', '', 'success');
              this.IsAddSection = false;
              this.GetPurchasedData();
            }
          }, 500);
        }
      }, 500);
    } else {
      this.Qry =
        `SELECT * FROM purchasesummary WHERE VendorId = ` +
        this.PurchaseModelData.VendorId +
        " AND purchasedate = '" +
        this.PurchaseModelData.PurchaseDate +
        "'";
      let CheckRecord = this.DBService.query(this.Qry);
      setTimeout(() => {
        if (
          CheckRecord.QueryResultData &&
          CheckRecord.QueryResultData.length > 0
        ) {
          let table = JSON.parse(JSON.stringify(CheckRecord.QueryResultData));
          this.PurchaseModelData.PurchaseId = table[0].purchaseId;
          data = this.InsertUpdateIntoDetail();
          setTimeout(() => {
            if (data.IsErrorExists) {
              Swal.fire(data.ErrorMessgae, '', 'error');
            } else {
              Swal.fire('Record Added!!', '', 'success');
            }
          }, 500);
        } else {
          this.Qry = `INSERT INTO purchasesummary(purchasedate, terms, vendorId, series, balance) VALUES(?, ?, ?, ?, ?);`;
          this.parameters = [
            this.PurchaseModelData.PurchaseDate,
            this.PurchaseModelData.Terms,
            this.PurchaseModelData.VendorId,
            this.PurchaseModelData.Series,
            this.PurchaseModelData.Balance,
          ];

          data = this.DBService.InsertUpdateTables(this.Qry, this.parameters);

          setTimeout(() => {
            if (data.IsErrorExists) {
              Swal.fire(data.ErrorMessgae);
            } else {
              this.PurchaseModelData.PurchaseId = JSON.parse(
                JSON.stringify(data.QueryResultData)
              )['insertId'];
              this.Qry = '';
              data = this.InsertUpdateIntoDetail();
              setTimeout(() => {
                if (data.IsErrorExists) {
                  Swal.fire(data.ErrorMessgae);
                } else {
                  Swal.fire('Record Added!!', '', 'success');
                  this.GetPurchasedData();
                  this.IsAddSection = !this.IsAddSection;
                }
              }, 500);
            }
          }, 500);
        }
      }, 500);
    }
  }

  InsertUpdateIntoDetail(): DBServiceModel {
    let data: DBServiceModel = new DBServiceModel();
    if (this.PurchaseArrModel && this.PurchaseArrModel.length > 0) {
      for (let i = 0; i < this.PurchaseArrModel.length; i++) {
        if (this.OperationType.toLowerCase() == 'edit') {
          this.Qry =
            `UPDATE SalesDetail SET ItemGroupId = ?, Batch = ?, MainQty = ?, AltQty = ?, Price = ?, Per = ?, 
             BasicAmt = ?, Discount = ?, DiscountAmt = ?, TaxAmt = ?, NetValue = ?
             WHERE SalesId = ` + this.PurchaseModelData.PurchaseId;

          this.parameters = [
            this.PurchaseArrModel[i].ItemGroupId,
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
        } else {
          this.Qry = `INSERT INTO PurchaseDetail(purchaseId, itemId, Batch, MainQty, altqty, free, per, basicqty, discount, discountamt, taxamt, netvalue) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          this.parameters = [
            this.PurchaseModelData.PurchaseId,
            this.PurchaseArrModel[i].ItemGroupId,
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
            Swal.fire('Error: ' + data.ErrorMessgae, '', 'error');
            break;
          }
        }
      }
      return data;
    } else {
      return data;
    }
  }
}
