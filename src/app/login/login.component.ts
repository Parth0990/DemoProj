import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { DBService } from '../app.dbservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonMethods } from '../common-methods.component';

export class CompnayModel{
  CompanyId: number = 0;
  CompanyName: string = "";
  CompanyAbbr: string = "";
  Mobile: string = "";
  Phone: string = "";
  Address1: string = "";
  Address2: string = "";
  Pincode: string = "";
  City: string = "";
  State: string = "";
  District: string = "";
  Email: string = "";
  Website: string = "";
  GSTNo: string = "";
  VATNo: string = "";
  PanNo: string = "";
  TanNo: string = "";
  OpeningBal: string = "";
  DRCR: string = "";
  UserName: string = "";
  Password: string = "";
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  providers: [CommonMethods],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  UserName: string = '';
  UserPassword: string = '';
  CompanyDropDown = [];
  CityStateDropDown = [];
  StateName: any = '';
  CompanyMasModel: CompnayModel = new CompnayModel();

  constructor(private dbservice: DBService, public CM: CommonMethods, private router: Router){}

  ngOnInit(): void {
  }

  getCompanyList() {
    let data = this.dbservice.query('select * from companymaster;');
    setTimeout(() => {
      this.CompanyDropDown = JSON.parse(JSON.stringify(data.QueryResultData));
      if (!!this.CompanyDropDown && this.CompanyDropDown.length > 0) {
      }
      console.log(this.CityStateDropDown);
    }, 500);
  }
  onOptionsSelected(value: Event) {
    let a = this.CityStateDropDown.find(
      (i) => i['cityname'] == (value.target as HTMLInputElement).value
    );
    this.StateName = a;
    this.StateName = this.StateName.statename;
  }

  getCityStateList() {
    let data = this.dbservice.query(
      'select sm.*,cm.cityid,cm.cityname from statemaster sm ' +
        ' inner join citymaster cm on cm.stateid=sm.stateid;'
    );
    setTimeout(() => {
      this.CityStateDropDown = JSON.parse(JSON.stringify(data.QueryResultData));
    }, 500);
  }

  AddNewCompany(){
    let Qry = "";
    
    try{
      Qry = "insert Into companymaster " +
      "Values('" + this.CompanyMasModel.CompanyName + "', '" + this.CompanyMasModel.CompanyAbbr + "', '" + this.CompanyMasModel.Mobile + "', ' " + this.CompanyMasModel.Phone + "', ' " + this.CompanyMasModel.Address1 + "', '" + this.CompanyMasModel.Address2 + "', " + this.CompanyMasModel.Pincode + ", " + this.CompanyMasModel.City + ", " + this.CompanyMasModel.State + ", '" + this.CompanyMasModel.State + "', ' " + this.CompanyMasModel.Email + "', '" + this.CompanyMasModel.Website + ", '" + this.CompanyMasModel.GSTNo + "', '" + this.CompanyMasModel.VATNo + "', '" + this.CompanyMasModel.PanNo + "', '" + this.CompanyMasModel.TanNo + "', '" + this.CompanyMasModel.OpeningBal + "', '" + this.CompanyMasModel.DRCR + "', '" + this.CompanyMasModel.UserName + "', '" + this.CompanyMasModel.Password + "');";

      let data = this.dbservice.query(Qry);
      if(data && !data.IsErrorExists && data.IsQueryExecuted){
        Qry = "Create Database " + this.CompanyMasModel.CompanyAbbr + ";";
        let finaldata = this.dbservice.query(Qry);
        if(!finaldata.IsErrorExists && finaldata.IsQueryExecuted){
            alert("Success");
        }
      }
    }
    catch(ex){

    }
  }

  OnLogin(){
    this.CM.SetItemInLocalStorage("CompanyId", "1");
    this.CompanyMasModel.CompanyId = parseInt("0" + this.CM.GetItemFromLocalStorage("CompanyId"));
    this.router.navigate(['']);
  }
}
