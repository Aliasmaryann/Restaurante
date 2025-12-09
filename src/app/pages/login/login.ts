import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // ← importa Router

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { GalleriaModule } from 'primeng/galleria';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, AvatarModule, GalleriaModule, CheckboxModule, IconFieldModule, InputIconModule, FloatLabelModule, InputTextModule, PasswordModule, ButtonModule, CardModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPages {
  
  username = '';
  password = '';
  menu: string[] = [];

  images = [
    { itemImageSrc: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg' }
  ];
  
  checked: boolean = false;

  constructor(private authService: Auth, private router: Router) {}

  onLogin() {
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);

    this.authService.login(this.username, this.password).subscribe(res => {
      if (res.success) {
        const role = res.user.rol; // "admin", "trabajador", "cliente"
        this.menu = this.authService.getMenuByRole(role);
        console.log('Menú cargado:', this.menu);

        // Redirigir según rol
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'trabajador') {
          this.router.navigate(['/bodega-page']);
        } else if (role === 'cliente') {
          this.router.navigate(['/cliente']);
        }
      } else {
        alert('Credenciales inválidas');
      }
    });
  }

}
