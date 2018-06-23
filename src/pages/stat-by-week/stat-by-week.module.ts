import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatByWeekPage } from './stat-by-week';

@NgModule({
  declarations: [
    StatByWeekPage,
  ],
  imports: [
    IonicPageModule.forChild(StatByWeekPage),
  ],
})
export class StatByWeekPageModule {}
