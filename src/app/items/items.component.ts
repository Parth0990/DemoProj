import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DBService } from '../app.dbservice';
import { FormsModule } from '@angular/forms';

export class ItemMasterModel{
  ItemName: string = "";
  ShortName: string = "";
  Thickness: number = 0;
  TaxId: number = 0;
  HsnORSacCode: string = "";
  DesignNo: number = 0;
  ItemCompanyId: number = 0;
  ItemGroupId: number = 0;
  ItemUnitId: number = 0;
  PurchasePrice: number = 0;
  SalesPrice: number = 0;
  MRP: number = 0;
  BasePrice: number = 0;
  MinSalePrice: number = 0;
  SelfValuePrice: number = 0;
  MinimumStock: number = 0;
  MaximumStock: number = 0;
  ReorderStock: number = 0;
  Discount: number = 0;
  ItemLocation: string = "";
  BarCode: string = "";
  ItemDescription: string = "";
  StockQty: number = 0;
  StockValue: number = 0;
  PurchaseHeadId: number = 0;
  SaleHeadId: number = 0;
}

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent {
  IsAddSection: boolean = false;
  ItemsDataSource: [] = [];
  colums = ["ItemName"];
  ShowSection: number = 0;
  DialogTitle: string = "";
  ItemMasterData: ItemMasterModel = new ItemMasterModel();

  @ViewChild('dialog') dialogbox: any;

  constructor(private dbservice: DBService){}

  AddBtnClick(){
    this.IsAddSection = !this.IsAddSection;
  }

  OpenDialog(Action: number = 0, ModalTitle: string = ""){
      this.ShowSection = Action;
      this.DialogTitle = ModalTitle;
  }

  OnItemSave(){
    let parameters: any;
    this.ItemMasterData.TaxId = 1;
    this.ItemMasterData.ItemGroupId = 1;
    this.ItemMasterData.ItemUnitId = 1;
    this.ItemMasterData.ItemCompanyId = 1;
    
    let Qry = `Insert Into itemmaster 
               (ItemName, ShortName, Thickness, TaxId, HsnORSacCode, DesignNo, ItemCompanyId, ItemGroupId,
                ItemUnitId, PurchasePrice, SalePrice, MRP, BasePrice, MinSalePrice, SelfValuePrice, MinimumStock,
                MaximumStock, ReorderStock, Discount, ItemLocation, BarCode, ItemDescription, StockQty, StockValue)
                Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    alert("Saved!!");

    parameters = [this.ItemMasterData.ItemName, this.ItemMasterData.ShortName, this.ItemMasterData.Thickness
      , this.ItemMasterData.TaxId, this.ItemMasterData.HsnORSacCode, this.ItemMasterData.DesignNo
      , this.ItemMasterData.ItemCompanyId, this.ItemMasterData.ItemGroupId, this.ItemMasterData.ItemUnitId
      , this.ItemMasterData.PurchasePrice, this.ItemMasterData.SalesPrice, this.ItemMasterData.MRP
      , this.ItemMasterData.BasePrice, this.ItemMasterData.MinSalePrice, this.ItemMasterData.SelfValuePrice
      , this.ItemMasterData.MinimumStock, this.ItemMasterData.MaximumStock, this.ItemMasterData.ReorderStock,
       this.ItemMasterData.Discount, this.ItemMasterData.ItemLocation, this.ItemMasterData.BarCode
       , this.ItemMasterData.ItemDescription, this.ItemMasterData.StockQty, this.ItemMasterData.StockValue];

       let data = this.dbservice.InsertIntoTables(Qry, parameters);
       console.log("Data:" + data.QueryResultData);
  }
}
