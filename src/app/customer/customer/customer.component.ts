import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { DBService } from '../../app.dbservice';
import Swal from 'sweetalert2';

export class CustomerDataModel {
  customerid: Number = 0;
  customername: string = '';
  phoneno: Number = 0;
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
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent implements OnInit {
  customerMasModel: CustomerDataModel = new CustomerDataModel();
  dataSource = new MatTableDataSource<CustomerDataModel>([]);
  displayedColumns: string[] = ['customername', 'mobileno', 'action'];
  CityStateDropDown = [];
  CityList: DropDownProp[] = [];
  Qry: any = '';
  LocationData: any = '';
  LocationName: any = '';
  Customerlist: boolean = false;
  IsAddSection: boolean = false;
  parameter: any[] = [];
  OperationType: string = '';

  constructor(private dbservice: DBService) {}

  ngOnInit(): void {
    this.Customerlist = true;
    this.getCustomerList();
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

  getCustomerList() {
    let data = this.dbservice.query('select * from customermaster;');
    setTimeout(() => {
      let result = JSON.parse(JSON.stringify(data.QueryResultData));
      this.dataSource = new MatTableDataSource(result);
      console.log(this.dataSource.data);
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

  FillCityList() {
    this.CityList = [];
    this.Qry = 'SELECT CityId AS Id,CItyName  As Name FROM CityMaster;';
    let data = this.dbservice.query(this.Qry);
    setTimeout(() => {
      if (data.IsErrorExists) {
        Swal.fire(data.ErrorMessgae, '', 'error');
      } else {
        if (data.QueryResultData && data.QueryResultData.length > 0) {
          this.CityList = JSON.parse(JSON.stringify(data.QueryResultData));
        }
      }
    }, 500);
  }

  onOptionsSelected(value: Event) {
    let a = this.CityStateDropDown.find(
      (i) => i['locationid'] == (value.target as HTMLInputElement).value
    );
    this.LocationData = a;
    this.customerMasModel.locationid = this.LocationData.locationid;
    this.customerMasModel.cityid = this.LocationData.cityid;
    this.customerMasModel.cityid = this.LocationData.cityid;
    this.customerMasModel.cityname = this.LocationData.cityname;
    this.customerMasModel.stateid = this.LocationData.stateid;
    this.customerMasModel.statename = this.LocationData.statename;
  }

  OpenDialog() {}

  CrudPanel(item: any, Action: string) {
    this.customerMasModel = Object.assign({}, item);
    let a = this.CityStateDropDown.find(
      (i) => i['locationid'] == item.locationid
    );
    this.LocationData = a;
    this.customerMasModel.locationid = this.LocationData.locationid;
    this.customerMasModel.cityid = this.LocationData.cityid;
    this.customerMasModel.cityname = this.LocationData.cityname;
    this.customerMasModel.stateid = this.LocationData.stateid;
    this.customerMasModel.statename = this.LocationData.statename;
    if (Action.toLowerCase() == 'edit') {
      this.IsAddSection = true;
      this.OperationType = Action;
    }
    if (Action.toLowerCase() == 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        icon: 'info',
        confirmButtonText: 'Yes',
        showCloseButton: true
      }).then((result) => {
        if (result['isConfirmed']) {
          this.Qry =
            `Delete From customermaster WHERE CustomerId = ` +
            this.customerMasModel.customerid;
          let data = this.dbservice.query(this.Qry);
          setTimeout(() => {
            if(data.IsErrorExists){
              Swal.fire(data.ErrorMessgae, "", "error");
            }
            else{
              this.Customerlist = false;
              Swal.fire("Deleted!!", "", "success");
              this.getCustomerList();
              this.Customerlist = true;
            }
          }, 500);
        }
      });
      this.OperationType = Action;
    }
  }

  save() {
    if (this.OperationType.toLowerCase() == 'edit') {
      this.Qry =
        `Update customermaster SET CustomerName = ?, MobileNo = ?, Email = ?, PhoneNo = ?, Address = ?,
                  LocationId = ?, CityId = ?, StateId = ?, Pincode = ?, AccountNo = ?, Gstno = ?, OpeningBal = ?
                  Openingbalmode = ? WHERE customerId = ` +
        this.customerMasModel.customerid;
    } else if (this.OperationType.toLowerCase() == 'Add') {
      this.Qry = `insert Into customermaster(customername,mobileno,phoneno,email,address,locationid,cityid,stateid,pincode,accountno,gstno,openingbal,openingbalmode)
      Values(?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    }

    this.parameter = [
      this.customerMasModel.customername,
      this.customerMasModel.mobileno,
      this.customerMasModel.phoneno,
      this.customerMasModel.email,
      this.customerMasModel.address,
      this.customerMasModel.locationid,
      this.customerMasModel.cityid,
      this.customerMasModel.stateid,
      this.customerMasModel.pincode,
      this.customerMasModel.accountno,
      this.customerMasModel.gstno,
      this.customerMasModel.openingbal,
      this.customerMasModel.openingbalmode,
    ];

    let data = this.dbservice.InsertUpdateTables(this.Qry, this.parameter);

    setTimeout(() => {
      if (data.IsErrorExists) {
        Swal.fire(data.ErrorMessgae, '', 'error');
      } else {
        Swal.fire('Record Added!!!', '', 'success');
        this.getCustomerList();
        this.Customerlist = true;
        this.IsAddSection = false;
      }
    }, 500);
  }
}
