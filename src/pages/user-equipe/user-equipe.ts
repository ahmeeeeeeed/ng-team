import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events ,AlertController, LoadingController, ToastController, ModalController, ModalOptions } from 'ionic-angular';
import {AngularFireList,AngularFireDatabase,} from 'angularfire2/database';
import { Observable ,} from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { AdminPage } from '../admin/admin';
import { AddUserModalPage } from '../add-user-modal/add-user-modal';
import { ListTaskDiscussPage } from '../list-task-discuss/list-task-discuss';
import { Provider } from '../../providers/provider/provider';



/**
 * Generated class for the UserEquipePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-equipe',
  templateUrl: 'user-equipe.html',
})
export class UserEquipePage {

  USERS: Observable<any[]>;
  ADMINS: Observable<any[]>;
  PERSONNE : Observable<any[]>;
  

  users: AngularFireList<any>;
  personne: AngularFireList<any>;

  SONGS: Observable<any[]>;
  songs: AngularFireList<any>;

  personnes : any =[];
  thisUserAdmins : any =[];
  thisUserAdminsEmail :any
  thisUserAdminsPassword : any

  constructor( 
          public navCtrl: NavController,
             public navParams: NavParams,
            public fire : AngularFireDatabase,
            public event : Events,
            public fauth : AngularFireAuth,
            public alertCtrl: AlertController,
            public loadingCtrl: LoadingController,
            public toastCtrl: ToastController,
            public modalCtrl: ModalController,
            public provider : Provider,

           ) {
           // provider.initialization(this.admins,this.users);
           this.USERS = fire.list('/users').valueChanges();
           this.ADMINS = fire.list('/admins').valueChanges();
           this.PERSONNE = fire.list('/admins').valueChanges();

           this.users = fire.list('/users');
           this.personne = fire.list('/personne');

           this.SONGS = fire.list('/songs').valueChanges();           
          this.songs = fire.list('/songs');

          
          
  }

  getItems(ev: any) {

    /*
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.users = this.users.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
     */
  }

  ionViewDidLoad(){
    var currentUser = firebase.auth().currentUser;
    console.log("in did load currUser : "+currentUser.email );
  }
  addUser(){
   
   const modalOptions :ModalOptions = {
     enableBackdropDismiss : false
   };
   
      let addUserModal = this.modalCtrl.create(
        AddUserModalPage,modalOptions);
      addUserModal.present();
     
   
   }
   

 
notify(pseudo,id){
  let loader = this.loadingCtrl.create({
    content: "Please wait...",
    spinner : "dots"
  
  });

    let prompt = this.alertCtrl.create({
      title: 'Notifier '+pseudo,
      message: "Taper une message de notification",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
  
            loader.present();
            setTimeout(() => {
              

              console.log(`notification pour ${pseudo} : ${data.title}`);
              var message = data.title
              this.provider.sendNotification(id,"date",message)
        
              let toast = this.toastCtrl.create({
                message: `notification pour ${pseudo} : ${data.title}`,
                duration: 3000,
                position : "bottom"
              });
              toast.present();
              
              loader.dismiss();
            }, 1000);



          }
        }
      ]
    });
    prompt.present();
  }

delete(id,email,password){

  let loader = this.loadingCtrl.create({
    content: "Please wait...",
    spinner : "dots"
  
  });

   loader.present()
//this.fauth.auth.signOut();
this.users.remove(id);
this.personne.remove(id).then(()=>{
  let toast = this.toastCtrl.create({
    message: 'suppression a été effectuée avec succés !',
    duration: 3000,
    position: "bottom"
  });
  toast.present();
  loader.dismiss()

})
      /*
var thisUser = firebase.auth().currentUser;
    
 // setTimeout(() => {
    // console.log("2- currUser : "+currentUser.email );
    this.fauth.auth.signInWithEmailAndPassword(email, password)
      .then(data => {

        console.log("thisUser :" + thisUser.email)

        var currentUser = firebase.auth().currentUser;
        var credential = firebase.auth.EmailAuthProvider.credential(email, password);
        currentUser.reauthenticateWithCredential(credential)
          .then(data => {
            currentUser.delete().then(data => {

              this.users.remove(id);
              this.personne.remove(id);


              let toast = this.toastCtrl.create({
                message: 'suppression a été effectuée avec succés !',
                duration: 3000,
                position: "bottom"
              });
              toast.present();
              console.log("auth deleted !");

            //  this.event.publish("secondLogin");



              let administ = this.fire.list(`/admins/${thisUser.uid}`).valueChanges().subscribe(data => {
                this.thisUserAdmins = data;
                this.thisUserAdminsEmail = this.thisUserAdmins[0];
                this.thisUserAdminsPassword = this.thisUserAdmins[1];
        
                this.fauth.auth.signInWithEmailAndPassword(this.thisUserAdminsEmail, this.thisUserAdminsPassword)
                  .then(data => {
                    console.log("signed in with : " + this.thisUserAdminsEmail, this.thisUserAdminsPassword)
                  })
        
                  .catch(error => {
                    let alert = this.alertCtrl.create({
                      title: 'Error!',
                      subTitle: `error happened while signin 2, ${error.message}`,
                     //subTitle: `error happened , ${error.message}`,
        
                      buttons: ['CANCEL']
                    });
                  //  alert.present();
                    loader.dismiss();
        
                    console.log('error happened')
                  })
        
              })//valuChanged().subscribe
        




              loader.dismiss();

            })//currentUser.delete()
              .catch(error => {
                let alert = this.alertCtrl.create({
                  title: 'Error!',
                  subTitle: `error happened, ${error.message}`,
                  buttons: ['CANCEL']
                });
              //  alert.present();
                loader.dismiss();

              });//catch

          })//currentUser.reauthenticateWithCredential(credential).then
          .catch(error => {
            let alert = this.alertCtrl.create({
              title: 'Error!',
              subTitle: `error happened, ${error.message}`,
              buttons: ['CANCEL']
            });
           // alert.present();
            loader.dismiss();

          })//catch

        loader.dismiss();
      })//this.fauth.auth.signInWithEmailAndPassword(email,password).then
      .catch(error => {
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: `error happened while signin 1, ${error.message}`,
          buttons: ['CANCEL']
        });
      //  alert.present();
        loader.dismiss();

        console.log("in catch thisUser :" + thisUser.email)


      })//catch
    //console.log("heeeeeeeeeeey : "+thisUser.email)

    this.event.subscribe("secondLogin", () => {
      console.log("secondLogin");


      let administ = this.fire.list(`/admins/${thisUser.uid}`).valueChanges().subscribe(data => {
        this.thisUserAdmins = data;
        this.thisUserAdminsEmail = this.thisUserAdmins[0];
        this.thisUserAdminsPassword = this.thisUserAdmins[1];

        this.fauth.auth.signInWithEmailAndPassword(this.thisUserAdminsEmail, this.thisUserAdminsPassword)
          .then(data => {
            console.log("signed in with : " + this.thisUserAdminsEmail, this.thisUserAdminsPassword)
          })

          .catch(error => {
            let alert = this.alertCtrl.create({
              title: 'Error!',
              subTitle: `error happened while signin 2, ${error.message}`,
             //subTitle: `error happened , ${error.message}`,

              buttons: ['CANCEL']
            });
            alert.present();
            loader.dismiss();

            console.log('error happened')
          })

      })//valuChanged().subscribe



    })//susbcribe


  /*  loader.dismiss();
  }, 1000);*/
  
    //this.fauth.auth.signInWithEmailAndPassword(thisUser.email,thisUser.id)
    
 
  
  }

  gotoAdminPage(){
    console.log("get it !")
    //this.provider.gotoAdminPage();
    this.hideTabs();
    this.navCtrl.setRoot(AdminPage);
    this.event.publish('buttoncolor');
   
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
ionViewWillLoad(){
  /*this.fauth.authState.subscribe(data => {
    if(data && data.email && data.uid){
      this.alertCtrl.create({
        message: `Welcome to APP_NAME', ${data.email}`,
        //duration: 3000
      }).present();
    }
    else{
      this.alertCtrl.create({
        message: `Couldn't find authentication, ${data.email}`,
       // duration: 3000
      }).present();
    }
  });*/
}

  
}