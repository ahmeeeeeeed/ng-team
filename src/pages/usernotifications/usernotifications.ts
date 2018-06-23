import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Slides, AlertController, LoadingController, ToastController} from 'ionic-angular';
import * as firebase from 'firebase';

import { Provider } from '../../providers/provider/provider';
import { AdminPage } from '../admin/admin';
import { ListTaskDiscussPage } from '../list-task-discuss/list-task-discuss';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';

/**
 * Generated class for the UsernotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-usernotifications',
  templateUrl: 'usernotifications.html',
})
export class UsernotificationsPage {

  date: Date;
  NOTIFICATIONS: Observable <any[]>;
  notifications: AngularFireList<any>;
  userId = firebase.auth().currentUser.uid;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public event: Events,
    public provider: Provider,
    public fire: AngularFireDatabase,
    public fauth: AngularFireAuth,
    public loadingCtrl: LoadingController,
    public alertCtrl :AlertController,
    public toastCtrl: ToastController,
  ) {
      this.date =  new Date()

     // this.userId = firebase.auth().currentUser.uid;

      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        spinner: "dots"
  
      });
      loader.present();

      firebase.database().ref('/notifications/').on('value', resp => {
        this.NOTIFICATIONS = fire.list('/notifications/').valueChanges()
        this.notifications = this.fire.list('/notifications');

        
        loader.dismiss();
      });

  }

  ionViewDidLoad() {
    
  }
  notificationInfo(id,content){
    let notif = this.alertCtrl.create({
      title: 'contenu de la notification',
      message: `${content}`,
      buttons: [
        {
          text: 'Supprimer',
          handler: () => {
            this.deleteNotif(id)
          }
        },
        {
          text: 'Annuler',
          handler: () => {
            console.log("annuler !!")
          }
        }
      ]
    });
    notif.present();
  }
  deleteNotif(id){
    this.notifications.remove(id)
  }

  gotoAdminPage(){
    this.navCtrl.setRoot(AdminPage);
    this.event.publish('buttoncolor');
    //this.provider.gotoAdminPage();
  }
  goToChatList(){
    this.navCtrl.push(ListTaskDiscussPage)
   }

}
