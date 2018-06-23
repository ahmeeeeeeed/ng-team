import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController } from 'ionic-angular';
import { AdminPage } from '../admin/admin';
import { DiscussionPage } from '../discussion/discussion';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';


/**
 * Generated class for the ListTaskDiscussPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-task-discuss',
  templateUrl: 'list-task-discuss.html',
})
export class ListTaskDiscussPage {

  rooms = [];
  ref = firebase.database().ref('/taches/en cours/');
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public event : Events,
    public loadingCtrl: LoadingController,
    public fire: AngularFireDatabase,


  ) {
  
  }


  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
    loader.present();
   this.ref.on('value', resp => {
    this.rooms = [];
    this.rooms = snapshotToArray(resp);
    console.log("rooms" +this.rooms );
    loader.dismiss();
  });
    
  }
  

  joinRoom(titre) {
    var userId = firebase.auth().currentUser.uid;


    let Personne = this.fire.list(`/personne/${userId}`).valueChanges().subscribe(data => {
      this.navCtrl.push(DiscussionPage, {
        key:titre,
        nickname: data[0]
      });

  Personne.unsubscribe()
  });
 /*   this.navCtrl.push(DiscussionPage, {
      key:titre,
      nickname: this.navParams.get("user")
    });
    */
  }


gotoAdminPage(){
  console.log("get it !")
  //this.provider.gotoAdminPage();
  this.navCtrl.setRoot(AdminPage);
  this.event.publish('buttoncolor');
 
}

}

export const snapshotToArray = snapshot => {
    let returnArr = [];

    snapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
};



