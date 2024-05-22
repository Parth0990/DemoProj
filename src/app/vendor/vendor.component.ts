import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { DBService } from '../app.dbservice';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

export class VendorDataModel {
  vendorid: Number = 0;
  vendorname: string = '';
  contactpersonname: string = '';
  mobileno: Number = 0;
  email: string = '';
  address: string = '';
  locationid: number = 0;
  cityid: number = 0;
  cityname: string = '';
  stateid: number = 0;
  statename: string = '';
  pincode: number = 0;
  accountno: string = '';
  gstno: string = '';
  openingbal: number = 0;
  openingbalmode: string = '';
}

export class DropDownProp {
  Id: number = 0;
  Name: string = '';
}

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.css',
})
export class VendorComponent implements OnInit {
  vendorMasModel: VendorDataModel = new VendorDataModel();
  dataSource = new MatTableDataSource<VendorDataModel>([]);
  displayedColumns: string[] = [
    'vendorname',
    'contactpersonname',
    'mobileno',
    'Action',
  ];
  CityStateDropDown = [];
  CityList: DropDownProp[] = [];
  parameter: any[] = [];
  Qry: any = '';
  LocationData: any = '';
  LocationName: any = '';
  vendorlist: boolean = false;
  IsAddSection: boolean = false;
  OperationType: string = '';

  constructor(private dbservice: DBService) {}

  ngOnInit(): void {
    this.vendorlist = true;
    this.getVendorList();
    this.getLocationList();
    this.FillCityList();
  }

  AddBtnClick() {
    this.IsAddSection = !this.IsAddSection;
    if (this.IsAddSection) {
      this.OperationType = 'Add';
    } else {
      this.OperationType = 'Back';
    }
    //this.clearModelData();
  }

  getVendorList() {
    let data = this.dbservice.query('select * from vendormaster;');
    setTimeout(() => {
      let result = JSON.parse(JSON.stringify(data.QueryResultData));
      this.dataSource = new MatTableDataSource(result);
    }, 500);
  }

  getLocationList() {
    let data = this.dbservice.query(
      'select lm.locationid,lm.locationname,cm.cityid,cm.cityname,sm.stateid,sm.statename from locationmaster lm inner join citymaster cm on cm.cityid=lm.cityid inner join statemaster sm on sm.stateid=cm.stateid;'
    );
    setTimeout(() => {
      this.CityStateDropDown = JSON.parse(JSON.stringify(data.QueryResultData));
    }, 500);
  }

  OpenDialog() {}

  onOptionsSelected(value: Event) {
    let a = this.CityStateDropDown.find(
      (i) => i['locationid'] == (value.target as HTMLInputElement).value
    );
    this.LocationData = a;
    this.vendorMasModel.locationid = this.LocationData.locationid;
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

  CrudPanel(element: any, Action: string = '') {
    this.vendorMasModel = Object.assign({}, element);
    let a = this.CityStateDropDown.find(
      (i) => i['locationid'] == element.locationid
    );
    this.LocationData = a;
    this.vendorMasModel.locationid = this.LocationData.locationid;
    this.vendorMasModel.cityid = this.LocationData.cityid;
    this.vendorMasModel.cityname = this.LocationData.cityname;
    this.vendorMasModel.stateid = this.LocationData.stateid;
    this.vendorMasModel.statename = this.LocationData.statename;
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
            'Delete From VendorMaster WHERE vendorId = ' + element.vendorid;
          console.log(element.vendorid);
          let data = this.dbservice.query(this.Qry);
          setTimeout(() => {
            if (data.IsErrorExists) {
              Swal.fire(data.ErrorMessgae, '', 'error');
            } else {
              this.vendorlist = false;
              Swal.fire('Deleted!!', '', 'success');
              this.getVendorList();
              this.vendorlist = true;
            }
          }, 500);
          console.log(data);
        }
      });
      this.OperationType = Action;
    }
  }

  save() {
    if (this.OperationType.toLowerCase() == 'edit') {
      this.Qry =
        `Update vendormaster SET VendorName = ?, contactpersonname=?, mobileno = ?, email = ?
    , address = ?, locationid = ?, cityid = ?, stateid = ?, pincode = ?, accountno = ?, 
    gstno = ?, openingbal = ?, openingbalmode = ? WHERE vendorId = ` +
        this.vendorMasModel.vendorid;
    } else {
      this.Qry = `insert Into vendormaster
    (vendorname,contactpersonname,mobileno,email,address,locationid,cityid,stateid,pincode,accountno,gstno,openingbal,openingbalmode) 
    Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    }

    this.parameter = [
      this.vendorMasModel.vendorname,
      this.vendorMasModel.contactpersonname,
      this.vendorMasModel.mobileno,
      this.vendorMasModel.email,
      this.vendorMasModel.address,
      this.vendorMasModel.locationid,
      this.vendorMasModel.cityid,
      this.vendorMasModel.stateid,
      this.vendorMasModel.pincode,
      this.vendorMasModel.accountno,
      this.vendorMasModel.gstno,
      this.vendorMasModel.openingbal,
      this.vendorMasModel.openingbalmode,
    ];

    let data = this.dbservice.InsertUpdateTables(this.Qry, this.parameter);

    setTimeout(() => {
      if (data.IsErrorExists) {
        Swal.fire(data.ErrorMessgae, '', 'error');
      } else {
        this.vendorlist = false;
        Swal.fire('Saved!!!', '', 'success');
        this.getVendorList();
        this.IsAddSection = false;
        this.vendorlist = true;
      }
    }, 500);
  }
}
