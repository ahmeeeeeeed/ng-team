import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController } from 'ionic-angular';
import { ListTaskDiscussPage } from '../list-task-discuss/list-task-discuss';
import * as firebase from 'firebase';
/**
 * Generated class for the DiscussionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-discussion',
  templateUrl: 'discussion.html',
})
export class DiscussionPage {

  
  @ViewChild(Content) content: Content;

  data = { type:'', nickname:'', message:'' };
  chats = [];
  roomkey:string;
  nickname:string;
  offStatus:boolean = false;
  TaskName 

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController,
  ) {
    this.roomkey = this.navParams.get("key") as string;
    this.nickname = this.navParams.get("nickname") as string;
    this.TaskName=this.nickname
    this.data.type = 'message';
    this.data.nickname = this.nickname;

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
    loader.present();

    /*let joinData = firebase.database().ref('messages/'+this.roomkey).push();
    joinData.set({
      type:'join',
      user:this.nickname,
      message:this.nickname+' has joined this room.',
      sendDate:Date()
    });*/
    this.data.message = '';

    firebase.database().ref('messages/'+this.roomkey).on('value', resp => {
      this.chats = [];
     // console.log("befor : "+this.chats)

      this.chats = snapshotToArray(resp);
      loader.dismiss();
    //  console.log("after : "+this.chats)
      setTimeout(() => {
        if(this.offStatus === false) {
          this.content.scrollToBottom(300);
        }
      }, 500);
    });
  }
  ionViewDidLoad(){
    this.TaskName=  this.roomkey
  }

  sendMessage() {
    let newData = firebase.database().ref('messages/'+this.roomkey).push();
    newData.set({
      type:this.data.type,
      user:this.data.nickname,
      message:this.data.message,
      sendDate:Date()
    });
    this.data.message = '';
  }

  exitChat() {
    /*let exitData = firebase.database().ref('messages/'+this.roomkey).push();
    exitData.set({
      type:'exit',
      user:this.nickname,
      message:this.nickname+' has exited this room.',
      sendDate:Date()
    });

    this.offStatus = true;*/

    this.navCtrl.setRoot(ListTaskDiscussPage, {
      user:this.nickname
    });
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