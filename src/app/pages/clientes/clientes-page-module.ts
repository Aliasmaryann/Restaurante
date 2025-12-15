// clientes-page-module.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientesPage } from './clientes-page';
import { ClientesRoutingModule } from './clientes-routing-module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ClientesRoutingModule)
  ],
  declarations: [],
  providers: [],
})
export class ClientesPageModule {}
