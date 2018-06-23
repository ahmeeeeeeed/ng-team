import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminProfilPage } from './admin-profil';
import {AdminPage} from "../admin/admin";
@NgModule({
  declarations: [
    AdminProfilPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminProfilPage),
  ]

})
export class AdminProfilPageModule {}
