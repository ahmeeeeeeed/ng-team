import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams ,Events} from 'ionic-angular';
import { SuperTabs, SuperTabsController } from 'ionic2-super-tabs';
import {AdminPage} from "../admin/admin";
import { Provider } from '../../providers/provider/provider';
import { ListTaskDiscussPage } from '../list-task-discuss/list-task-discuss';
import * as firebase from 'firebase';


import { StatGlobalPage } from '../stat-global/stat-global';
import { StatByWeekPage } from '../stat-by-week/stat-by-week';
import { StatByUserPage } from '../stat-by-user/stat-by-user';



/**
 * Generated class for the SuperTabsStatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-super-tabs-stat',
  templateUrl: 'super-tabs-stat.html',
})
export class SuperTabsStatPage {

  @ViewChild(SuperTabs) superTabs : SuperTabs;

  tab1Root = StatGlobalPage
  tab2Root = StatByWeekPage
  tab3Root = StatByUserPage



  constructor(public navCtrl: NavController,
              public navParams : NavParams,
              public provider : Provider,
              public event : Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuperTabsStatPage');
    console.log("heyyy")
  }

  onTabSelected(ev){

    if(ev.index==2){
      this.provider.getUserList();
    }


  }



  gotoAdminPage(){
    // this.provider.gotoAdminPage();
     this.navCtrl.setRoot(AdminPage);
     this.event.publish('buttoncolor');
   }
   goToChatList(){
    this.navCtrl.push(ListTaskDiscussPage)
   }
}
