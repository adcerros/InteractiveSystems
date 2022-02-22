import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, billMaker, dishComponent, addEuro, pricesMainFormat} from './app.component';
import { MyComponentLoaderDirective } from '../app/myComponentCreator'
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    billMaker,
    dishComponent,
    MyComponentLoaderDirective, 
    addEuro,
    pricesMainFormat
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
