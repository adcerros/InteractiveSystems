import { Directive, ViewContainerRef } from '@angular/core';
 
@Directive({
  selector: '[carDinamicComponentHost]'
})
export class MyComponentLoaderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
   }
}