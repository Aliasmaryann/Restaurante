import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, AvatarModule, CheckboxModule, IconFieldModule, InputIconModule, FloatLabelModule, InputTextModule, PasswordModule, ButtonModule, CardModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPages {
  username = '';
  password = '';

  login() {
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);
  }
}
