// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';


// @Injectable({
//   providedIn: 'root',
// })
// export class Auth {
//   private apiUrl = 'http://localhost:3000'; // tu backend Node.js
//   // private apiUrl = 'https://nonlitigious-unmournful-kelvin.ngrok-free.dev/'; // tu backend Node.js

//   constructor(private http: HttpClient) {}

//   // Método de login
//   login(username: string, password: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, { username, password });
//   }

//   // Método para obtener menú según rol
//   getMenuByRole(role: string): string[] {
//     if (role === 'admin') {
//       return ['Dashboard', 'Usuarios', 'Inventario', 'Reportes'];
//     } else if (role === 'trabajador') {
//       return ['Comandas', 'Inventario'];
//     } else if (role === 'cliente') {
//       return ['Menú', 'Promociones'];
//     }
//     return [];
//   }
//   canActivate(): boolean {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       this.router.navigate(['/login']);
//       return false;
//     }
//     return true;
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000'; // tu backend Node.js

  constructor(private http: HttpClient, private router: Router) {}

  // Método de login
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  // Método de logout
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']); // usa Router para redirigir
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

  // Guard para proteger rutas
  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

