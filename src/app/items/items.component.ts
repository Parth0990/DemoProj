import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { DBService } from '../app.dbservice';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

export class ItemMasterModel{
  ItemId:number =  0;
  ItemName: string = "";
  Thickness: number = 0;
  DesignNo: number = 0;
  ShortName: string = "";
  ItemGroupId: number = 0;
  ItemUnit: string = "";
  ItemUnitPerRate: number = 0;
  StockQty: number = 0;
  TaxSlab: number = 0;
  Discount: number = 0;
}

export class DropDownProp {
  Id: number = 0;
  Name: string = '';
}

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit {
  Qry: string = '';
  IsAddSection: boolean = false;
  ItemMasterData: ItemMasterModel = new ItemMasterModel();
  ItemsDataSource = new MatTableDataSource<ItemMasterModel>([]);
  colums = ["ItemName","ShortName","GroupName","Thickness","DesignNo","StockQty"];
  GroupNameList: DropDownProp[] = [];
  GroupName:any = '';
  currentDateTime:any = new Date();

  constructor(private dbservice: DBService){}

  ngOnInit(): void{
  this.getItemList();
  this.FillGroupNameList();
  }

  AddBtnClick(){
    this.IsAddSection = !this.IsAddSection;
    this.clearModelData();
  }

  clearModelData(){
  this.ItemMasterData.ItemName = "";
  this.ItemMasterData.ShortName = "";
  this.ItemMasterData.Thickness = 0;
  this.ItemMasterData.DesignNo = 0;
  this.ItemMasterData.ItemGroupId = 0;
  this.ItemMasterData.ItemUnit = "";
  this.ItemMasterData.ItemUnitPerRate = 0;
  this.ItemMasterData.StockQty = 0;
  this.ItemMasterData.TaxSlab = 0;
  this.ItemMasterData.Discount = 0;
  }

  getItemList(){
    this.ItemsDataSource.data = [];
    this.Qry = 'SELECT IM.ItemId,IM.ItemName,IM.ShortName,IGM.ItemGroupName,IM.Thickness,IM.DesignNo,IM.StockQty FROM ItemMaster IM INNER JOIN ItemGroupMaster IGM on igm.ItemGroupId=IM.ItemGroupId;';
    let data = this.dbservice.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        alert(data.ErrorMessgae);
      } else {
        if (data.QueryResultData && data.QueryResultData.length > 0) {
          let result = JSON.parse(JSON.stringify(data.QueryResultData));
          this.ItemsDataSource = new MatTableDataSource(result);
        }
      }
    }, 500);
  }

  FillGroupNameList() {
    this.GroupNameList = [];
    this.Qry = 'SELECT ItemGroupId AS Id,ItemGroupName  As Name FROM ItemGroupMaster;';
    let data = this.dbservice.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        alert(data.ErrorMessgae);
      } else {
        if (data.QueryResultData && data.QueryResultData.length > 0) {
          this.GroupNameList = JSON.parse(JSON.stringify(data.QueryResultData));
        }
      }
    }, 500);
  }

  OnModalSave(){
    let parameters: any;
    this.Qry=`Insert Into ItemGroupMaster(ItemGroupName) Values(?)`;
    parameters = [this.GroupName];
    let data = this.dbservice.InsertIntoTables(this.Qry, parameters);
    if (data.IsErrorExists) {
      //alert(data.ErrorMessgae);
    }
    else{
      this.GroupName="";
    }
  }

  OpenDialog(){
    console.log(this.ItemMasterData.ItemGroupId);
  }

  getGroupNameList(){
    this.FillGroupNameList();
  }

  OnItemSave(){
    let parameters: any;
    this.ItemMasterData.ItemName = this.ItemMasterData.Thickness +"-"+ this.ItemMasterData.DesignNo;
    let Qry = `Insert Into ItemMaster 
               (ItemName,Thickness, DesignNo,ShortName,ItemGroupId,ItemUnit,ItemUnitPerRate, StockQty,
                TaxSlab, Discount, CreatedDate, ModifiedDate)
                Values(?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    parameters = [this.ItemMasterData.ItemName,this.ItemMasterData.Thickness,this.ItemMasterData.DesignNo,this.ItemMasterData.ShortName
      , this.ItemMasterData.ItemGroupId, this.ItemMasterData.ItemUnit,this.ItemMasterData.ItemUnitPerRate,this.ItemMasterData.StockQty
      , this.ItemMasterData.TaxSlab,this.ItemMasterData.Discount,this.currentDateTime,this.currentDateTime];

       let data = this.dbservice.InsertIntoTables(Qry, parameters);
       if (data.IsErrorExists) {
        //alert(data.ErrorMessgae);
      }
      else{
        //alert('Record Added!!!');
        this.clearModelData();
        this.getItemList();
        this.IsAddSection = !this.IsAddSection;
      }
  }
}