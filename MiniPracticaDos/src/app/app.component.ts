import { Component, ViewChild, ElementRef, Pipe, PipeTransform, OnInit, AfterViewInit} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MyComponentLoaderDirective } from '../app/myComponentCreator'
import { DatePipe } from '@angular/common';



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
    <p class="mainTitle">Concesionario de coches</p>\
    <div class="fullWidthDiv">\
      <p class="secondaryTitle">Filtrar por:</p>\
      <select [(ngModel)]="currentSelectionData">\
        <option  *ngFor="let currentSelectionData of filtersList; let i=index;">{{currentSelectionData}}</option>\
      </select>\
    </div>\
    <div class="dataTitlesTableFormat d-flex justify-content-center">\
      <p class="carsTableTitles">Foto</p><p class="carsTableTitles" (click)=orderByBrand()>Marca</p><p class="carsTableTitles" (click)=orderByModel()>Modelo</p>\
      <p class="carsTableTitles" (click)=orderByYear()>Año</p><p class="carsTableTitles" (click)=orderBySaleDate()>En venta desde</p><p class="carsTableTitles" (click)=orderByPrice()>Precio</p>\
      <p class="carsTableTitles" (click)=orderByPrice()>PVP</p><p class="carsTableTitles">Acciones</p>\
    </div>\
    <ng-template carDinamicComponentHost></ng-template>',
  styleUrls: ['./app.component.scss']
})

export class billMaker implements AfterViewInit {  
  currentSelectionData : string;
  filtersList: Array<string>
  // Creación del observable para que los hijos sepan cuando destruirse
  deleteSons$: Subject<any>;
  deleteSons$Obs: Observable<any>;
  carsList = [{image: "assets/images/320.jpeg", brand: "BMW", model: "320", year: 2015, price: 11000, state: "Bueno", onSaleDate: new Date('11-09-2021'), id: Guid.newGuid()},
              {image: "assets/images/claseA.jpeg", brand: "Mercedes", model: "Clase A", year: 2018, price: 14000, state: "Bueno", onSaleDate: new Date('03-11-2021'), id: Guid.newGuid()},
              {image: "assets/images/taycan.jpeg", brand: "Porsche", model: "Taycan", year: 2021, price: 64000, state: "Bueno", onSaleDate: new Date(), id: Guid.newGuid()},
              {image: "assets/images/multipla.jpeg", brand: "Fiat", model: "Multipla", year: 2008, price: 2000, state: "Malo", onSaleDate: new Date(), id: Guid.newGuid()},
              {image: "assets/images/saxo.jpeg", brand: "Citroen", model: "Saxo", year: 2006, price: 1800, state: "Malo", onSaleDate: new Date(), id: Guid.newGuid()},
              {image: "assets/images/mustang.jpeg", brand: "Ford", model: "Mustang", year: 2016, price: 13400, state: "Bueno", onSaleDate: new Date('07-04-2020'), id: Guid.newGuid()}]
  @ViewChild(MyComponentLoaderDirective) dynamicHost !: MyComponentLoaderDirective;
  constructor(){
    this.currentSelectionData = "Selecciona un plato a añadir";
    this.deleteSons$ = new Subject();
    this.deleteSons$Obs = this.deleteSons$.asObservable();
    this.filtersList = ["Modelo", "Marca", "Año"];
  }

  ngAfterViewInit(): void {
    this.createAllComponents();
  }
  private createAllComponents() {
    for (let i in this.carsList) {
      this.createNewCarComponent(Number(i));
    }
  }

  /*
  upBill(): void{
    let dataSplited = this.currentSelectionData.split(' (')
    let index = this.filtersList.indexOf(dataSplited[0])
    // Se comprueba que se ha seleccionado un plato
    if (index > -1){
      // Se crea un nuevo componente con su informacion
      this.createNewcarComponent(index);
      // Se añade el precio a la cuenta total
      this.upCounter(this.pricesList[index])
    }
    else{
      alert("Selecciona el plato a añadir");
    }
  }
  */

  private createNewCarComponent(index: number) {
    const newComponent = this.dynamicHost.viewContainerRef.createComponent(carComponent);
    newComponent.instance.image = this.carsList[index].image;
    newComponent.instance.brand = this.carsList[index].brand;
    newComponent.instance.model = this.carsList[index].model;
    newComponent.instance.year = this.carsList[index].year;
    newComponent.instance.price = this.carsList[index].price;
    newComponent.instance.state = this.carsList[index].state;
    newComponent.instance.onSaleSince = this.carsList[index].onSaleDate;
    // Se asigna un id unico a cada coche en venta dado que con los datos actuales no hay identificadores univocos
    newComponent.instance.id = this.carsList[index].id;
    newComponent.instance.parent = this;
    if (newComponent.instance.state == "Malo"){
      newComponent.instance.myclass = "carComponentBad d-flex align-items-center justify-content-center";
    }
    this.deleteSons$Obs.subscribe(deleteSons => {
      newComponent.destroy()
    });
    newComponent.instance.returnDeletedCarInfo$Obs.subscribe(currentCarId => {
      let index = this.carsList.map(object => object.id).indexOf(currentCarId);
      this.carsList.splice(index, 1)
    });
  }

  // Como en la lista de coches acaban primeros los ultimos elementos de la lista se invierte la comparacion

  orderByBrand() : void{
    this.deleteSons$.next(false);
    for (let i in this.carsList) {
      for (let j in this.carsList){
        if (this.carsList[i].brand < this.carsList[j].brand && i != j){
          let auxElem = this.carsList[i];
          this.carsList[i] = this.carsList[j];
          this.carsList[j] = auxElem;
        }
      }
    }
    this.createAllComponents()
  }

  orderByModel() : void{
    this.deleteSons$.next(0);
    for (let i in this.carsList) {
      for (let j in this.carsList){
        if (this.carsList[i].model < this.carsList[j].model && i != j){
          let auxElem = this.carsList[i];
          this.carsList[i] = this.carsList[j];
          this.carsList[j] = auxElem;
        }
      }
    }
    this.createAllComponents()
  }

  orderByPrice() : void{
    this.deleteSons$.next(false);
    for (let i in this.carsList) {
      for (let j in this.carsList){
        if (this.carsList[i].price < this.carsList[j].price && i != j){
          let auxElem = this.carsList[i];
          this.carsList[i] = this.carsList[j];
          this.carsList[j] = auxElem;
        }
      }
    }
    this.createAllComponents()
  }

  orderByYear() : void{
    this.deleteSons$.next(false);
    for (let i in this.carsList) {
      for (let j in this.carsList){
        if (this.carsList[i].year < this.carsList[j].year && i != j){
          let auxElem = this.carsList[i];
          this.carsList[i] = this.carsList[j];
          this.carsList[j] = auxElem;
        }
      }
    }
    this.createAllComponents()
  }

  orderBySaleDate() : void{
    this.deleteSons$.next(false);
    for (let i in this.carsList) {
      for (let j in this.carsList){
        if (this.carsList[i].onSaleDate < this.carsList[j].onSaleDate && i != j){
          let auxElem = this.carsList[i];
          this.carsList[i] = this.carsList[j];
          this.carsList[j] = auxElem;
        }
      }
    }
    this.createAllComponents()
  }

}




@Component({
  selector: 'carComponent',
  template: '<div class="blackCenteredDiv d-flex justify-content-center">\
              <img class="carComponentImages" src={{image}} image="image">\
              <p class="carComponentText d-flex align-items-center justify-content-center" model="brand">{{brand}}</p>\
              <p class="carComponentText d-flex align-items-center justify-content-center" brand="model">{{model}}</p>\
              <p class="carComponentText d-flex align-items-center justify-content-center" year="year">{{year}}</p>\
              <p class="carComponentText d-flex align-items-center justify-content-center" onSaleSince="onSaleSince">{{onSaleSince | dateOnFormat}}</p>\
              <p  myclass="myclass" [class]=myclass price="price">{{price | addEuro }}</p>\
              <p class="carComponentText d-flex align-items-center justify-content-center" price="price">{{price | getPvp }}</p>\
              <div class="carComponentText col align-items-center justify-content-center">\
                <button class="standardBtn" (click)="discount()">Rebajar</button>\
                <button class="standardBtn" (click)="deleteCar()">Vendido</button>\
              </div>\
            </div>',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: 'price', useValue: 'container'},
  ]
})

export class carComponent {  
  image : string;
  brand : string;
  model : string;
  year : number;
  onSaleSince : Date;
  price : number;
  state : string;
  myclass : string;
  parent : any;
  id: any;
  returnDeletedCarInfo$: Subject<any>;
  returnDeletedCarInfo$Obs: Observable<any>;

  constructor(private hostComponent: ElementRef<HTMLElement>){
    this.image = "Imagen no disponible";
    this.brand = "undefined";
    this.model = "undefined";
    this.year = 0;
    this.onSaleSince = new Date();
    this.price = 999999;
    this.state = "undefined";
    this.myclass = "carComponentGood d-flex align-items-center justify-content-center";
    this.returnDeletedCarInfo$ = new Subject();
    this.returnDeletedCarInfo$Obs = this.returnDeletedCarInfo$.asObservable();
  }

  // Al pulsar en el boton se elimina el componente
  // Se envia el id del hijo al padre para que lo elimine de la lista de coches y no vuelva a aparecer al reordernar
  deleteCar(): void{
      this.returnDeletedCarInfo$.next(this.id)
      this.hostComponent.nativeElement.remove();
  }

  discount(): void{
    this.price = Math.floor(this.price * 0.9)
  }
}




@Pipe({
  name: 'addEuro'
})
export class addEuro implements PipeTransform{
 transform(price : number) {
   return price.toFixed(2).toString()  + " €"
 }
}

@Pipe({
  name: 'getPvp'
})
export class getPvp implements PipeTransform{
 transform(price : number) {
   let pvp = Math.floor(price * 1.21)
   return pvp.toFixed(2).toString() + " €"
 }
}

@Pipe({
  name: 'dateOnFormat'
})
export class dateOnFormat implements PipeTransform{
 constructor(public datepipe: DatePipe){}
 transform(date : Date) {
   return this.datepipe.transform(date, 'dd-MM-yyyy')
 }
}


//Clase para crear identificadores unicos
class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}