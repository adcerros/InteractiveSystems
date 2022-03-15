import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, elementsContainer, communitySelector, provinceSelector} from './app.component';
import { MyComponentLoaderDirective } from '../app/myComponentCreator'
import { FormsModule } from '@angular/forms';
import { DatePipe,CommonModule } from '@angular/common'


@NgModule({
  declarations: [
    AppComponent,
    elementsContainer,
    MyComponentLoaderDirective,
    communitySelector,
    provinceSelector
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