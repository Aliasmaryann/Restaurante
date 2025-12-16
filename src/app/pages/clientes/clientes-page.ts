import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

import { TabsModule } from 'primeng/tabs';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Card } from "primeng/card";
import { TagModule } from 'primeng/tag';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, TagModule, TabsModule, DataViewModule, ButtonModule, DialogModule, Card],
  templateUrl: './clientes-page.html',
  styleUrls: ['./clientes-page.css']
})
export class ClientesPage {
  // Aquí irá la lógica de clientes
  numeroMesa = 5; // ejemplo, puedes setearlo dinámicamente

  carrito: { receta_id: number; name: string; cantidad: number; price: number }[] = [];


  sortField = 'price';
  sortOrder = 1;
  sortOptions = [{label: 'Precio', value: 'price'}];

  mostrarCarrito = false;
  showCantidadDialog = false;
  productoSeleccionado: any = null;
  cantidadSeleccionada = 1;

 constructor(private http: HttpClient, private cdr: ChangeDetectorRef, public auth: Auth) {}

  entradas: any[] = [];
  platos: any[] = [];
  postres: any[] = [];
  bebestibles: any[] = [];
  raciones: any[] = [];
  sopas: any[] = [];

  ngOnInit() {
      this.http.get<any[]>('http://localhost:3000/recetas').subscribe({
        next: (data) => {
          const all = data.map(r => ({
            id: r.id,
            name: r.nombre,
            category: r.categoria,
            price: r.precio,
            descripcion: r.descripcion
          }));

          // Clasificación por categoría
          const baseCategory = (c: string) => (c || '').split(' - ')[0].trim().toLowerCase();

          this.entradas    = all.filter(r => baseCategory(r.category) === 'entradas');
          this.platos      = all.filter(r => baseCategory(r.category) === 'platos');
          this.postres = all.filter(r => r.category?.toLowerCase().includes('postres'));
          this.bebestibles = all.filter(r => baseCategory(r.category) === 'bebestibles');
          this.raciones    = all.filter(r => baseCategory(r.category) === 'raciones');
          this.sopas   = all.filter(r => r.category?.toLowerCase().includes('sopas'));
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error cargando recetas:', err)
      });
    }
    cerrarSesion() {
    this.auth.logout();
  }


    abrirCantidad(item: any) {
      this.productoSeleccionado = item;
      this.cantidadSeleccionada = 1;
      this.showCantidadDialog = true;
    }

    enviarPedido() {
      const pedido = {
        mesa: this.numeroMesa,
        items: this.carrito.map(item => ({
          receta_id: item.receta_id,
          cantidad: item.cantidad
        }))
      };

      this.http.post('http://localhost:3000/pedidos', pedido).subscribe({
        next: () => {
          this.carrito = [];
          this.mostrarCarrito = false;
        },
        error: err => console.error('Error al enviar pedido:', err)
      });
    }
    
    get totalNeto(): number {
      return this.carrito.reduce((acc, item) => acc + item.price * item.cantidad, 0);
    }

    get iva(): number {
      return this.totalNeto * 0.19; // 19% IVA
    }

    get totalConIva(): number {
      return this.totalNeto + this.iva;
    }
    
  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
  }

    confirmarPedido() {
      const existente = this.carrito.find(item => item.receta_id === this.productoSeleccionado.id);

      if (existente) {
        existente.cantidad += this.cantidadSeleccionada;
      } else {
        this.carrito.push({
          receta_id: this.productoSeleccionado.id,
          name: this.productoSeleccionado.name,
          cantidad: this.cantidadSeleccionada,
          price: this.productoSeleccionado.price
        });
      }

      this.showCantidadDialog = false;
    }


}
