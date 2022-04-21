import { Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
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
  selector: 'carListerMaker',
  template: '\
    <p class="mainTitle">Agenda telefonica</p>\
    <div class="fullWidthDiv mt-5">\
      <input class="filterInput" placeholder="Texto a filtrar" (input)="filtreElements()" [(ngModel)]="filterKeyword">\
      <button class="resetFilterInput" (click)="resetFilterInput()">Borrar</button>\
      <p class="secondaryTitle">Filtrar por:</p>\
      <select class="filterInput" [(ngModel)]="currentSelectionData">\
        <option value="" selected disabled>Selecciona la categoria</option>\
        <option  *ngFor="let currentSelectionData of filtersList">{{currentSelectionData}}</option>\
      </select>\
    </div>\
    <div class="dataTitlesTableFormat d-flex justify-content-center mt-5 mb-5">\
      <button class="carsTableTitles"  [ngClass]="{carsTableTitles : !orderingByName, carsTableTitlesSelected : orderingByName}" (click)=orderByName()>Nombre</button>\
      <button class="carsTableTitles" [ngClass]="{carsTableTitles : !orderingByTelf, carsTableTitlesSelected : orderingByTelf}" (click)=orderByTelf()>Telefono</button>\
      <button class="carsTableTitles" [ngClass]="{carsTableTitles : !orderingByEmail, carsTableTitlesSelected : orderingByEmail}" (click)=orderByEmail()>Email</button>\
      <button class="carsTableTitles" [ngClass]="{carsTableTitles : !orderingByType, carsTableTitlesSelected : orderingByType}" (click)=orderByType()>Tipo</button>\
      <button class="carsTableTitles" [ngClass]="{carsTableTitles : !orderingByHabitual, carsTableTitlesSelected : orderingByHabitual}" (click)=orderByHabitual()>Habitual</button>\
      <button class="carsTableTitles">Acciones</button>\
    </div>\
    <ng-template carDinamicComponentHost></ng-template>',
  styleUrls: ['./app.component.scss']
})

export class carListerMaker implements AfterViewInit {  
  @ViewChild(MyComponentLoaderDirective) dynamicHost !: MyComponentLoaderDirective;
  currentSelectionData : string = "";
  filtersList: Array<string> = ["Modelo", "Marca", "Año", "Precio (menor que)", "Precio (mayor que)", "Fecha de venta (mas antigua que)", "Fecha de venta (mas reciente que)"];
  orderingByName : boolean = false;
  orderingByTelf : boolean = false;
  orderingByEmail : boolean = false;
  orderingByHabitual : boolean = false;
  orderingByType : boolean = false;
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
    this.orderingByName = false;
    this.orderingByTelf = false;
    this.orderingByEmail = false;
    this.orderingByHabitual = false;
    this.orderingByType = false;
  }

  // Crea un componente hijo
  private createNewCarComponent(index: number) {
    const newComponent = this.dynamicHost.viewContainerRef.createComponent(carComponent);
    newComponent.instance.name = this.carsList[index].name;
    newComponent.instance.telf = this.carsList[index].telf;
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
      let index = this.carsList.map(object => object.telf).indexOf(currentTlf);
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
        this.filtreByName();
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
  private filtreByName(): void {
    this.deleteSons$.next(false);
    this.carsList = [];
    for (let i = 0; i < this.carsListBackUp.length; i++){
      if (this.carsListBackUp[i].name.substring(0, this.filterKeyword.length).toLowerCase() == this.filterKeyword.toLowerCase() ){
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
  orderByName() : void{
    if (this.orderingByName == true) {
      this.resetFilters();
    }
    else{
      this.enableFiltering();
      for (let i in this.carsList) {
        for (let j in this.carsList){
          if (this.carsList[i].name < this.carsList[j].name && i != j){
            let auxElem = this.carsList[i];
            this.carsList[i] = this.carsList[j];
            this.carsList[j] = auxElem;
          }
        }
      }
      this.createAllComponents()
      this.orderingByName = true;
    }
  }


  orderByTelf() : void{
    if (this.orderingByTelf == true) {
      this.resetFilters();
    }
    else{
      this.enableFiltering();
      for (let i in this.carsList) {
        for (let j in this.carsList){
          if (this.carsList[i].telf < this.carsList[j].telf && i != j){
            let auxElem = this.carsList[i];
            this.carsList[i] = this.carsList[j];
            this.carsList[j] = auxElem;
          }
        }
      }
      this.createAllComponents()
      this.orderingByTelf = true;
    }
  }

  orderByHabitual() : void{
    if (this.orderingByHabitual == true) {
      this.resetFilters();
    }
    else{
      this.enableFiltering();
      for (let i in this.carsList) {
        for (let j in this.carsList){
          if (this.carsList[i].habitual < this.carsList[j].habitual && i != j){
            let auxElem = this.carsList[i];
            this.carsList[i] = this.carsList[j];
            this.carsList[j] = auxElem;
          }
        }
      }
      this.createAllComponents()
      this.orderingByHabitual = true;
    }
  }

  orderByEmail() : void{
    if (this.orderingByEmail == true) {
      this.resetFilters();
    }
    else{
      this.enableFiltering();
      for (let i in this.carsList) {
        for (let j in this.carsList){
          if (this.carsList[i].email < this.carsList[j].email && i != j){
            let auxElem = this.carsList[i];
            this.carsList[i] = this.carsList[j];
            this.carsList[j] = auxElem;
          }
        }
      }
      this.createAllComponents()
      this.orderingByEmail = true;
    }
  }

  orderByType() : void{
    if (this.orderingByType == true) {
      this.resetFilters();
    }
    else{
      this.enableFiltering();
      for (let i in this.carsList) {
        for (let j in this.carsList){
          if (this.carsList[i].type < this.carsList[j].type && i != j){
            let auxElem = this.carsList[i];
            this.carsList[i] = this.carsList[j];
            this.carsList[j] = auxElem;
          }
        }
      }
      this.createAllComponents()
      this.orderingByType = true;
    }
  }

}



@Component({
  selector: 'carComponent',
  template: '<div class="blackCenteredDiv d-flex justify-content-center">\
              <p class="carComponentText d-flex align-items-center justify-content-center" name="name">{{name}}</p>\
              <p class="carComponentText d-flex align-items-center justify-content-center" telf="telf">{{telf}}</p>\
              <p class="carComponentText d-flex align-items-center justify-content-center" email="email">{{email}}</p>\
              <p class="carComponentText d-flex align-items-center justify-content-center" type="type">{{type}}</p>\
              <p class="carComponentText d-flex align-items-center justify-content-center" habitual="habitual">{{habitual}}</p>\
              <div class="carComponentText col align-items-center justify-content-center">\
                <button class="standardBtn" (click)="edit()">Editar</button>\
                <button class="standardBtn" (click)="deleteCar()">Eliminar</button>\
              </div>\
            </div>',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: 'price', useValue: 'container'},
  ]
})

export class carComponent {  
  name : string = "undefined";
  telf : string = "undefined";
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
      this.returnDeletedCarInfo$.next(this.telf)
      this.hostComponent.nativeElement.remove();
  }

  edit(): void{
    this.returnDeletedCarInfo$.next(this.telf)
    this.hostComponent.nativeElement.remove();
}
}





