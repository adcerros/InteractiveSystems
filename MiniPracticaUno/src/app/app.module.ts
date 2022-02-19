import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, mainDiv, billMaker, dishComponent } from './app.component';
import {MyComponentLoaderDirective} from '../app/myComponentCreator'

@NgModule({
  declarations: [
    AppComponent,
    mainDiv,
    billMaker,
    dishComponent,
    MyComponentLoaderDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
