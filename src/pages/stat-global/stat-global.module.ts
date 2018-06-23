import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatGlobalPage } from './stat-global';

@NgModule({
  declarations: [
    StatGlobalPage,
  ],
  imports: [
    IonicPageModule.forChild(StatGlobalPage),
  ],
})
export class StatGlobalPageModule {}
