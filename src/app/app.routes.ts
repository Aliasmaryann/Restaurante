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

];
