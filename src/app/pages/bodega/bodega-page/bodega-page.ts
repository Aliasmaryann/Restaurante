import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
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
import { FloatLabelModule } from "primeng/floatlabel";
import { DrawerModule } from 'primeng/drawer';
import { SelectModule } from "primeng/select";
import { DatePickerModule } from "primeng/datepicker";
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';



@Component({
  selector: 'app-bodega-page',
  standalone: true,
  imports: [
    PanelModule,
    HttpClientModule,
    RouterModule,
    CardModule,
    TabsModule,
    DrawerModule,
    TableModule,
    RippleModule,
    ButtonModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    CommonModule,
    DialogModule,
    FormsModule,
    FloatLabelModule,
    SelectModule,
    DatePickerModule,
    TagModule
],
  templateUrl: './bodega-page.html',
  styleUrl: './bodega-page.css',
})
export class BodegaPage implements OnInit {
  rows: any[] = [];
  showDialog: boolean = false;
  showDialogNuevo: boolean = false;
  showDialogEditar: boolean = false

  productos: {
    id: number;
    nombre: string;
    categoria: string;
    precio: number;
    stock: number;
  }[] = [];
  
  proveedores: {
    id: number;
    nombre: string;
    contacto: string;
    telefono: string;
    email: string;
    direccion: string;
    categoria: string;
  }[] = [];

  mesas: { numero: number; estado: string; severity: 'success' | 'info' | 'warn' | 'danger' }[] = [
  { numero: 1, estado: 'Libre', severity: 'success' },
  { numero: 2, estado: 'Ocupada', severity: 'danger' },
  { numero: 3, estado: 'Reservada', severity: 'warn' },
  { numero: 4, estado: 'Libre', severity: 'success' },
  { numero: 5, estado: 'Ocupada', severity: 'danger' }
];

  selectedRows: any[] = [];

  nuevaEntrada: any = {
    fecha: null,
    producto_id: 0,
    categoria: '',
    cantidad: 0,
    proveedor_id: 0
  };
  
  recetas: any[] = [];
  recetaSeleccionadaId: number = 0;
  detalleSeleccionado: any = null;

  mostrarDrawer: boolean = false;
  totales = { total: 0, en_stock: 0, bajo_stock: 0 };
  editando = false;


  get recetaSeleccionada() {
    return this.recetas.find(r => r.id === this.recetaSeleccionadaId);
  }

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}


  
  ngOnInit() {
    this.loadEntradas();
    this.loadCatalogos();
    this.loadTotales();
    this.loadMesas();
  }
  
  loadTotales() {
    this.http.get<any>('http://localhost:3000/bodega/totales').subscribe(data => {
      this.totales = data;
      this.cdr.detectChanges();
    });
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
    this.cdr.detectChanges();
  });

  this.http.get<any[]>('http://localhost:3000/proveedores').subscribe(pr => {
    this.proveedores = pr;
    this.cdr.detectChanges();
  });
}



  abrirDialogo() {
    this.nuevaEntrada = {
      fecha: new Date(),
      producto_id: 0, 
      categoria: '', 
      cantidad: 0, 
      proveedor_id: 0
    };
    this.showDialogNuevo = true;
  }

  loadMesas() {
    this.http.get<any[]>('http://localhost:3000/mesas').subscribe(m => {
    this.mesas = m;
    this.cdr.detectChanges();
    });
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
abrirDrawer(recetaId: number) {
  this.http.get<any[]>(`http://localhost:3000/recetas/${recetaId}/detalle`).subscribe({
    next: (data) => {
      this.detalleSeleccionado = data[0] ?? null;
      this.mostrarDrawer = true;
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Error cargando detalle:', err)
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
      this.detalleSeleccionado = data[0]; // ← solo mostramos una receta
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Error cargando detalle:', err)
  });
}

}
