import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { DBService } from '../app.dbservice';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

export class VendorDataModel {
  vendorid:Number = 0;
  vendorname:string = "";
  contactpersonname:string = "";
  mobileno:Number = 0;
  email:string = "";
  address:string = "";
  locationid:number = 0;
  cityid:number = 0;
  cityname:string = "";
  stateid:number = 0;
  statename:string = "";
  pincode:number = 0;
  accountno:string  = "";
  gstno:string = "";
  openingbal:number = 0;
  openingbalmode:string = "";
}

export class DropDownProp {
  Id: number = 0;
  Name: string = '';
}

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [CommonModule,MatTableModule,FormsModule],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.css'
})
export class VendorComponent implements OnInit {
  vendorMasModel: VendorDataModel = new VendorDataModel();
  dataSource = new MatTableDataSource<VendorDataModel>([]);
  displayedColumns: string[] = ['vendorname','contactpersonname','mobileno', 'Action'];
  CityStateDropDown = [];
  CityList: DropDownProp[] = [];
  Qry: any = '';
  LocationData: any = '';
  LocationName: any = '';
  vendorlist:boolean = false;
  IsAddSection: boolean = false;
  IsEditSection: boolean = false;


constructor(private dbservice: DBService){}

ngOnInit(): void {
  this.vendorlist=true;
  this.getVendorList();
  this.getLocationList();
  this.FillCityList();
}

AddBtnClick(Action: string){
  if(Action.toLowerCase() == 'back'){
    this.IsAddSection = false;
    this.IsEditSection = false;
  }
  else{
    this.IsAddSection = true;
    this.vendorMasModel = new VendorDataModel();
  }
  //this.clearModelData();
}

DeleteVendorData(element: any){
  try{
    this.Qry = "Delete From VendorMaster ";
    let data = this.dbservice.DeleteFromTable(this.Qry, "WHERE vendorId = " + element.vendorid);
    if(data.IsErrorExists){
      Swal.fire(data.ErrorMessgae, "", "error");
    }
    else{
      this.vendorlist = false;
      Swal.fire("Deleted!!!", "", "success");
      this.getVendorList();
      this.vendorlist = true;
    }
  }
  catch(e: any){
    Swal.fire(e, "", "error");
  }
}

getVendorList(){
  let data = this.dbservice.query('select * from vendormaster;');
    setTimeout(() => {
      let result = JSON.parse(JSON.stringify(data.QueryResultData));
      this.dataSource = new MatTableDataSource(result);
    }, 500);
}

getLocationList(){
  let data = this.dbservice.query('select lm.locationid,lm.locationname,cm.cityid,cm.cityname,sm.stateid,sm.statename from locationmaster lm inner join citymaster cm on cm.cityid=lm.cityid inner join statemaster sm on sm.stateid=cm.stateid;');
    setTimeout(() => {
      this.CityStateDropDown = JSON.parse(JSON.stringify(data.QueryResultData));
    }, 500);
}

OpenDialog(){

}

onOptionsSelected(value: Event) {
  let a = this.CityStateDropDown.find(
    (i) => i['locationid'] == (value.target as HTMLInputElement).value
  );
  this.LocationData = a;
  this.vendorMasModel.locationid  = this.LocationData.locationid;
  this.vendorMasModel.cityid = this.LocationData.cityid;
  this.vendorMasModel.cityname = this.LocationData.cityname;
  this.vendorMasModel.stateid = this.LocationData.stateid;
  this.vendorMasModel.statename = this.LocationData.statename;
}

FillCityList() {
  this.CityList = [];
  this.Qry = 'SELECT CityId AS Id,CItyName  As Name FROM CityMaster;';
  let data = this.dbservice.query(this.Qry);
  setTimeout(() => {
    if (data.IsErrorExists) {
      alert(data.ErrorMessgae);
    } else {
      if (data.QueryResultData && data.QueryResultData.length > 0) {
        this.CityList = JSON.parse(JSON.stringify(data.QueryResultData));
      }
    }
  }, 500);
}

EditVendorData(element: any){
  this.vendorMasModel = Object.assign({}, element);
  let a = this.CityStateDropDown.find(
    (i) => i['locationid'] == element.locationid
  );
  this.LocationData = a;
  this.vendorMasModel.locationid  = this.LocationData.locationid;
  this.vendorMasModel.cityid = this.LocationData.cityid;
  this.vendorMasModel.cityname = this.LocationData.cityname;
  this.vendorMasModel.stateid = this.LocationData.stateid;
  this.vendorMasModel.statename = this.LocationData.statename;
  this.IsAddSection = true;
  this.IsEditSection = true;
}

Update(){

}

save(){
  let parameters: any;
  let Qry = `insert Into vendormaster
	(vendorname,contactpersonname,mobileno,email,address,locationid,cityid,stateid,pincode,accountno,gstno,openingbal,openingbalmode) 
	Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  parameters = [this.vendorMasModel.vendorname, this.vendorMasModel.contactpersonname, this.vendorMasModel.mobileno
    , this.vendorMasModel.email, this.vendorMasModel.address, this.vendorMasModel.locationid,this.vendorMasModel.cityid
    , this.vendorMasModel.stateid, this.vendorMasModel.pincode, this.vendorMasModel.accountno
    , this.vendorMasModel.gstno, this.vendorMasModel.openingbal, this.vendorMasModel.openingbalmode];

     let data = this.dbservice.InsertIntoTables(Qry, parameters);
     //alert("Saved!!");
     if(data.IsErrorExists){
      Swal.fire(data.ErrorMessgae, "", "error");
     }
     else{
      Swal.fire("Saved!!!", "", "success");
      this.getVendorList();
      this.vendorlist=true;
     }
}
}
