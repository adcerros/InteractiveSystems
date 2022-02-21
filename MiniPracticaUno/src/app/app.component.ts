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
    // Se comprueba que se ha seleccionado un plato
    if (dropdown.selectedIndex > 0){
      let realSelectedIndex = dropdown.selectedIndex - 1;
      // Se crea un nuevo componente con su informacion
      const newComponent = this.dynamicHost.viewContainerRef.createComponent(dishComponent);
      newComponent.instance.price = this.pricesList[realSelectedIndex];
      newComponent.instance.dishName = this.dishList[realSelectedIndex];
      // Se crea una suscripcion a un observable para restar el precio de la cuenta si se elimina
      newComponent.instance.downParentCounters$Obs.subscribe(price =>{
        this.totalBill = this.totalBill - price;
      })
      newComponent.instance.upParentCounters$Obs.subscribe(price =>{
        this.totalBill = this.totalBill + price;
      })
      // Se añade el precio a la cuenta total
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
  template: '<div dishName="dishName" price="price">{{dishName}} {{price}}</div>\
            <div>\
            <button (click)="deleteDish()">Delete</button>\
            <p repetitions="repetitions">{{repetitions}}</p>\
            <button (click)="addDishRepeated()">Add</button>\
            </div>',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: 'price', useValue: 'container'},
  ]
})

export class dishComponent {  
  dishName : string;
  price : number;
  repetitions : number;
  downParentCounter$: Subject<number>;
  downParentCounters$Obs: Observable<number>;
  upParentCounter$: Subject<number>;
  upParentCounters$Obs: Observable<number>;
  constructor(private hostComponent: ElementRef<HTMLElement>){
    this.dishName = "undefined";
    this.price = 0;
    this.repetitions = 1;
    // Se inicializa el sujeto y se transforma a observable
    this.downParentCounter$ = new Subject();
    this.downParentCounters$Obs = this.downParentCounter$.asObservable();
    this.upParentCounter$ = new Subject();
    this.upParentCounters$Obs = this.upParentCounter$.asObservable();
  }

  // Al pulsar en el boton se elimina el componente
  // Se envia el evento al componente padre para actualizar la cuenta antes de su eliminacion
  deleteDish(): void{
    if (this.repetitions < 2){
      this.repetitions--;
      this.downParentCounter$.next(this.price);
      this.hostComponent.nativeElement.remove();
    }
    else{
      this.repetitions--;
      this.downParentCounter$.next(this.price);
    }
  }

  addDishRepeated(): void{
    this.upParentCounter$.next(this.price);
    this.repetitions++;
  }
}