import { Component, ViewChild, ElementRef, Pipe, PipeTransform, OnInit, AfterViewInit} from '@angular/core';
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
    <p class="mainTitle">Concesionario de coches</p>\
    <div class="fullWidthDiv">\
      <p class="secondaryTitle">Filtrar por:</p>\
      <select [(ngModel)]="currentSelectionData">\
        <option  *ngFor="let currentSelectionData of filtersList; let i=index;">{{currentSelectionData}}</option>\
      </select>\
    </div>\
    <div class="dataTitlesTableFormat">\
      <p class="carsTableTitles">Foto</p><p class="carsTableTitles">Marca</p><p class="carsTableTitles">Modelo</p>\
      <p class="carsTableTitles">Año</p><p class="carsTableTitles">En venta desde</p><p class="carsTableTitles">Precio</p>\
      <p class="carsTableTitles">PVP</p><p class="carsTableTitles">Acciones</p>\
    </div>\
    <ng-template carDinamicComponentHost></ng-template>',
  styleUrls: ['./app.component.scss']
})

export class billMaker implements AfterViewInit {  
  imagesList : Array<string>;
  filtersList : Array<string>;
  brandsList : Array<string>;
  modelsList : Array<string>;
  yearsList : Array<number>;
  pricesList : Array<number>;
  currentSelectionData : string;
  @ViewChild(MyComponentLoaderDirective) dynamicHost !: MyComponentLoaderDirective;
  constructor(){
    this.imagesList = ["assets/images/320.jpeg", "assets/images/claseA.jpeg", "assets/images/taycan.jpeg", "assets/images/multipla.jpeg", "assets/images/saxo.jpeg", "assets/images/mustang.jpeg"]
    this.filtersList = ["Modelo", "Marca", "Año"];
    this.brandsList = ["BMW", "Mercedes", "Porsche", "Fiat", "Citroen", "Ford"];
    this.modelsList = ["320", "Clase A" , "Taycan", "Multipla", "Saxo", "Mustang"];
    this.yearsList = [2015, 2018, 2021, 2008, 2006, 2016]
    this.pricesList = [11000, 14000, 64000, 2000, 1800, 13400];
    this.currentSelectionData = "Selecciona un plato a añadir";
  }

  ngAfterViewInit(): void {
    for (let i in this.imagesList){
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
    newComponent.instance.image = this.imagesList[index];
    newComponent.instance.brand = this.brandsList[index];
    newComponent.instance.model = this.modelsList[index];
    newComponent.instance.year = this.yearsList[index];
    newComponent.instance.price = this.pricesList[index];
    newComponent.instance.pvp = this.pricesList[index] * 1.1; 
  }
}



@Component({
  selector: 'carComponent',
  template: '<div class="blackCenteredDiv">\
              <div><img [src]=image><img></div>\
              <p class="carComponentText" brand="brand">{{brand}}</p>\
              <p class="carComponentText" model="model">{{model}}</p>\
              <p class="carComponentText" brand="brand">{{brand}}</p>\
              <p class="carComponentText" year="year">{{year}}</p>\
              <p class="carComponentText" onSaleSince="onSaleSince">{{onSaleSince}}</p>\
              <p class="carComponentText" price="price">{{price | addEuro }}</p>\
              <p class="carComponentText" pvp="pvp">{{pvp | addEuro }}</p>\
              <div>\
                <button class="standardBtn" (click)="deleteCar()">Rebajar</button>\
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
  pvp : number;
  constructor(private hostComponent: ElementRef<HTMLElement>){
    this.image = "Imagen no disponible"
    this.brand = "undefined"
    this.model = "undefined"
    this.year = 0;
    this.onSaleSince = new Date()
    this.price = 999999
    this.pvp = (this.price * 1.1)
  }

  // Al pulsar en el boton se elimina el componente
  // Se envia el evento al componente padre para actualizar la cuenta antes de su eliminacion
  deleteCar(): void{
      this.hostComponent.nativeElement.remove();
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
