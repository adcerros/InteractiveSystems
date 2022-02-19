import { Component, ViewChild, ComponentFactoryResolver} from '@angular/core';
import { MyComponentLoaderDirective } from '../app/myComponentCreator'

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
    <div></div>\
    <h2>Se cargan</h2>\
    <ng-template dishDinamicComponentHost></ng-template>\
    <div totalBill=totalBill>El total es: {{totalBill}}</div>',
  styleUrls: ['./app.component.scss']
})

export class billMaker {  
  dishList = ["Salmon a la plancha", "Carrillada al vino", "Chuleton de buey", "Tartar de atun", "Solomillo al oporto"];
  pricesList = [11, 14, 9, 16, 17]
  totalBill = 0;
  addedDishesNumber = 0;
  dishComponentsList = [] as any;
  @ViewChild(MyComponentLoaderDirective) dynamicHost !: MyComponentLoaderDirective;
 

  upCounter(newprice: any): void {
     this.totalBill = this.totalBill + newprice;
  }
  downCounter(newprice: any): void {
    this.totalBill = this.totalBill - newprice;
  }

  upBill(): void{
    const newComponent = this.dynamicHost.viewContainerRef.createComponent(dishComponent);
    // var dropdown = document.getElementById('selectionList') as HTMLSelectElement;
    // this.upCounter(this.pricesList[dropdown.selectedIndex]) 
    this.addedDishesNumber++;
  }
}

@Component({
  selector: 'dishComponent',
  template: '<div dishName="dishName" price="price">{{dishName}}{{price}}</div><button (click)="deleteDish()">Delete</button>',
  styleUrls: ['./app.component.scss']
})

export class dishComponent {  
  dishName = "undefined";
  price = 0;
  dishNumber = 0;
  
  deleteDish(): void{
    alert("funciona");
  }
}