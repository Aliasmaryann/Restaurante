import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

// Si usas íconos de PrimeNG
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';



@Component({
  selector: 'app-bodega-page',
  standalone: true,
  imports: [
    PanelModule,
    TableModule,
    RippleModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './bodega-page.html',
  styleUrl: './bodega-page.css',
})
export class BodegaPage {

}
