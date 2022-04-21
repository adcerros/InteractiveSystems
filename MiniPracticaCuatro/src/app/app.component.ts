import { Component, ViewChild, ElementRef, Pipe, PipeTransform, AfterViewInit} from '@angular/core';
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
  selector: 'carListerMaker',
  template: '\
    <p class="mainTitle">Concesionario de coches</p>\
    <div class="fullWidthDiv mt-5">\
      <p class="secondaryTitle">Filtrar por:</p>\
      <select class="filterInput" [(ngModel)]="currentSelectionData">\
        <option value="" selected disabled>Selecciona la categoria</option>\
        <option  *ngFor="let currentSelectionData of filtersList">{{currentSelectionData}}</option>\
      </select>\
      <input class="filterInput" placeholder="Texto a filtrar" (input)="filtreElements()" [(ngModel)]="filterKeyword">\
      <button class="resetFilterInput" (click)="resetFilterInput()">Borrar</button>\
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

export class carListerMaker implements AfterViewInit {  
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
  // Listado de vehiculos
  carsList = [{name: "Joaquin", telf: "655431212", email: "juaquinrod@gmail.com", type: "Trabajo", habitual: "Si"},
              {name: "Marta", telf: "655897252", email: "martaplaza@gmail.com", type: "Personal", habitual: "No"},
              {name: "Arturo", telf: "623928976", email: "arturoperez@gmail.com", type: "Trabajo", habitual: "Si"},
              {name: "Marcos", telf: "655498512", email: "marcosramirez@gmail.com", type: "Trabajo", habitual: "Si"},
              {name: "Andrea", telf: "627461212", email: "andop@gmail.com", type: "Trabajo", habitual: "Si"},
              {name: "Melisa", telf: "65595262", email: "malizita@gmail.com", type: "Personal", habitual: "No"},
              {name: "Pablo", telf: "635271212", email: "pablo827@gmail.com", type: "Personal", habitual: "Si"}];
  carsListBackUp = [...this.carsList];
  
  // Al iniciarse crea a todos sus hijos
  ngAfterViewInit(): void {
    this.createAllComponents();
  }

  private createAllComponents() {
    for (let i in this.carsList) {
      this.createNewCarComponent(Number(i));
    }
  }

  // Resetea los indicadores de ordenamiento
  private removeOrderingSelection(): void {
    this.orderingByBrand = false;
    this.orderingByModel = false;
    this.orderingByYear = false;
    this.orderingByPrice = false;
    this.orderingBySaleDate = false;
    this.orderingByState = false;
  }

  // Crea un componente hijo
  private createNewCarComponent(index: number) {
    const newComponent = this.dynamicHost.viewContainerRef.createComponent(carComponent);
    newComponent.instance.name = this.carsList[index].name;
    newComponent.instance.tlf = this.carsList[index].tlf;
    newComponent.instance.email = this.carsList[index].email;
    newComponent.instance.type = this.carsList[index].type;
    newComponent.instance.habitual = this.carsList[index].habitual;
    // Se crea un observable y una suscripcion para eliminar a los hijos cuando sea necesario
    this.deleteSons$Obs.subscribe(deleteSons => {
      newComponent.destroy()
    });
    // Se crea un observable y una suscripcion para eliminar a los hijos cuando sea necesario 
    //de la lista principal cuando se pulse el boton
    newComponent.instance.returnDeletedCarInfo$Obs.subscribe(currentTlf => {
      let index = this.carsList.map(object => object.tlf).indexOf(currentTlf);
      this.carsList.splice(index, 1)
      this.carsListBackUp.splice(index, 1)
    });
  }

  // Reset del input del filtrado
  resetFilterInput() : void{
    this.filterKeyword = "";
    this.filtreElements()
  }

  // Analisis del filtrado
  filtreElements(): void{
    if (this.filterKeyword != undefined && this.filterKeyword != null && this.filterKeyword != ""){
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
    // Esta comprobación evita errores con la cadena de entrada vacia
    else{
      this.carsList = [...this.carsListBackUp];
      this.deleteSons$.next(false);
      this.createAllComponents();
    }
  }

  // Diferentes filtrados: se incluyen por marca, modelo, año, precio mayor y menor que, fecha del anuncio mayor y menor que
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
    let currentDate = new Date(this.filterKeyword)
    for (let i = 0; i < this.carsListBackUp.length; i++){
      if (this.carsListBackUp[i].onSaleDate <= currentDate){
        this.carsList.push(this.carsListBackUp[i]);
      }
    }
    this.createAllComponents();
  }

  private filtreBySaleDateMoreThan(): void {
    this.deleteSons$.next(false);
    this.carsList = [];
    let currentDate = new Date(this.filterKeyword)
    for (let i = 0; i < this.carsListBackUp.length; i++){
      if (this.carsListBackUp[i].onSaleDate >= currentDate){
        this.carsList.push(this.carsListBackUp[i]);
      }
    }
    this.createAllComponents();
  }

  // Reseteo de los filtros parte comun I
  private resetFilters() {
    this.removeOrderingSelection();
    this.deleteSons$.next(false);
    this.carsList = [...this.carsListBackUp];
    this.createAllComponents();
  }

  // Reseteo de los filtros parte comun II
  private enableFiltering() {
    this.deleteSons$.next(false);
    this.removeOrderingSelection();
  }

  // Metodos de ordenamiento se incluyen: por marca, modelo, precio, año y fecha de anuncio

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
  name : string = "undefined";
  tlf : string = "undefined";
  email : string = "undefined";
  type : string = "undefined";
  habitual : string = "undefined";
  returnDeletedCarInfo$: Subject<any> = new Subject();
  returnDeletedCarInfo$Obs: Observable<any> = this.returnDeletedCarInfo$.asObservable();

  constructor(private hostComponent: ElementRef<HTMLElement>){
  }

  // Al pulsar en el boton se elimina el componente
  // Se envia el id del hijo al padre para que lo elimine de la lista de coches y no vuelva a aparecer al reordernar
  deleteCar(): void{
      this.returnDeletedCarInfo$.next(this.tlf)
      this.hostComponent.nativeElement.remove();
  }
}





