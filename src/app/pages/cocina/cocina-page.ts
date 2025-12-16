import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { SelectModule } from 'primeng/select';
import { DrawerModule } from 'primeng/drawer';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cocina-page',
  standalone: true,
  imports: [CommonModule, DrawerModule, TabsModule, SelectModule, TableModule, ButtonModule, RouterModule, PanelModule, FormsModule, CardModule],
  templateUrl: './cocina-page.html',
  styleUrl: './cocina-page.css'
})
export class CocinaPage implements OnInit {
    metrics: any = { pendientes: 0, preparacion: 0, listos: 0, topRecetas: [] };
    pedidosActivos: any[] = [];
    recetas: any[] = [];
    recetaSeleccionadaId: number = 0;
    recetaSeleccionada: any = null;
    detalleSeleccionado: any = null;
    mostrarDrawer: boolean = false;

    pedidosListos: any[] = [];



  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadMetrics();
    this.loadPedidos();
    this.loadPedidosListos();

    setInterval(() => {
      this.loadMetrics();
      this.loadPedidos();
      this.loadPedidosListos();
    }, 5000);
  }

  loadMetrics() {
    this.http.get<any>('http://localhost:3000/cocina/metrics').subscribe(data => {
      this.metrics = data;
      this.cdr.detectChanges();
    });
  }

  loadPedidos() {
    this.http.get<any[]>('http://localhost:3000/cocina/pedidos').subscribe(data => {
      this.pedidosActivos = data;
      this.cdr.detectChanges();
    });
  }

  cambiarEstado(id: number, estado: string) {
    this.http.put(`http://localhost:3000/cocina/pedidos/${id}`, { estado }).subscribe(() => {
      this.loadMetrics();
      this.loadPedidos();
    });
  }
  loadRecetas() {
    this.http.get<any[]>('http://localhost:3000/recetas').subscribe(r => {
        this.recetas = r;
        this.cdr.detectChanges();
    });
    }

    cargarDetalleReceta(id: number) {
        this.http.get<any[]>(`http://localhost:3000/recetas/${id}/detalle`).subscribe({
        next: (data) => {
        this.detalleSeleccionado = data[0] ?? null;
        this.recetaSeleccionada = this.recetas.find(r => r.id === id);
        this.cdr.detectChanges();
        }
       });
    }
    loadPedidosListos() {
      this.http.get<any[]>('http://localhost:3000/cocina/pedidos-listos').subscribe(data => {
        this.pedidosListos = data;
        this.cdr.detectChanges();
      });
    }
}
