import { Component, ViewChild, ElementRef, Pipe, PipeTransform} from '@angular/core';
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
  selector: 'billMaker',
  template: '\
    <p class="mainTitle">ORDEN</p>\
    <div class="fullWidthDiv">\
      <p class="secondaryTitle">Consumicion: </p>\
      <select [(ngModel)]="currentSelectionData">\
        <option  *ngFor="let currentSelectionData of dishList; let i=index;">{{currentSelectionData}} {{pricesList[i] | pricesMainFormat}}</option>\
      </select>\
      <button class="addBtn" (click)=upBill()>&#10133;</button>\
    </div>\
    <div class="dataTitlesTableFormat">\
      <p class="consumitionsTitle">Consumiciones</p>\
      <p class="dishNameTitle">Producto</p><p class="dishPriceTitle">Precio</p><p class="dishNumberTitle">Numero</p>\
    </div>\
    <ng-template dishDinamicComponentHost></ng-template>\
    <div class="fullWidthDiv"><p class="specialTitle" totalBill=totalBill>El total es: {{totalBill | addEuro}}</p></div>',
  styleUrls: ['./app.component.scss']
})

export class billMaker{  
  dishList : Array<string>;
  pricesList : Array<number>;
  totalBill : number;
  currentSelectionData : string;
  @ViewChild(MyComponentLoaderDirective) dynamicHost !: MyComponentLoaderDirective;
  constructor(){
    this.dishList = ["Salmon a la plancha", "Carrillada al vino", "Chuleton de buey", "Tartar de atun", "Solomillo al oporto"];
    this.pricesList = [11, 14, 9, 16, 17];
    this.totalBill = 0;
    this.currentSelectionData = "Selecciona un plato a añadir";
  }

  upBill(): void{
    let dataSplited = this.currentSelectionData.split(' (')
    let index = this.dishList.indexOf(dataSplited[0])
    // Se comprueba que se ha seleccionado un plato
    if (index > -1){
      // Se crea un nuevo componente con su informacion
      this.createNewDishComponent(index);
      // Se añade el precio a la cuenta total
      this.upCounter(this.pricesList[index])
    }
    else{
      alert("Selecciona el plato a añadir");
    }
  }

  private createNewDishComponent(index: number) {
    const newComponent = this.dynamicHost.viewContainerRef.createComponent(dishComponent);
    newComponent.instance.price = this.pricesList[index];
    newComponent.instance.currentSelectionData = this.dishList[index];
    // Se crea una suscripcion a un observable para restar el precio de la cuenta si se elimina
    newComponent.instance.downParentCounters$Obs.subscribe(price => {
      this.totalBill = this.totalBill - price;
    });
    newComponent.instance.upParentCounters$Obs.subscribe(price => {
      this.totalBill = this.totalBill + price;
    });
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
  template: '<div class="blackCenteredDiv">\
              <p class="dishName" currentSelectionData="currentSelectionData">{{currentSelectionData}}</p>\
              <p class="dishPrice" price="price">{{price | addEuro }}</p>\
              <div class=dishNumber>\
                <button class="standardBtn" (click)="deleteDish()">&#10134;</button>\
                <p class="standardText" repetitions="repetitions">{{repetitions}}</p>\
                <button class="standardBtn" (click)="addDishRepeated()">&#10133;</button>\
              </div>\
            </div>',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: 'price', useValue: 'container'},
  ]
})

export class dishComponent {  
  currentSelectionData : string;
  price : number;
  repetitions : number;
  downParentCounter$: Subject<number>;
  downParentCounters$Obs: Observable<number>;
  upParentCounter$: Subject<number>;
  upParentCounters$Obs: Observable<number>;
  constructor(private hostComponent: ElementRef<HTMLElement>){
    this.currentSelectionData = "undefined";
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




@Pipe({
  name: 'addEuro'
})
export class addEuro implements PipeTransform{
 transform(price : number) {
   return price.toString() + " €"
 }
}

@Pipe({
  name: 'pricesMainFormat'
})
export class pricesMainFormat implements PipeTransform{
  transform(price : number) {
    return "( " + price.toString() + " €" + " )"
  }
 }