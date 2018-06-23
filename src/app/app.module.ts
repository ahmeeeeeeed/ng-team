import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule ,NavController} from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import {AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {AngularFireDatabaseModule, AngularFireDatabase} from 'angularfire2/database';
import{SuperTabsModule } from 'ionic2-super-tabs';
import { Camera } from '@ionic-native/camera';


import { HttpClient,HttpClientModule } from '@angular/common/http'; 
import { Http ,HttpModule} from '@angular/http' ;

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AdminPage } from '../pages/admin/admin';
import { AdminEquipePage } from '../pages/admin-equipe/admin-equipe';
import { AdminProfilPage } from '../pages/admin-profil/admin-profil';

import { AdminStatPage } from '../pages/admin-stat/admin-stat';
import { AdminTachesPage } from '../pages/admin-taches/admin-taches';
import { AdminDemandesPage } from '../pages/admin-demandes/admin-demandes';
//import { UserTachesPage } from '../pages/user-taches/user-taches';
import { TabsAdminsUsersPage } from '../pages/tabs-admins-users/tabs-admins-users';
import { UserEquipePage } from '../pages/user-equipe/user-equipe';
import { AddUserModalPage } from '../pages/add-user-modal/add-user-modal';
import { AddTaskModalPage } from '../pages/add-task-modal/add-task-modal';

import { ModifyTaskModalPage } from '../pages/modify-task-modal/modify-task-modal';

import { UsertachesPage } from '../pages/usertaches/usertaches';
import { UsernotificationsPage } from '../pages/usernotifications/usernotifications';

import { DiscussionPage } from '../pages/discussion/discussion';
import { ListTaskDiscussPage } from '../pages/list-task-discuss/list-task-discuss';

import { SuperTabsStatPage } from '../pages/super-tabs-stat/super-tabs-stat';
import { StatGlobalPage } from '../pages/stat-global/stat-global';
import { StatByWeekPage } from '../pages/stat-by-week/stat-by-week';
import { StatByUserPage } from '../pages/stat-by-user/stat-by-user';



import {ControllerComponent} from '../components/controller/controller';


import { Provider } from '../providers/provider/provider';
import { DataProvider } from '../providers/data/data';
import { ChartsModule } from 'ng2-charts';
import { EmailComposer } from '@ionic-native/email-composer';
//import { Push } from '@ionic-native/push';



const  config = {
  apiKey: "AIzaSyBN1GZezPVmabEFsQI3n5XS39Eqlpepy9U",
  authDomain: "project-bb4c8.firebaseapp.com",
  databaseURL: "https://project-bb4c8.firebaseio.com",
  projectId: "project-bb4c8",
  storageBucket: "project-bb4c8.appspot.com",
  messagingSenderId: "771333764663"
};

@NgModule({
  declarations: [ 
    MyApp,
    HomePage,
    AdminPage,
    AdminEquipePage,
    AdminProfilPage,
    AdminStatPage,
    AdminTachesPage,
    TabsAdminsUsersPage,
    UserEquipePage,
    ControllerComponent,
    AdminDemandesPage,
    UsertachesPage,
    UsernotificationsPage,
    AddUserModalPage,
    AddTaskModalPage,
    ModifyTaskModalPage,
    DiscussionPage,
    ListTaskDiscussPage,
    SuperTabsStatPage,
    StatGlobalPage,
    StatByWeekPage,
    StatByUserPage
 ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: 'false',
    },),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(config),
    SuperTabsModule.forRoot(),
    ChartsModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AdminPage,
    AdminEquipePage,
    AdminProfilPage,
    AdminStatPage,
    AdminTachesPage,
    TabsAdminsUsersPage,
    UserEquipePage,
    AdminDemandesPage,
    UsertachesPage,
    UsernotificationsPage,
    AddUserModalPage,
    AddTaskModalPage,
    ModifyTaskModalPage,
    DiscussionPage,
    ListTaskDiscussPage,
    SuperTabsStatPage,
    StatGlobalPage,
    StatByWeekPage,
    StatByUserPage
    
    
    
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    Camera,
    EmailComposer, 
    //Push,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Provider,AdminPage,
    HttpClientModule,Http ,HttpModule,HttpClient,
    DataProvider,
    ]
})
export class AppModule {}
