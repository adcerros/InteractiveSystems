import { Directive, ViewContainerRef } from '@angular/core';
 
@Directive({
  selector: '[dishDinamicComponentHost]'
})
export class MyComponentLoaderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
   }
}