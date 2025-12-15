import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

// PrimeNG
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
// Si usas íconos de PrimeNG
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PanelModule,
    TableModule,
    CommonModule,
    RippleModule,
    ChartModule,
    TagModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    HttpClientModule,
  ], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  ingresos = 0;
  egresos = 0;
  balance = 0;

  movimientos: any[] = [];

  finanzasBarData: any;
  finanzasPieData: any;

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };
  barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(this.ingresos, this.egresos) * 1.2,
        ticks: {
          stepSize: 10000
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

private api = 'http://localhost:3000';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    
    this.cargarTotales();
    this.cargarMovimientos();
    this.cargarGraficoBar();
    this.cargarGraficoPie();
    
  }

  cargarTotales() {
    this.http.get<any>(`${this.api}/finanzas/totales`)
      .subscribe(data => {
        this.ingresos = data.ingresos;
        this.egresos = data.egresos;
        this.balance = data.balance;
      });
  }
cargarMovimientos() {
    this.http.get<any[]>(`${this.api}/finanzas`)
      .subscribe(data => {
        this.movimientos = data;
        
      });
  }

  cargarGraficoBar() {
  this.http.get<any[]>(`${this.api}/finanzas/resumen`)
    .subscribe(data => {
      this.finanzasBarData = {
        labels: data.map(d => d.tipo),
        datasets: [
          {
            label: 'Monto',
            data: data.map(d => Number(d.total))
          }
        ]
      };
      this.cdr.detectChanges();
    });
}

cargarGraficoPie() {
    this.http.get<any[]>(`${this.api}/finanzas/categorias`)
      .subscribe(data => {
        this.finanzasPieData = {
          labels: data.map(d => d.categoria),
          datasets: [
            {
              data: data.map(d => d.total)
            }
          ]
        };
        this.cdr.detectChanges();
      });
  }

}
