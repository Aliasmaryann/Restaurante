import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BodegaPage } from './bodega-page';
import { BodegaPageRoutingModule } from './bodega-page-routing-module';


@NgModule({
  declarations: [
    BodegaPage
  ],
  imports: [
    CommonModule,
    BodegaPageRoutingModule
  ]
})
export class BodegaPageModule { }
