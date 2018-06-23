import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsAdminsUsersPage } from './tabs-admins-users';
import{SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    TabsAdminsUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsAdminsUsersPage),
    SuperTabsModule
    
  ],
})
export class TabsAdminsUsersPageModule {}
