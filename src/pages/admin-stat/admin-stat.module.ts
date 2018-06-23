import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminStatPage } from './admin-stat';

@NgModule({
  declarations: [
    AdminStatPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminStatPage),
  ],
})
export class AdminStatPageModule {}
