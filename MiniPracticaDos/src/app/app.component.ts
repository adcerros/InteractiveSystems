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
        <option value="" selected disabled>Selecciona la categoria</option>\
        <option  *ngFor="let currentSelectionData of filtersList">{{currentSelectionData}}</option>\
      </select>\
      <input placeholder="Texto a filtrar" (input)="filtreElements()" [(ngModel)]="filterKeyword">\
    </div>\
    <div class="dataTitlesTableFormat d-flex justify-content-center mt-5 mb-5">\
      <button class="carsTableTitles">Foto</button>\
      <button class="carsTableTitles"  [ngClass]="{carsTableTitles : !orderingByBrand, carsTableTitlesSelected : orderingByBrand}" (click)=orderByBrand()>Marca</button>\
      <button class="carsTableTitles" [ngClass]="{carsTableTitles : !orderingByModel, carsTableTitlesSelected : orderingByModel}" (click)=orderByModel()>Modelo</button>\
      <button class="carsTableTitles" [ngClass]="{carsTableTitles : !orderingByYear, carsTableTitlesSelected : orderingByYear}" (click)=orderByYear()>Año</button>\
      <button class="carsTableTitles" [ngClass]="{carsTableTitles : !orderingBySaleDate, carsTableTitlesSelected : orderingBySaleDate}" (click)=orderBySaleDate()>En venta desde</button>\
      <button class="carsTableTitles" [ngClass]="{carsTableTitles : !orderingByPrice, carsTableTitlesSelected : orderingByPrice}" (click)=orderByPrice()>Precio</button>\
      <button class="carsTableTitles" [ngClass]="{carsTableTitles : !orderingByPrice, carsTableTitlesSelected : orderingByPrice}" (click)=orderByPrice()>PVP</button>\
      <button class="carsTableTitles">Acciones</button>\
    </div>\
    <ng-template carDinamicComponentHost></ng-template>',
  styleUrls: ['./app.component.scss']
})

export class billMaker implements AfterViewInit {  
  @ViewChild(MyComponentLoaderDirective) dynamicHost !: MyComponentLoaderDirective;
  currentSelectionData : string = "";
  filtersList: Array<string> = ["Modelo", "Marca", "Año", "Precio (menor que)", "Precio (mayor que)", "Fecha de venta (mas antigua que)", "Fecha de venta (mas reciente que)"];
  orderingByBrand : boolean = false;
  orderingByModel : boolean = false;
  orderingByYear : boolean = false;
  orderingByPrice : boolean = false;
  orderingByPvp : boolean = false;
  orderingBySaleDate : boolean = false;
  orderingByState : boolean = false;
  filterKeyword : string = "";
  // Creación del observable para que los hijos sepan cuando destruirse
  deleteSons$: Subject<any> = new Subject();
  deleteSons$Obs: Observable<any> = this.deleteSons$.asObservable();
  carsList = [{image: "assets/images/320.jpeg", brand: "BMW", model: "320", year: 2015, price: 11000, state: "Bueno", onSaleDate: new Date('11-09-2021'), id: Guid.newGuid()},
              {image: "assets/images/claseA.jpeg", brand: "Mercedes", model: "Clase A", year: 2018, price: 14000, state: "Bueno", onSaleDate: new Date('03-11-2021'), id: Guid.newGuid()},
              {image: "assets/images/taycan.jpeg", brand: "Porsche", model: "Taycan", year: 2021, price: 64000, state: "Bueno", onSaleDate: new Date(), id: Guid.newGuid()},
              {image: "assets/images/multipla.jpeg", brand: "Fiat", model: "Multipla", year: 2008, price: 2000, state: "Malo", onSaleDate: new Date(), id: Guid.newGuid()},
              {image: "assets/images/saxo.jpeg", brand: "Citroen", model: "Saxo", year: 2006, price: 1800, state: "Malo", onSaleDate: new Date(), id: Guid.newGuid()},
              {image: "assets/images/mustang.jpeg", brand: "Ford", model: "Mustang", year: 2016, price: 13400, state: "Bueno", onSaleDate: new Date('07-04-2020'), id: Guid.newGuid()}];
  carsListBackUp = [...this.carsList];
  
  
  ngAfterViewInit(): void {
    this.createAllComponents();
  }

  private createAllComponents() {
    for (let i in this.carsList) {
      this.createNewCarComponent(Number(i));
    }
  }

  private removeOrderingSelection(): void {
    this.orderingByBrand = false;
    this.orderingByModel = false;
    this. orderingByYear = false;
    this.orderingByPrice = false;
    this. orderingBySaleDate = false;
    this.orderingByState = false;
  }

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

  filtreElements(): void{
    if (this.currentSelectionData == "Marca"){
      this.filtreByBrand();
    }
    else if (this.currentSelectionData == "Modelo"){
      this.filtreByModel();
    }
    else if (this.currentSelectionData == "Año"){
      this.filtreByYear();
    }
    else if (this.currentSelectionData == "Precio (menor que)"){
      this.filtreByPriceLessThan();
    }
    else if (this.currentSelectionData == "Precio (mayor que)"){
      this.filtreByPriceMoreThan();
    }
    else if (this.currentSelectionData == "Fecha de venta (mas antigua que)"){
      this.filtreBySaleDateLessThan();
    }
    else if (this.currentSelectionData == "Fecha de venta (mas reciente que)"){
      this.filtreBySaleDateMoreThan();
    }
  }

  private filtreByBrand(): void {
    this.deleteSons$.next(false);
    this.carsList = [];
    for (let i = 0; i < this.carsListBackUp.length; i++){
      if (this.carsListBackUp[i].brand.substring(0, this.filterKeyword.length).toLowerCase() == this.filterKeyword.toLowerCase() ){
        this.carsList.push(this.carsListBackUp[i]);
      }
    }
    this.createAllComponents();
  }

  private filtreByModel(): void {
    this.deleteSons$.next(false);
    this.carsList = [];
    for (let i = 0; i < this.carsListBackUp.length; i++){
      if (this.carsListBackUp[i].model.substring(0, this.filterKeyword.length).toLowerCase()  == this.filterKeyword.toLowerCase() ){
        this.carsList.push(this.carsListBackUp[i]);
      }
    }
    this.createAllComponents();
  }

  private filtreByYear(): void {
    this.deleteSons$.next(false);
    this.carsList = [];
    for (let i = 0; i < this.carsListBackUp.length; i++){
      if (this.carsListBackUp[i].year.toString().substring(0, this.filterKeyword.length) == this.filterKeyword){
        this.carsList.push(this.carsListBackUp[i]);
      }
    }
    this.createAllComponents();
  }

  private filtreByPriceMoreThan(): void {
    this.deleteSons$.next(false);
    this.carsList = [];
    for (let i = 0; i < this.carsListBackUp.length; i++){
      if (this.carsListBackUp[i].price >= Number(this.filterKeyword)){
        this.carsList.push(this.carsListBackUp[i]);
      }
    }
    this.createAllComponents();
  }

  private filtreByPriceLessThan(): void {
    this.deleteSons$.next(false);
    this.carsList = [];
    for (let i = 0; i < this.carsListBackUp.length; i++){
      if (this.carsListBackUp[i].price <= Number(this.filterKeyword)){
        this.carsList.push(this.carsListBackUp[i]);
      }
    }
    this.createAllComponents();
  }

  private filtreBySaleDateLessThan(): void {
    this.deleteSons$.next(false);
    this.carsList = [];
    for (let i = 0; i < this.carsListBackUp.length; i++){
      let currentDate = new Date(this.filterKeyword)
      if (this.carsListBackUp[i].onSaleDate <= currentDate){
        this.carsList.push(this.carsListBackUp[i]);
      }
    }
    this.createAllComponents();
  }

  private filtreBySaleDateMoreThan(): void {
    this.deleteSons$.next(false);
    this.carsList = [];
    for (let i = 0; i < this.carsListBackUp.length; i++){
      let currentDate = new Date(this.filterKeyword)
      if (this.carsListBackUp[i].onSaleDate >= currentDate){
        this.carsList.push(this.carsListBackUp[i]);
      }
    }
    this.createAllComponents();
  }

  private resetFilters() {
    this.removeOrderingSelection();
    this.deleteSons$.next(false);
    this.carsList = [...this.carsListBackUp];
    this.createAllComponents();
  }


  private enableFiltering() {
    this.deleteSons$.next(false);
    this.removeOrderingSelection();
  }


  // Como en la lista de coches acaban primeros los ultimos elementos de la lista se invierte la comparacion
  orderByBrand() : void{
    if (this.orderingByBrand == true) {
      this.resetFilters();
    }
    else{
      this.enableFiltering();
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
      this.orderingByBrand = true;
    }
  }


  orderByModel() : void{
    if (this.orderingByModel == true) {
      this.resetFilters();
    }
    else{
      this.enableFiltering();
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
      this.orderingByModel = true;
    }
  }

  orderByPrice() : void{
    if (this.orderingByPrice == true) {
      this.resetFilters();
    }
    else{
      this.enableFiltering();
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
      this.orderingByPrice = true;
    }
  }

  orderByYear() : void{
    if (this.orderingByYear == true) {
      this.resetFilters();
    }
    else{
      this.enableFiltering();
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
      this.orderingByYear = true;
    }
  }

  orderBySaleDate() : void{
    if (this.orderingBySaleDate == true) {
      this.resetFilters();
    }
    else{
      this.enableFiltering();
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
      this.orderingBySaleDate = true;
    }
  }

}



@Component({
  selector: 'carComponent',
  template: '<div class="blackCenteredDiv d-flex justify-content-center">\
              <img class="carComponentImages" src={{image}} image="image" (error)="setErrorImageMessage()" *ngIf="availableImage">\
              <p class="errorImageText d-flex align-items-center justify-content-center" *ngIf="!availableImage">Imagen no disponible</p>\
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
  image : string = "Imagen no disponible";
  brand : string = "undefined";
  model : string = "undefined";
  year : number = 0;
  onSaleSince : Date = new Date();
  price : number = 999999;
  state : string = "undefined";
  myclass : string = "carComponentGood d-flex align-items-center justify-content-center";
  id: any;
  availableImage: boolean = true;
  returnDeletedCarInfo$: Subject<any> = new Subject();
  returnDeletedCarInfo$Obs: Observable<any> = this.returnDeletedCarInfo$.asObservable();

  constructor(private hostComponent: ElementRef<HTMLElement>){
  }

  setErrorImageMessage(): void{
    this.availableImage = false
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