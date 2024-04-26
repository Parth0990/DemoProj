import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent {
  ItemDataSource: [] = [];
  displayedColumns = ["ItemName", "Batch", "MainQty", "AltQty", "Free", "Price", "Per", "BasicAmt", "Discount", "DiscountAmt", "Tax", "TaxAmt", "NetValue"];
}
