import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DBService } from './app.dbservice';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';

export class CompnayModel{
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
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [],
})
export class AppComponent {
  title = 'AngularApp';
  UserName: string = '';
  UserPassword: string = '';
  CompanyDropDown = [];
  CityStateDropDown = [];
  StateName: any = '';
  CompanyMasModel: CompnayModel = new CompnayModel();

  constructor(private dbservice: DBService) {}
  OnInit() {
    //this.getCompanyList();
  }

  OnLogin() {
    //   let strQuery ='';
    //   if(this.UserName == '0'){
    //     strQuery = `select * from test`;
    //   }
    //   else if(this.UserName == '1'){
    //     strQuery = `insert into test values (1, 'ram')`;
    //   }
    //   else if(this.UserName == '2'){
    //     strQuery = `update test set name='raj' where id=1`;
    //   }
    //   else if(this.UserName == '3'){
    //     strQuery = `delete from test where id=1`;
    //   }
    //   else
    //   {
    //     strQuery = `select * from UserAccount where UserName='${this.UserName}' and UserPassword='${this.UserPassword}'`;
    //   }
    //   let data = this.dbservice.query(strQuery);
    //   console.log(data);
  }
}
