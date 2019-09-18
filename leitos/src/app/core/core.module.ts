import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LeitoService} from "./leito/leito.service";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    LeitoService
  ]
})
export class CoreModule { }
