import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MyComponentLoaderDirective } from '../app/myComponentCreator'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';





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
    <add-form *ngIf="showAddFormBol" (showFormOutput)="hideAddForm($event)" (formNewDataOutput)="addData($event)"></add-form>\
    <div class="dataTitlesTableFormat d-flex align-items-center justify-content-around mt-5 mb-5">\
      <p class="bigTitle">Agenda telefonica</p>\
      <p class="secondaryTitle" numberOfContacts="numberOfContacts">Numero de contactos: {{numberOfContacts}}</p>\
      <button class="resetFilterInput" (click)="showAddForm()" >Añadir</button>\
    </div>\
    <div class="fullWidthDiv mt-5">\
      <input class="filterInput" placeholder="Buscar nombres que empiecen por:" (input)="filtreElements()" [(ngModel)]="filterKeyword">\
      <button class="resetFilterInput" (click)="resetFilterInput()">Borrar</button>\
      <p class="secondaryTitle">Tipo</p>\
      <select class="filterInput" (change)="filtreByType()" [(ngModel)]="currentSelectionData">\
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
  filtersList: Array<string> = ["", "Trabajo", "Personal"];
  orderingByName : boolean = false;
  orderingByTelf : boolean = false;
  orderingByEmail : boolean = false;
  orderingByHabitual : boolean = false;
  orderingByType : boolean = false;
  filterKeyword : string = "";
  showAddFormBol : boolean = false; 
  showEditForm : boolean = false;
  // Creación del observable para que los hijos sepan cuando destruirse
  deleteSons$: Subject<any> = new Subject();
  deleteSons$Obs: Observable<any> = this.deleteSons$.asObservable();
  // Listado de vehiculos
  carsList = [{name: "Joaquin", telf: "655431212", email: "juaquinrod@gmail.com", type: "Trabajo", habitual: "Si", bornDate : new Date("03-09-1993"), enterprise : "Aldo shoes", adress : "Bualavi 32", role : "manager", specialization : "calentar la silla", id : Guid.newGuid()},
              {name: "Marta", telf: "655897252", email: "martaplaza@gmail.com", type: "Personal", habitual: "No", bornDate : new Date("03-09-1993"), enterprise : "Aldo shoes", adress : "Bualavi 32", role : "manager", specialization : "calentar la silla", id : Guid.newGuid()},
              {name: "Arturo", telf: "623928976", email: "arturoperez@gmail.com", type: "Trabajo", habitual: "Si", bornDate : new Date("03-09-1993"), enterprise : "Aldo shoes", adress : "Bualavi 32", role : "manager", specialization : "calentar la silla", id : Guid.newGuid()},
              {name: "Marcos", telf: "655498512", email: "marcosramirez@gmail.com", type: "Trabajo", habitual: "Si", bornDate : new Date("03-09-1993"), enterprise : "Aldo shoes", adress : "Bualavi 32", role : "manager", specialization : "calentar la silla", id : Guid.newGuid()},
              {name: "Andrea", telf: "627461212", email: "andop@gmail.com", type: "Trabajo", habitual: "Si", bornDate : new Date("03-09-1993"), enterprise : "Aldo shoes", adress : "Bualavi 32", role : "manager", specialization : "calentar la silla", id : Guid.newGuid()},
              {name: "Melisa", telf: "65595262", email: "malizita@gmail.com", type: "Personal", habitual: "No", bornDate : new Date("03-09-1993"), enterprise : "Aldo shoes", adress : "Bualavi 32", role : "manager", specialization : "calentar la silla", id : Guid.newGuid()},
              {name: "Pablo", telf: "635271212", email: "pablo827@gmail.com", type: "Personal", habitual: "Si", bornDate : new Date("03-09-1993"), enterprise : "Aldo shoes", adress : "Bualavi 32", role : "manager", specialization : "calentar la silla", id : Guid.newGuid()}];
  carsListBackUp = [...this.carsList];
  numberOfContacts : number = this.carsListBackUp.length;
  
  // Al iniciarse crea a todos sus hijos
  ngAfterViewInit(): void {
    this.createAllComponents();
  }

  private createAllComponents() {
    for (let i in this.carsList) {
      this.createNewCarComponent(Number(i));
    }
  }

  addData(newData : any){
    this.carsListBackUp.push({name: newData.name, telf: newData.telf, email: newData.email, type: newData.type, habitual: newData.habitual, bornDate : newData.bornDate, enterprise : newData.enterprise, adress : newData.adress, role : newData.role, specialization : newData.specialization, id : Guid.newGuid()});
    this.carsList = [...this.carsListBackUp];
    this.numberOfContacts = this.carsListBackUp.length;
    this.deleteSons$.next(false);
    this.createAllComponents();
    this.showAddFormBol = false;
  }

  showAddForm (){
    this.showAddFormBol = true;
  }
  hideAddForm(value : any){
    this.showAddFormBol = false;
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
      this.numberOfContacts = this.carsListBackUp.length;
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
        this.filtreByName();
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

  filtreByType(): void {
    if (this.currentSelectionData != undefined && this.currentSelectionData != null && this.currentSelectionData != ""){
      this.deleteSons$.next(false);
      this.carsList = [];
      for (let i = 0; i < this.carsListBackUp.length; i++){
        if (this.carsListBackUp[i].type == this.currentSelectionData ){
          this.carsList.push(this.carsListBackUp[i]);
        }
      }
      this.createAllComponents();
    }
    else{
      this.carsList = [...this.carsListBackUp];
      this.deleteSons$.next(false);
      this.createAllComponents();
    }
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
              <div class="carComponentText d-flex align-items-center justify-content-center">\
                <button class="standardBtn" (click)="edit()">Editar</button>\
                <button class="standardBtn" (click)="deleteCar()">Eliminar</button>\
              </div>\
            </div>',
  styleUrls: ['./app.component.scss']
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



@Component({
  selector: 'add-form',
  template: ' <div class="backgound-transparency"></div>\
              <form class="add-form-div d-flex" [formGroup]="addFormGroup"> \
                <div class="col">\
                  <div class="d-flex justify-content-center mb-3 mt-5">\
                    <label for="name">Nombre</label><input class="input" id="name" type="text" formControlName="name">\
                  </div>\
                  <div class="d-flex justify-content-center mb-3">\
                    <label for="surname">Apellidos</label><input class="input" id="surname" type="text" formControlName="surname">\
                  </div>\
                  <div class="d-flex justify-content-center mb-3">\
                    <label for="telf">Telefono</label><input class="input" id="telf" type="text" formControlName="telf">\
                  </div>\
                  <div class="d-flex justify-content-center mb-3">\
                    <label for="enail">Email</label><input class="input" id="enail" type="text" formControlName="email">\
                  </div>\
                  <div class="d-flex justify-content-center mb-3">\
                    <label for="bornDate">Fecha de nacimiento</label><input class="input" id="bornDate" type="text" formControlName="bornDate">\
                  </div>\
                  <div class="d-flex justify-content-center mb-3">\
                    <label for="adress">Direccion</label><input class="input" id="adress" type="text" formControlName="adress">\
                  </div>\
                  <div class="d-flex justify-content-center mb-3">\
                    <label for="enterprise">Empresa</label><input class="input" id="enterprise" type="text" formControlName="enterprise">\
                  </div>\
                  <div class="d-flex justify-content-center mb-3">\
                    <label for="role">Cargo</label><input class="input" id="role" type="text" formControlName="role">\
                  </div>\
                  <div class="d-flex justify-content-center mb-3">\
                    <label for="type">Tipo</label><input class="input" id="type" type="text" formControlName="type">\
                  </div>\
                  <div class="d-flex justify-content-center mb-3">\
                    <label for="habitual">Habitual</label><input class="input" id="habitual" type="text" formControlName="habitual">\
                  </div>\
                  <div class="d-flex justify-content-center mb-3">\
                    <label for="specialization">Especializacion</label><input class="input" id="specialization" type="text" formControlName="specialization">\
                  </div>\
                  <div class="d-flex justify-content-center mb-3">\
                    <button class="resetFilterInput" type="reset" (click)="onReset()">Cerrar</button>\
                    <button class="resetFilterInput" (click)="onSubmit()">Guardar</button>\
                  </div>\
                </div>\
              </form> \
              ',
  styleUrls: ['./app.component.scss']
})

// <div>\
// <label for="name">tipo</label><input id="name" type="text" formControlName="name">\
// </div>\
// <div>\
// <label for="name">habitual</label><input id="name" type="text" formControlName="name">\
// </div>\

export class AddForm {
  submitted : boolean = false;
  addFormGroup : FormGroup ;

  @Output() showFormOutput: EventEmitter<any> = new EventEmitter();
  @Output() formNewDataOutput: EventEmitter<any> = new EventEmitter();
  constructor(private formBuilder : FormBuilder) {
    this.addFormGroup = this.formBuilder.group({
      name : ["", Validators.required],
      surname : ["", Validators.required],
      telf : ["", Validators.required],
      email : ["", Validators.required],
      type : ["", Validators.required],
      habitual : ["", Validators.required],
      bornDate : ["", Validators.required],
      enterprise  : ["", Validators.required],
      adress  : ["", Validators.required],
      role  : ["", Validators.required],
      specialization  : ["", Validators.required]
    });
  }

  onSubmit(){
    this.submitted = true;
    this.formNewDataOutput.emit(this.addFormGroup.value);
    this.addFormGroup.reset();
  }

  onReset(){
    this.submitted = false;
    this.showFormOutput.emit(this.submitted);
    this.addFormGroup.reset();
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
