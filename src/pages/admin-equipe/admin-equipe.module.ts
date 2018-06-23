import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminEquipePage } from './admin-equipe';
import { AdminPage } from '../admin/admin';

@NgModule({
  declarations: [
    AdminEquipePage,
  ],
  imports: [
    IonicPageModule.forChild(AdminEquipePage),
    
  ],
  providers : [
     AdminPage,
  ]
})
export class AdminEquipePageModule {}
