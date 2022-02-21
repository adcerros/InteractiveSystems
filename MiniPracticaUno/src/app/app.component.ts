import { Component, ViewChild, ElementRef} from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
  template: '<div class="mainDiv">\
              <billMaker></billMaker>\
            </div>',
  styleUrls: ['./app.component.scss']
})

export class mainDiv {  
}

@Component({
  selector: 'billMaker',
  template: '\
    <select id=selectionList>\
      <option>Selecciona el plato a añadir</option>\
      <option>Salmon a la plancha</option>\
      <option>Carrillada al vino</option>\
      <option>Chuleton de buey</option>\
      <option>Tartar de atun</option>\
      <option>Solomillo al oporto</option>\
    </select>\
    <button (click)=upBill()>Add</button>\
    <ng-template dishDinamicComponentHost></ng-template>\
    <div totalBill=totalBill>El total es: {{totalBill}}</div>',
  styleUrls: ['./app.component.scss']
})

export class billMaker {  
  dishList : Array<string>;
  pricesList : Array<number>;
  totalBill : number;
  @ViewChild(MyComponentLoaderDirective) dynamicHost !: MyComponentLoaderDirective;
  constructor(){
    this.dishList = ["Salmon a la plancha", "Carrillada al vino", "Chuleton de buey", "Tartar de atun", "Solomillo al oporto"];
    this.pricesList = [11, 14, 9, 16, 17];
    this.totalBill = 0;
  }

  upBill(): void{
    var dropdown = document.getElementById('selectionList') as HTMLSelectElement;
    if (dropdown.selectedIndex > 0){
      let realSelectedIndex = dropdown.selectedIndex - 1;
      const newComponent = this.dynamicHost.viewContainerRef.createComponent(dishComponent);
      newComponent.instance.price = this.pricesList[realSelectedIndex];
      newComponent.instance.dishName = this.dishList[realSelectedIndex];
      newComponent.instance.downParentCounters$Obs.subscribe(price =>{
        this.totalBill = this.totalBill - price;
      })
      this.upCounter(this.pricesList[realSelectedIndex])
    }
    else{
      alert("Selecciona el plato a añadir");
    }
  }
  downCounter(newPrice: any): void{
    this.totalBill = this.totalBill - newPrice;
  }

  upCounter(newprice: any): void {
     this.totalBill = this.totalBill + newprice;
  }
}

@Component({
  selector: 'dishComponent',
  template: '<div dishName="dishName" price="price">{{dishName}}  {{price}}</div><button (click)="deleteDish()">Delete</button>',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: 'price', useValue: 'container'},
  ]
})

export class dishComponent {  
  dishName : string;
  price : number;
  downParentCounter$: Subject<number>;
  downParentCounters$Obs: Observable<number>;
  constructor(private hostComponent: ElementRef<HTMLElement>){
    this.dishName = "undefined";
    this.price = 0;
    this.downParentCounter$ = new Subject();
    this.downParentCounters$Obs = this.downParentCounter$.asObservable();
  }

  deleteDish(): void{
    this.hostComponent.nativeElement.remove();
    this.downParentCounter$.next(this.price);
  }
}