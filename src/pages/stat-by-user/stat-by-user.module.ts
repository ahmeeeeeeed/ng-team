import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatByUserPage } from './stat-by-user';

@NgModule({
  declarations: [
    StatByUserPage,
  ],
  imports: [
    IonicPageModule.forChild(StatByUserPage),
  ],
})
export class StatByUserPageModule {}
