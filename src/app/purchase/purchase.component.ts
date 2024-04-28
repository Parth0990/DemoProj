import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

export class PurchaseModel{
  ItemName: string = "";
  MainQty: number = 0;
  AltQty: number = 0;
  Price: number = 0;
  Per: string = "";
  BasicAmt: number = 0;
  Discount: string = "";
  DiscountAmt: number = 0;
  TaxAmt: number = 0;
  NetValue: number = 0;
}

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [MatTableModule, FormsModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent {
  PurchaseModelData: PurchaseModel = new PurchaseModel();
  ItemDataSource: PurchaseModel[] = [];
  displayedColumns = ["ItemName", "Batch", "MainQty", "AltQty", "Free", "Price", "Per", "BasicAmt", "Discount", "DiscountAmt", "Tax", "TaxAmt", "NetValue"];


  OnAddBtnClick(){
    this.ItemDataSource.push(JSON.parse(JSON.stringify(this.PurchaseModelData)));
    console.log(this.ItemDataSource);
  }
}
