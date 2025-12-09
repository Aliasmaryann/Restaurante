import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000'; // tu backend Node.js
  // private apiUrl = 'https://nonlitigious-unmournful-kelvin.ngrok-free.dev/'; // tu backend Node.js

  constructor(private http: HttpClient) {}

  // Método de login
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  // Método para obtener menú según rol
  getMenuByRole(role: string): string[] {
    if (role === 'admin') {
      return ['Dashboard', 'Usuarios', 'Inventario', 'Reportes'];
    } else if (role === 'trabajador') {
      return ['Comandas', 'Inventario'];
    } else if (role === 'cliente') {
      return ['Menú', 'Promociones'];
    }
    return [];
  }
}
