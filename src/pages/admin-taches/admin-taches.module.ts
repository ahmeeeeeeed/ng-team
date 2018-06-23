import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminTachesPage } from './admin-taches';

@NgModule({
  declarations: [
    AdminTachesPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminTachesPage),
  ],
})
export class AdminTachesPageModule {}
