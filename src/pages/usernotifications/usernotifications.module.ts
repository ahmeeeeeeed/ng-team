import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsernotificationsPage } from './usernotifications';

@NgModule({
  declarations: [
    UsernotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(UsernotificationsPage),
  ],
})
export class UsernotificationsPageModule {}
