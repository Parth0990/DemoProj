import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonMethods } from '../common-methods.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [CommonMethods],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  CompanyId: number = 0;
  constructor(public CM: CommonMethods, private router: Router){
    
  }

  ngOnInit(): void {
    this.CompanyId = parseInt(this.CM.GetItemFromLocalStorage("CompanyId"));
  }

  OnLogout(){
    this.CM.RemoveItemFromLocalStorage("CompanyId");
    this.router.navigate(['/login']);
  }
  
}
