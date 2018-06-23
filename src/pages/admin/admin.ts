import { Component,ViewChild } from '@angular/core';
import { Nav,IonicPage, NavController, NavParams ,LoadingController,AlertController,Events,ToastController} from 'ionic-angular';

import { HomePage } from '../home/home';
import { Provider } from '../../providers/provider/provider';
import { User } from '../../modules/Users';
import { ListTaskDiscussPage } from '../list-task-discuss/list-task-discuss';


import { AngularFireAuth } from 'angularfire2/auth';
import {AngularFireList,AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';


/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export  class AdminPage {

  
  user = {} as User;
  pushtest : string;
  //rootpage = 'AdminPage';
  activeButton = false;
  @ViewChild(Nav) nav: Nav;

  TACHES_ENCOURS: Observable<any[]>;



  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public provider : Provider,
              public alertCtrl :AlertController,
              public fauth : AngularFireAuth,
              private fire : AngularFireDatabase, 
            public event : Events,
            private toast: ToastController,
          )

  {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner: "dots"

    });
    loader.present();

    //  this.provider.initialization()
    if (this.ionViewCanLeave) {
      // console.log("leave !!!")
    }
    firebase.database().ref('/taches/en cours/').on('value', resp => {
      this.TACHES_ENCOURS = fire.list('/taches/en cours/').valueChanges();

      loader.dismiss();

    });


              
              
  }
  ionViewDidLeave(){
//this.navCtrl.setRoot(AdminPage);
   /*console.log("leave !!!")
    let alert = this.alertCtrl.create({
      title: 'success!',
      subTitle:"would you leave us !?",
      buttons: ['OK']
    });
    alert.present();*/
  }

  ionViewDidLoad() {
   /* this.event.subscribe('hello ' , name =>{
      const toast = this.toast.create({
      message: `Hello ahmed`,
      duration: 3000
    });
    toast.present();
    });*/


    console.log('ionViewDidLoad AdminPage');
   /* this.user.test_activated=true;
    console.log("test_activated! : "+this.user.test_activated);*/
    this.fauth.auth.onAuthStateChanged(user => {
      if (user) {
        console.log("in AdminPage : user logged in")
      
      } else {
        console.log("in AdminPage : user not logged in")
       
      }
    });
  }
  public goBack(){

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots",
      duration : 1000
    
    });
    loader.onDidDismiss(() => {
          this.fauth.auth.signOut()
       /*   if(this.ionViewCanLeave()){*/
            this.navCtrl.setRoot(HomePage);
            console.log("disconnected !");
       /*   }
           else console.log("error disc !!")!*/
      
    });
  
    loader.present();
 }

 gotoAdminPage(){
 // this.provider.gotoAdminPage();
    //this.event.publish('disableTabs');
    this.event.publish('buttoncolor');
    console.log("bottoncolor published in adminpage!!")
    this.navCtrl.setRoot(AdminPage);
    
 //this.activeButton = true
 

 }
 goToChatList(){
  this.navCtrl.push(ListTaskDiscussPage)
/*
  this.provider.getCurrentUser()
   this.event.subscribe("getting user name",(curruser)=>{

    console.log("current user :"+curruser);
    this.navCtrl.push(ListTaskDiscussPage,{user : curruser})
})
  */
}
 /*logout() {
  if (this.navCtrl.last().index > 0) {
    this.navCtrl.remove(this.navCtrl.last().index)
      .then( () => {
        this.fauth.auth.signOut();
      },
      error => {console.error(error); }
      );
  }
  else {
    this.fauth.auth.signOut();
  console.log("logged out !")
  }
 

}
*/
/*ngOnInit() {
  this.fauth.auth.onAuthStateChanged(user => {
    if (user) {
      console.log("user logged in")
      //this.nav.setRoot(HomePage); //I've tried also with this.rootPage = HomePage and the behavieur is the same
    } else {
      console.log("user not logged in")
      // this.nav.setRoot(LoginPage);  //I've tried also with this.rootPage = LoginPage and the behavieur is the same
    }
  });
 // this.fauth.auth.signOut();
}*/
ionViewCanLeave(): any {
 /* this.fauth.auth.onAuthStateChanged(user => {
    if (user) {
      console.log("user logged out")
      return true
      //this.nav.setRoot(HomePage); //I've tried also with this.rootPage = HomePage and the behavieur is the same
    } else {
      console.log("user not logged out")
      return false
      // this.nav.setRoot(LoginPage);  //I've tried also with this.rootPage = LoginPage and the behavieur is the same
    }
  });*/
}


}
