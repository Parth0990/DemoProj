import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{

  ProductDataSource = [{
    ProductName: ""
  }];

  MatProductDataSource:any[] = [];

  columns = ["ProductName"];


  /**
   * Identify = 10 > 1
   * columns = ["ProductName1"]
   * columns = ["ProductName1, ProductName2"]
   * data = [{ProductName1:ABC_1, ProductName2:ACB_11}]
   * Cols = 
   */

  SplitAfter:number=15;

  splitCols(DS:any[]){
    let mainArr:any[] = [];
    let colArr:string[] = [];

   let parts = Math.ceil(DS.length/this.SplitAfter);

    for(let i=0;i<this.SplitAfter;i++){
      let positions = this.getPositions(i,parts);
      let obj:any={};
      for(let j=0;j<positions.length;j++){
        let ele = DS[positions[j]];
        obj['ProductName'+(j+1)]= ele ? ele['ProductName'] : null;
      } 

      mainArr.push(obj);  
    }

    for(let i=0;i<parts;i++){
      colArr.push('ProductName'+(i+1));
    }

    this.MatProductDataSource = mainArr;
    this.columns = colArr;

  }  

  getPositions(num:number,parts:number) {
    let positions = [];
    for (let i = 0; i < parts; i++) {
      let index = num + i * 10;
      positions.push(index);
    }
    return positions;
  }

  ngOnInit(): void {
    for(let i = 0; i < 20; i++){
      this.ProductDataSource.push({ProductName: "ABC_" + i});
    } 
    
    console.log(this.ProductDataSource);
    this.splitCols(this.ProductDataSource)
  }

  PrintData(){
    let printsection = document.getElementById("printsection")?.innerHTML;
    let popwindow = window.open("", "", "top = 0, left = 0, height = 100%, width = auto");
    popwindow?.document.open();
    popwindow?.document.write(`
    <html>
    <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    </head>
    <body onload="window.print(); window.close()">
    ${printsection}
    </body>
    </html>
    `);
    popwindow?.document.close();
  }
}
