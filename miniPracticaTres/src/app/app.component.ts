import { Component, ViewChild, ElementRef, Pipe, PipeTransform, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import { Observable, Subject} from 'rxjs';
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
  selector: 'elementsContainer',
  template: '\
    <p class="mainTitle">Micro-practica tres</p>\
    <div class="fullWidthDiv mt-5">\
      <communitySelector (currentCommunityOutput)="currentCommunityInput($event)"></communitySelector>\
      <provinceSelector [selectedCommunityIndex]="currentCommunityIndex" (currentProvinceOutput)="currentProvinceInput($event)"></provinceSelector>\
    </div>\
    <div class="fullWidthDiv mt-5">\
      <p class="secondaryTitle d-flex justify-content-around" currentCommunityName="currentCommunityName"  *ngIf="showInformationP">Comunidad Autonoma: {{currentCommunityName}}</p>\
      <p class="secondaryTitle d-flex justify-content-around" currentCommunityId="currentCommunityId"  *ngIf="showInformationP">Id de comunidad: {{currentCommunityId}}</p>\
      <p class="specialSecondaryTitle d-flex justify-content-around" provinceName="provinceName" *ngIf="showInformationP">La provincia es: {{provinceName}}</p>\
      <p class="secondaryTitle d-flex justify-content-around" provinceId="provinceId"  *ngIf="showInformationP">Id de provincia: {{provinceId}}</p>\
      <p class="secondaryTitle d-flex justify-content-around" provinceCP="provinceCP" *ngIf="showInformationP">Codigo postal: {{provinceCP}}</p>\
      <p class="secondaryTitle d-flex justify-content-around" provinceMICode="provinceMICode"  *ngIf="showInformationP">Codigo Ministerio del Interior: {{provinceMICode}}</p>\
      <button class="resetFilterInput d-flex justify-content-around" (click)="showInformation()">Mostrar informacion</button>\
      </div>',
  styleUrls: ['./app.component.scss']
})

export class elementsContainer {  
  provinceId : string = "";
  provinceName : string = "Selecciona la comunidad y la provincia";
  provinceCP : string = "";
  provinceMICode : string = "";
  currentCommunityName : string = "";
  currentCommunityId : string = "";
  currentProvinceData : any;
  currentCommunityIndex : any;
  showInformationP : boolean = false;
  id : string = Guid.newGuid()

  currentCommunityInput(currentCommunityData : any){
    this.showInformationP = false
    this.provinceId  = "";
    this.provinceName = "Sin seleccionar";
    this.provinceCP  = "";
    this.provinceMICode = "";
    this.currentCommunityIndex = currentCommunityData[0];
    this.currentCommunityName = currentCommunityData[1]
    this.currentCommunityId = currentCommunityData[2]
  } 
  currentProvinceInput(currentProvinceData : string){
    this.showInformationP = false
    this.currentProvinceData = currentProvinceData;
    this.provinceName = this.currentProvinceData[0]
    this.provinceId = this.currentProvinceData[1]
    this.provinceCP = this.currentProvinceData[2]
    this.provinceMICode = this.currentProvinceData[3]
  } 
  showInformation() : void{
    this.showInformationP = true;
  }
}







@Component({
  selector: 'communitySelector',
  template: '\
      <p class="secondaryTitle">Filtrar por:</p>\
      <select class="filterInput" (change)="updateData()" [(ngModel)]="currentCommunity">\
        <option value="" selected disabled>Comunidad Autónoma</option>\
        <option  *ngFor="let currentSelectionData of communitiesList">{{currentSelectionData}}</option>\
      </select>',
  styleUrls: ['./app.component.scss']
})

export class communitySelector {  
  @Output() currentCommunityOutput: EventEmitter<any> = new EventEmitter();
  currentCommunity : string = "";
  communitiesIdList : any = [];
  id : string = Guid.newGuid()
  communitiesList: string[] = ["Andalucía", "Aragón", "Islas Baleares", "Canarias", "Cantabria", "Castilla-La Mancha", "Castilla y León", 
                               "Cataluña", "Comunidad de Madrid", "Comunidad Foral de Navarra", "Comunidad Valenciana", "Extremadura", 
                               "Galicia", "País Vasco", "Principado de Asturias", "Región de Murcia", "La Rioja"];
  
  constructor() {
    for (let i = 0; i < this.communitiesList.length; i++) {
        this.communitiesIdList[i] = Guid.newGuid();
    }
  }
  updateData() : void {
    let currentCommunityIndex = this.communitiesList.indexOf(this.currentCommunity)
    let currentCommunityName = this.communitiesList[currentCommunityIndex]
    let currentCommunityId = this.communitiesIdList[currentCommunityIndex]
    let data = [currentCommunityIndex, currentCommunityName, currentCommunityId]
    this.currentCommunityOutput.emit(data)
  }
}







@Component({
  selector: 'provinceSelector',
  template: '\
      <select class="filterInput" (change)="updateData()" [(ngModel)]="currentProvince">\
        <option value="" selected disabled>Provincia</option>\
        <option  selectedCommunityIndex="selectedCommunityIndex" *ngFor="let currentSelectionData of provincesList[selectedCommunityIndex]">{{currentSelectionData}}</option>\
      </select>',
  styleUrls: ['./app.component.scss']
})

export class provinceSelector {  
  @Output() currentProvinceOutput: EventEmitter<any> = new EventEmitter();
  currentProvince : string = ""
  id : string = Guid.newGuid()
  provincesIdList: any = [];
  provincesList: string[][] = [["Almería", "Cádiz", "Córdoba", "Granada", "Huelva", "Jaén", "Málaga", "Sevilla"],
                                        ["Huesca", "Teruel", "Zaragoza"], ["Palma de Mallorca"], 
                                        ["Santa Cruz de Tenerife", "Las Palmas de Gran Canaria"], 
                                        ["Santander"], ["Albacete", "Ciudad Real", "Cuenca", "Guadalajara", "Toledo"],
                                        ["Ávila", "Burgos", "León", "Salamanca", "Segovia", "Soria", "Valladolid", "Zamora"],
                                        ["Barcelona", "Gerona", "Lérida", "Tarragona"], ["Madrid"], ["Pamplona"],
                                        ["Alicante", "Castellón de la Plana", "Valencia"], ["Badajoz", "Cáceres"], 
                                        ["La Coruña", "Lugo", "Orense", "Pontevedra"], ["Bilbao", "San Sebastián", "Vitoria"],
                                        ["Oviedo"], ["Murcia"], ["Logroño"]];
  provincesCPList: string[][] = [["04", "11", "14", "18", "21", "23", "29", "41"],
                                        ["22", "44", "50"],
                                        ["07"], 
                                        ["38", "35"], 
                                        ["39"], 
                                        ["02", "13", "16", "19", "45"],
                                        ["05", "09", "24", "37", "40", "42", "47", "49"],
                                        ["08", "17", "25", "43"],
                                        ["28"],
                                        ["31"],
                                        ["03", "12", "46"],
                                        ["06", "10"], 
                                        ["15", "27", "32", "36"], 
                                        ["48", "20", "01"],
                                        ["33"],
                                        ["30"], 
                                        ["26"]];
  provincesMICodeList: string[][] = [["AL", "CA", "COR", "GR", "H", "J", "MA", "SE"],
                                        ["HU", "TE", "Z"],
                                        ["PM"], 
                                        ["TF", "GC"], 
                                        ["S"], 
                                        ["AL", "CR", "CU", "GU", "TO"],
                                        ["AV", "BU", "LE", "SA", "SG", "SO", "VA", "ZA"],
                                        ["B", "GE", "L", "T"],
                                        ["M"],
                                        ["NA"],
                                        ["A", "CS", "V"],
                                        ["BA", "CC"], 
                                        ["C", "LU", "OR", "PO"], 
                                        ["BI", "SS", "VI"],
                                        ["O"],
                                        ["MU"], 
                                        ["LO"]];
  @Input() selectedCommunityIndex : any;
  constructor() {
    for (let i = 0; i < this.provincesList.length; i++) {
      this.provincesIdList[i] = []
      for (let j = 0; j < this.provincesList.length; j++) 
        this.provincesIdList[i][j] = Guid.newGuid();
    }
  }

  updateData() : void {
    let currentProvinceIndex = this.provincesList[this.selectedCommunityIndex].indexOf(this.currentProvince)
    let currentProvinceId = this.provincesIdList[this.selectedCommunityIndex][currentProvinceIndex]
    let currentProvinceCP = this.provincesCPList[this.selectedCommunityIndex][currentProvinceIndex]
    let currentProvinceMICode = this.provincesMICodeList[this.selectedCommunityIndex][currentProvinceIndex]
    let data = [this.currentProvince, currentProvinceId, currentProvinceCP, currentProvinceMICode]
    this.currentProvinceOutput.emit(data)
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
