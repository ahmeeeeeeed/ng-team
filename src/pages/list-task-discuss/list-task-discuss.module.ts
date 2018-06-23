import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListTaskDiscussPage } from './list-task-discuss';

@NgModule({
  declarations: [
    ListTaskDiscussPage,
  ],
  imports: [
    IonicPageModule.forChild(ListTaskDiscussPage),
  ],
})
export class ListTaskDiscussPageModule {}
