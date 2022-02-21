import { Component, ViewChild, ElementRef, EventEmitter, Output, HostListener} from '@angular/core';
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
              <billMaker (uppParentCounter)="upCounter($event)" (downParentCounter)="downCounter($event)"></billMaker>\
              <div totalBill=totalBill>El total es: {{totalBill}}</div>\
            </div>',
  styleUrls: ['./app.component.scss']
})

export class mainDiv {  
  totalBill = 0;
  downCounter(newPrice: any): void{
    this.totalBill = this.totalBill - newPrice;
  }

  upCounter(newprice: any): void {
     this.totalBill = this.totalBill + newprice;
  }
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
    <ng-template dishDinamicComponentHost></ng-template>',
  styleUrls: ['./app.component.scss']
})

export class billMaker {  
  dishList = ["Salmon a la plancha", "Carrillada al vino", "Chuleton de buey", "Tartar de atun", "Solomillo al oporto"];
  pricesList = [11, 14, 9, 16, 17]
  @ViewChild(MyComponentLoaderDirective) dynamicHost !: MyComponentLoaderDirective;
  @Output() uppParentCounter = new EventEmitter<any>();
  @Output() downParentCounter = new EventEmitter<any>();
  constructor(){
    this.uppParentCounter = new EventEmitter();
    this.downParentCounter = new EventEmitter();
  }

  upBill(): void{
    var dropdown = document.getElementById('selectionList') as HTMLSelectElement;
    this.uppParentCounter.emit(this.pricesList[dropdown.selectedIndex]);
    const newComponent = this.dynamicHost.viewContainerRef.createComponent(dishComponent);
    newComponent.instance.price = this.pricesList[dropdown.selectedIndex];
    newComponent.instance.dishName = this.dishList[dropdown.selectedIndex];
    newComponent.instance.downParentCounters$Obs.subscribe(price =>{
      this.downParentCounter.emit(price);
    })
  }
}

@Component({
  selector: 'dishComponent',
  template: '<div dishName="dishName" price="price">{{dishName}}{{price}}</div><button (click)="deleteDish()">Delete</button>',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: 'price', useValue: 'container'},
  ]
})

export class dishComponent {  
  dishName = "undefined";
  price = 0;
  downParentCounter$: Subject<number>;
  downParentCounters$Obs: Observable<Number>;
  constructor(private hostComponent: ElementRef<HTMLElement>){
    this.downParentCounter$ = new Subject();
    this.downParentCounters$Obs = this.downParentCounter$.asObservable();
  }

  deleteDish(): void{
    this.hostComponent.nativeElement.remove();
    this.downParentCounter$.next(this.price);
  }
}