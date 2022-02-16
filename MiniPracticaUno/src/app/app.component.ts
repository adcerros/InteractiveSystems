import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
 
}

@Component({
  selector: 'mainDiv',
  template: '<div class="mainDiv"><billMaker></billMaker></div>',
  styleUrls: ['./app.component.scss']
})

export class mainDiv {  
}

@Component({
  selector: 'billMaker',
  template: '\
    <select id=selectionList>\
      <option>Salmon a la plancha</option>\
      <option>Carrillada al vino</option>\
      <option>Chuleton de buey</option>\
      <option>Tartar de atun</option>\
      <option>Solomillo al oporto</option>\
    </select>\
    <button (click)=upBill()>Add</button>\
    <div id="bill"></div>\
    <div totalBill=totalBill>El total es: {{totalBill}}</div>',
  styleUrls: ['./app.component.scss']
})

export class billMaker {  
  dishList = ["Salmon a la plancha", "Carrillada al vino", "Chuleton de buey", "Tartar de atun", "Solomillo al oporto"];
  pricesList = [11, 14, 9, 16, 17]
  totalBill = 0;
  addedDishesNumber = 0;
  upCounter(newprice: any): void {
     this.totalBill = this.totalBill + newprice;
  }
  downCounter(newprice: any): void {
    this.totalBill = this.totalBill - newprice;
 }
  upBill(): void{
    var dropdown = document.getElementById('selectionList') as HTMLSelectElement;
    var bill =  document.getElementById('bill') as HTMLDivElement;
    var newHtml = "<div id=dishNumber" + this.addedDishesNumber + ">Esto es una prueba</div><button (click)=deletedish(" + this.addedDishesNumber + ")>Delete</button>";
    bill.insertAdjacentHTML('beforeend', newHtml);
    this.upCounter(this.pricesList[dropdown.selectedIndex]) 
    this.addedDishesNumber++;
  }
  deleteDish(index: any): void{
    var elementToRemove = document.getElementById("dishNumber" + index) as HTMLDivElement;
    alert("funciona");
    this.addedDishesNumber--;

  }


}
