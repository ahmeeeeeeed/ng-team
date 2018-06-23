import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminDemandesPage } from './admin-demandes';

@NgModule({
  declarations: [
    AdminDemandesPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminDemandesPage),
  ],
})
export class AdminDemandesPageModule {}
