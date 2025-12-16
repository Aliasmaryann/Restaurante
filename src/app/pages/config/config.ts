import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';


@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CardModule,
    IconFieldModule,
    InputIconModule,
    DialogModule,
    InputTextModule,
    TagModule,
  ],
  templateUrl: './config.html',
  styleUrl: './config.css'
})
export class Config implements OnInit {

  usuarios: any[] = [];
  selectedUsers: any[] = [];

  mostrarDialog = false;
  editando = false;

  usuario: any = {
    id: null,
    nombre: '',
    email: '',
    rol: '',
    activo: true,
    ultimo_login: null
  };

  stats = {
    activos: 0,
    admins: 0,
    bloqueados: 0,
    ultimoAcceso: ''
  };

  ngOnInit() {
    this.cargarUsuarios();
    this.calcularStats();
  }

  cargarUsuarios() {
    this.usuarios = [
      {
        id: 1,
        nombre: 'admin',
        email: 'supera@sigloxxi.cl',
        rol: 'Administrador',
        activo: true,
        ultimo_login: new Date()
      },
      {
        id: 2,
        nombre: 'user2',
        email: 'pedro@sigloxxi.cl',
        rol: 'Cliente',
        activo: true,
        ultimo_login: new Date()
      },
      {
        id: 2,
        nombre: 'user3',
        email: 'maria@sigloxxi.cl',
        rol: 'Cocina',
        activo: true,
        ultimo_login: new Date()
      }

    ];
  }

  calcularStats() {
    this.stats.activos = this.usuarios.filter(u => u.activo).length;
    this.stats.bloqueados = this.usuarios.filter(u => !u.activo).length;
    this.stats.admins = this.usuarios.filter(u => u.rol === 'Administrador').length;
    this.stats.ultimoAcceso =
      this.usuarios[0]?.ultimo_login?.toLocaleString() ?? '-';
  }

  nuevoUsuario() {
    this.editando = false;
    this.usuario = {
      nombre: '',
      email: '',
      rol: '',
      activo: true
    };
    this.mostrarDialog = true;
  }

  editarUsuario(user: any) {
    this.editando = true;
    this.usuario = { ...user };
    this.mostrarDialog = true;
  }

  guardar() {
    if (this.editando) {
      const i = this.usuarios.findIndex(u => u.id === this.usuario.id);
      this.usuarios[i] = this.usuario;
    } else {
      this.usuario.id = Date.now();
      this.usuario.ultimo_login = new Date();
      this.usuarios.push(this.usuario);
    }

    this.mostrarDialog = false;
    this.calcularStats();
  }

  eliminarSeleccionados() {
    this.usuarios = this.usuarios.filter(u => !this.selectedUsers.includes(u));
    this.selectedUsers = [];
    this.calcularStats();
  }
}
