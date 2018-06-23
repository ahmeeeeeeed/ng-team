import { Component, style } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Provider } from '../../providers/provider/provider';
import { AdminPage } from '../admin/admin';
import { TabsAdminsUsersPage } from '../tabs-admins-users/tabs-admins-users';


import {Nav, AlertController,ToastController,LoadingController  } from 'ionic-angular';
import { AngularFireAuth ,} from 'angularfire2/auth';
import * as firebase from 'firebase';



import {AngularFireList,AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ListTaskDiscussPage } from '../list-task-discuss/list-task-discuss';



@IonicPage()
@Component({
  selector: 'page-admin-equipe',
  templateUrl: 'admin-equipe.html',
  
})




export  class AdminEquipePage {

  tabBarElement: any;
  users: Observable<any[]>;
  admins: Observable <any[]>;

  items: string[];

  constructor( public provider : Provider,
           //public adminpage : AdminPage,
          public navCtrl: NavController,
             public navParams: NavParams,
            fire : AngularFireDatabase,
            public event : Events,
         public fauth : AngularFireAuth,
         public loadingCtrl: LoadingController,
        ) {
          this.initializeItems();
           // provider.initialization(this.admins,this.users);
          

           let loader = this.loadingCtrl.create({
            content: "Please wait...",
            spinner: "dots"
      
          });
          loader.present();
      
         
          firebase.database().ref('/admins/').on('value', resp => {
            this.users = fire.list('/users').valueChanges()
            this.admins = fire.list('/admins').valueChanges();      
            loader.dismiss();
      
          });

           this.fauth.auth.onAuthStateChanged(user => {
            if (user) {
              console.log("in AdminEquipePage user logged in")
            //  console.log(user);
           /*   let sUniversities = this.fire.list('/universities').subscribe(data => {
                this.universities = data;
                console.log("user :"+this.universities.email)
                sUniversities.unsubscribe();
              });*/
             
            } else {
              console.log("in AdminEquipePage user not logged in")
             
            }
          });

  

       //    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
          
  }

  //////////////search bar

  initializeItems() {
    this.items = [
      'Amsterdam',
      'Bogota',
      'pogba',
      'abidal',
      'makelel'
    ];
  }
  getItems(ev: any) {

    
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
     
  }

 


 /* ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
 
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }
 
  takeMeBack() {
    this.navCtrl.parent.select(0);
  }*
  ionViewWillEnter() { 
    let tabBarElement = document.querySelector('.tabbar.show-tabbar');
     if (tabBarElement != null) { 
       this.tabBarElement.style.display = 'none'; 
      
      }
    
    }*/

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminEquipePage');
  }
  gotoAdminPage(){
    console.log("get it !")
    this.event.publish('buttoncolor');
    //this.provider.gotoAdminPage();
    this.hideTabs()
    this.navCtrl.setRoot(AdminPage);
   
  }
  goToChatList(){
    this.navCtrl.push(ListTaskDiscussPage)
    this.hideTabs()
   }
  hideTabs() {
    let tabs = document.querySelectorAll('.tabbar.show-tabbar');
    if (tabs !=null ) {
        Object.keys(tabs).map((key) => {
            tabs[key].style.display = 'none';
        });
    }

    console.log("after view init");
}

 
}
