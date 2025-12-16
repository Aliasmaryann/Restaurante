import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CONFIG_ROUTES } from './config-routing-module';

@NgModule({
  imports: [
    RouterModule.forChild(CONFIG_ROUTES)
  ]
})
export class ConfigModule {}
