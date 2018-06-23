import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsertachesPage } from './usertaches';

@NgModule({
  declarations: [
    UsertachesPage,
  ],
  imports: [
    IonicPageModule.forChild(UsertachesPage),
  ],
})
export class UsertachesPageModule {}
