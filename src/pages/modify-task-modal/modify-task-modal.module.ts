import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModifyTaskModalPage } from './modify-task-modal';

@NgModule({
  declarations: [
    ModifyTaskModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ModifyTaskModalPage),
  ],
})
export class ModifyTaskModalPageModule {}
