import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// PrimeNG
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FloatLabel } from "primeng/floatlabel";


@Component({
  selector: 'app-bodega-page',
  standalone: true,
  imports: [
    PanelModule,
    RouterModule,
    TableModule,
    RippleModule,
    ButtonModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    CommonModule,
    DialogModule,
    FormsModule,
    FloatLabel
],
  templateUrl: './bodega-page.html',
  styleUrl: './bodega-page.css',
})
export class BodegaPage implements OnInit {
  rows: any[] = [];
  showDialog: boolean = false;
  showDialogNuevo: boolean = false;
  showDialogEditar: boolean = false

  productos: { id: number; nombre: string }[] = [];
  proveedores: { id: number; nombre: string }[] = [];

  selectedRows: any[] = [];

  nuevaEntrada: any = {
    fecha: '',
    producto_id: 0,
    categoria: '',
    cantidad: 0,
    proveedor_id: 0
  };
  
  totales = { total: 0, en_stock: 0, bajo_stock: 0 };
  editando = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}


  loadTotales() {
    this.http.get<any>('http://localhost:3000/bodega/totales').subscribe(data => {
      this.totales = data;
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.loadEntradas();
    this.loadCatalogos();
    this.loadTotales();
  }

  loadEntradas() {
    this.http.get<any[]>('http://localhost:3000/bodega').subscribe(data => {
      this.rows = data;
      this.cdr.detectChanges();
    });
  }

  loadCatalogos() {
    this.http.get<any[]>('http://localhost:3000/productos').subscribe(p => {
    this.productos = p;
    this.cdr.detectChanges(); // ← fuerza actualización
  });

  this.http.get<any[]>('http://localhost:3000/proveedores').subscribe(pr => {
    this.proveedores = pr;
    this.cdr.detectChanges(); // ← fuerza actualización
  });
  }

  abrirDialogo() {
    this.nuevaEntrada = {
      fecha: new Date().toISOString().split('T')[0],
      producto_id: 0, categoria: '', cantidad: 0, proveedor_id: 0
    };
    this.showDialogNuevo = true;
  }
  abrirDialogoEditar() {
    if (this.selectedRows.length === 1) {
      this.nuevaEntrada = { ...this.selectedRows[0] };
      this.editando = true;
      this.loadCatalogos();
      this.showDialogEditar = true;
    }
  }

  guardarEntrada() {
    this.http.post('http://localhost:3000/bodega', this.nuevaEntrada).subscribe({
      next: () => {
        this.showDialogNuevo = false;
        this.loadEntradas();
        this.loadTotales();
        this.cdr.detectChanges(); // fuerza actualización segura
      },
      error: err => console.error('Error al agregar entrada:', err)
    });
  }

  editarEntrada() {
    this.http.put(`http://localhost:3000/bodega/${this.nuevaEntrada.id}`, this.nuevaEntrada).subscribe({
      next: () => {
        setTimeout(() => {
          this.showDialogEditar = false;
          this.editando = false;
          this.selectedRows = [];
          this.loadEntradas();
          this.loadTotales();
        });
      },
      error: err => console.error('Error al actualizar entrada:', err)
    });
  }

  eliminarSeleccionados() {
  if (this.selectedRows.length === 0) return;

  const ids = this.selectedRows.map(r => r.id);

  this.http.delete('http://localhost:3000/bodega', {
    body: { ids }
  }).subscribe({
    next: () => {
      this.selectedRows = [];
      this.loadEntradas(); // refresca la tabla
      this.loadTotales();
      this.cdr.detectChanges();
    },
    error: err => console.error('Error al eliminar:', err)
  });
}

}
