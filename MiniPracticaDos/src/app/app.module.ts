import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, carListerMaker, carComponent, addEuro, dateOnFormat, getPvp} from './app.component';
import { MyComponentLoaderDirective } from '../app/myComponentCreator'
import { FormsModule } from '@angular/forms';
import { DatePipe,CommonModule } from '@angular/common'


@NgModule({
  declarations: [
    AppComponent,
    carListerMaker,
    carComponent,
    MyComponentLoaderDirective, 
    addEuro,
    dateOnFormat,
    getPvp
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule 
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }


