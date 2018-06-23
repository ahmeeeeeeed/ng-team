import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddUserModalPage } from './add-user-modal';

@NgModule({
  declarations: [
    AddUserModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddUserModalPage),
  ],
})
export class AddUserModalPageModule {}


