import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, billMaker, carComponent, addEuro} from './app.component';
import { MyComponentLoaderDirective } from '../app/myComponentCreator'
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    billMaker,
    carComponent,
    MyComponentLoaderDirective, 
    addEuro
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

