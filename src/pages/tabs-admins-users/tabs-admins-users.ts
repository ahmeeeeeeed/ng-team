import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Config } from 'ionic-angular';
import { SuperTabs, SuperTabsController } from 'ionic2-super-tabs';

import { AdminEquipePage } from '../admin-equipe/admin-equipe';
import { UserEquipePage } from '../user-equipe/user-equipe';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
/**
 * Generated class for the TabsAdminsUsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs-admins-users',
  templateUrl: 'tabs-admins-users.html',
/* template : `
 


 <ion-scroll  scrollY="true" style="width : 400px ; height : 100%">
 <img src="http://www.stpaulusbc.org/content/images/no-profile.png"/>
 <img src="http://www.stpaulusbc.org/content/images/no-profile.png"/>
 <img src="http://www.stpaulusbc.org/content/images/no-profile.png"/>
 <img src="http://www.stpaulusbc.org/content/images/no-profile.png"/>
 <img src="http://www.stpaulusbc.org/content/images/no-profile.png"/>
 <img src="http://www.stpaulusbc.org/content/images/no-profile.png"/>
 <img src="http://www.stpaulusbc.org/content/images/no-profile.png"/>
</ion-scroll>

 `*/
})
export class TabsAdminsUsersPage {
  selectedTab = 0;
  @ViewChild(SuperTabs) superTabs : SuperTabs;

  tabBarElement: any;
  enable : boolean = true;
  tab1Root = AdminEquipePage
  tab2Root = UserEquipePage

  nbAdmins = 0;
  nbUsers = 0;

  users: Observable<any[]>;
  admins: Observable <any[]>;
  personne: Observable <any[]>;

  pages = [
    {pageName : 'AdminEquipePage', title : 'Administrateurs',icon : 'home', id:'admins'},
    {pageName : 'UserEquipePage', title : 'Utilisateurs',icon : 'md-contacts', id:'users'},
    
  ];


  constructor(// public provider : Provider,
    //public adminpage : AdminPage,
   public navCtrl: NavController,
      public navParams: NavParams,
     public fire : AngularFireDatabase,
     public event : Events,
  public fauth : AngularFireAuth,
  public superTabsCtrl : SuperTabsController) {

   /* event.subscribe('disableTabs', () => {
    // this.enable=false;
    
    document.querySelector("ion-tabbar")['style'].display = 'none'
    this.loggedIn()
     
    });*/
    this.users = fire.list('/users').valueChanges()
    this.admins = fire.list('/admins').valueChanges();
    this.personne = fire.list('/admins').valueChanges();

  

  }

  ionViewDidLoad() {
    let Users = this.fire.list(`/users/`).valueChanges().subscribe(data => {
     // console.log("--> personnes :"+data.length)
     this.nbUsers = data.length;
    // this.superTabsCtrl.setBadge("badgeUser",data.length);
     });
     let Admins = this.fire.list(`/admins/`).valueChanges().subscribe(data => {
      //console.log("--> personnes :"+data.length)
      this.nbAdmins = data.length;
     // this.superTabsCtrl.setBadge("badgeAdmin",data.length);
     });
  }
  loggedIn() {
    console.log("disabled");
  }
/*  onTabSelected (ev : any){
    if(ev.index === 2){
      
    }else{
      this.selectedTab = ev.index;
   //   this.superTabs.clearBadge(this.pages[ev.index].id);

    }
  }*/


}
