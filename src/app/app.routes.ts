import { Routes } from '@angular/router';

export const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'  // importante: indica que debe coincidir exactamente la ruta vacía
  },  
  {
    path: 'bodega-page',
    loadChildren: () =>
        import('./pages/bodega/bodega-page/bodega-page-module').then(m => m.BodegaPageModule)
    },
  {
  path: 'login',
  loadChildren: () =>
    import('./pages/login/login.routes').then(m => m.LOGIN_ROUTES),
  },
  /*{
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin-routing-module').then(m => m.AdminRoutingModule),
  }*/
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
  path: 'clientes',
  loadChildren: () =>
    import('./pages/clientes/clientes-page-module').then(m => m.ClientesPageModule),
}

];
