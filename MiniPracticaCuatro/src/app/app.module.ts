import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, carListerMaker, carComponent, AddForm, EditForm} from './app.component';
import { MyComponentLoaderDirective } from '../app/myComponentCreator'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe,CommonModule } from '@angular/common'


@NgModule({
  declarations: [
    AppComponent,
    carListerMaker,
    carComponent,
    MyComponentLoaderDirective,
    AddForm,
    EditForm
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule 
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }


