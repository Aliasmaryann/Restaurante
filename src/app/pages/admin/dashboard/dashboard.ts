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
  selector: 'app-dashboard',
  standalone: true,
  imports: [PanelModule,
    TableModule,
    RippleModule,
    ButtonModule,
    InputTextModule
  ],
  
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
