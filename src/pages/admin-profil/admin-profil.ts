import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Events, ToastController, AlertController, LoadingController, ActionSheetController} from 'ionic-angular';
import * as firebase from 'firebase';

import {AdminPage} from "../admin/admin";
import { Provider } from '../../providers/provider/provider';
import { User } from '../../modules/Users';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { error } from '@firebase/database/dist/esm/src/core/util/util';
import { ListTaskDiscussPage } from '../list-task-discuss/list-task-discuss';
import { Camera,CameraOptions } from '@ionic-native/camera';


/**
 * Generated class for the AdminProfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-profil',
  templateUrl: 'admin-profil.html',
})
export class AdminProfilPage {
  adminpage : any;
  user = {} as User;

  updatePassword = false;
  change_pseudo ;
  change_email ;
  change_poste ;
  newEmail : string ;


  profilePicture ="http://www.stpaulusbc.org/content/images/no-profile.png"

  photo ="http://www.stpaulusbc.org/content/images/no-profile.png"

  currEmail;
  currPassword;
  role ;

  users: AngularFireList<any>;
  admins: AngularFireList<any>;
  personne: AngularFireList<any>;

  constructor(public navCtrl: NavController,
    public navParams : NavParams,
    private fire : AngularFireDatabase,
    public toastCtrl: ToastController,
    public alertCtrl :AlertController,
    public fauth : AngularFireAuth,
    public loadingCtrl: LoadingController,
    public provider : Provider,
    public event : Events,
    public actionSheetCtrl : ActionSheetController,
    private camera: Camera

  ) {
 
      this.users = fire.list('/users');
      this.admins = fire.list('/admins');
      this.personne = fire.list('/personne');
      
      
        
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
    
    loader.present();

    

    var currentUser = firebase.auth().currentUser;
    let Personne = this.fire.list(`/personne/${currentUser.uid}`).valueChanges().subscribe(data => {
      this.role = data[1]
      if (data[1] == "admin") {
        firebase.database().ref('/admins/').on('value', resp => {
 
        let Admins = this.fire.list(`/admins/${currentUser.uid}`).valueChanges().subscribe(data => {
          this.change_pseudo = data[5];
          this.change_email = data[0];
          this.change_poste = data[4];
        });

        loader.dismiss();
      });
      } else {
        firebase.database().ref('/admins/').on('value', resp => {

        let Users = this.fire.list(`/users/${currentUser.uid}`).valueChanges().subscribe(data => {
          this.change_pseudo = data[6];
          this.change_email = data[0];
          this.change_poste = data[5];
        });
        loader.dismiss();
      });

      }
      this.event.publish("roleData",this.role)

    });
    
   this.getPictureURL()

}

 addPicture(){

  this.event.subscribe("roleData", (data) => {
    this.role= data

    if (data == "user") {
     // console.log(data)
    }
  })
  console.log(this.role)


    let actionSheet = this.actionSheetCtrl.create({
      title: 'Importer une photo',
      buttons: [
       {
          text: 'Ouvrire la camera',
          handler: () => {
            console.log('camera opened'); 
            this.openCamera();
          }
        },{
          text: 'Accéder à la galerie',
          handler: () => {
            console.log('galorie opened');
            this.openGalory();
          }
        }
      ]
    });
    actionSheet.present();
} 

openGalory(){
  let loader = this.loadingCtrl.create({
    content: "Please wait...",
    spinner : "dots"
  
  });
  
  loader.present();

  var userEmail = firebase.auth().currentUser.email;


  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType : this.camera.PictureSourceType.PHOTOLIBRARY
  }

  this.camera.getPicture(options).then((imageData) => {
   // imageData is either a base64 encoded string or a file URI
   // If it's base64:
   this.profilePicture = 'data:image/jpeg;base64,' + imageData;

 
var putPics = firebase.storage().ref().child(userEmail).putString(this.profilePicture,'data_url')
.then(()=>{
  this.getPictureURL()
  loader.dismiss();
 })
  }, (err) => {
   // Handle error
   console.log(err)
   loader.dismiss();

  });
}


openCamera(){
  let loader = this.loadingCtrl.create({
    content: "Please wait...",
    spinner : "dots"
  
  });
  
  loader.present();

  var userEmail = firebase.auth().currentUser.email;


  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
  }
  
  this.camera.getPicture(options).then((imageData) => {
   // imageData is either a base64 encoded string or a file URI
   // If it's base64:
   this.profilePicture = 'data:image/jpeg;base64,' + imageData;

   var putPics = firebase.storage().ref().child(userEmail).putString(this.profilePicture,'data_url')
   .then(()=>{
     this.getPictureURL()
    loader.dismiss();
   })
  }, (err) => {
   // Handle error
   console.log(err)
   loader.dismiss();

  });
  
}
getPictureURL(){

  var userEmail = firebase.auth().currentUser.email;
 // firebase.storage().ref().child(userId).getDownloadURL()
console.log(userEmail)
 

  firebase.storage().ref().child(userEmail).getDownloadURL()
  .then( (url) =>{

      this.photo=url

      let alert = this.alertCtrl.create({
        title : "success",
        subTitle: `${this.photo}`,
        buttons: ['OK']
      });
     // alert.present();

      return url
     
  }).catch(error =>{
    let alert = this.alertCtrl.create({
      title : "error",
      subTitle: `La photo n'est pas encore chargée`,
      buttons: ['OK']
    });
 //   alert.present();
  })
   //loader.dismiss();
}

updateProfile(pseudo,poste,oldpassword,password){
  if(this.role == "admin"){
   // console.log(this.role)
     this.updateAdmin(pseudo,poste,oldpassword,password)
  }else if(this.role == "user"){
    this.updateUser(pseudo,poste,oldpassword,password)
   //console.log(this.role)
  }

}
updateAdmin(pseudo,poste,oldpassword,password){


  //this.newEmail= email;
    
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
    loader.present();
  
      var currentUser = firebase.auth().currentUser;
     // currentUser.reload().then( (data)=>console.log("user reloaded !"+data.email))
  
      let Personne = this.fire.list(`/admins/${currentUser.uid}`).valueChanges().subscribe(data => {
      
      //  console.log("1- hereee !!! :"+this.currEmail+" - "+this.currPassword)
        this.event.publish("currentUserdata",data);
        
        Personne.unsubscribe()
       });
  this.event.subscribe("currentUserdata",(data) =>{
    let currEmail=data[0]
    let currPassword=data[2]
  
  if(currPassword==oldpassword)
  {
         /* this.currEmail=currEmail;
          this.currPassword=currPassword;
          console.log("2- hereee !!! :"+currEmail+" - "+currPassword)
          */
  var credential = firebase.auth.EmailAuthProvider.credential(currEmail, currPassword);
  
  console.log("current email : "+currEmail); 
  console.log("current password : "+currPassword); 
  
  //setTimeout(() => {
  currentUser.reauthenticateWithCredential(credential)
  
  .then(data =>{
    
  
  //console.log("email befor updating : "+this.newEmail);
  currentUser.updatePassword(password)
  .then(data =>{
  
   
          let alert = this.alertCtrl.create({
            title: 'success!',
            subTitle: 'Profile data have been changed',
            buttons: ['OK']
          });
          alert.present();
          /********update in data base ***********/
          this.getPictureURL()
          this.admins.update(currentUser.uid, {
            pseudo: pseudo,
            password: password,
            poste: poste,
            imageURL :  this.photo,

            
          })
            .then(data => {
              this.personne.update(currentUser.uid, {
                pseudo: pseudo
              })

              this.getPictureURL()//to change picture in page
              this.event.publish("change menu picture",this.photo);

              //   loader.dismiss();
              //    this.event.publish("reconnecting after updating");
              /*********************Reconnection *************************/
              // this.event.subscribe("reconnecting after updating",()=>{
  
              /*    this.fauth.auth.signInWithEmailAndPassword(email,password)
                  .then(data =>{
                    console.log("reconnected after updating with : "+data.email)
                  }).catch(error=>{
                    console.log("after updating "+error.message);
                  //})
  
                })*/
  
              console.log("nothing is going on here!!")
            })
            .catch(error => {
              //  loader.dismiss();
              console.log('got an error', error);
              let alert = this.alertCtrl.create({
               // title: 'Error wile update in database!',
               title: 'Error !',
                subTitle: `error happened, ${error.message}`,
                buttons: ['CANCEL']
              });
              alert.present();
            })
          /**************************************/
  
        }).catch(error => {
          //   loader.dismiss();
          console.log('got an error', error);
          let alert = this.alertCtrl.create({
          //  title: 'Error while updatePassword!',
            title: 'Error !',
            subTitle: `error happened, ${error.message}`,
            buttons: ['CANCEL']
          });
          alert.present();
  
  
        });//updatePassword.catch
  
  
      //loader.dismiss();
    })//reauth.then
  .catch(error=>{
   // loader.dismiss();
    console.log('got an error',error);
          let alert = this.alertCtrl.create({
          //  title: 'Error while reauth !',
            title: 'Error !',

            subTitle: `error happened, ${error.message}`,
            buttons: ['CANCEL']
          });
          alert.present();
    })//reauth.catch
  
  }//if()
  else {
    console.log('got an error',error);
          let alert = this.alertCtrl.create({
           // title: 'Error typping password !',
            title: 'Error !',

            subTitle:"the current password is not equal to the user's password typed",
            buttons: ['CANCEL']
          });
          alert.present();
    
  }
  
    loader.dismiss();
  
   /* loader.dismiss();
  }, 2000);*/
  })//susbcribe
  
  
  
  
  }
updateUser(pseudo,poste,oldpassword,password){


  //this.newEmail= email;
    
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
    loader.present();
  
      var currentUser = firebase.auth().currentUser;
     // currentUser.reload().then( (data)=>console.log("user reloaded !"+data.email))
  
      let Personne = this.fire.list(`/users/${currentUser.uid}`).valueChanges().subscribe(data => {
      
      //  console.log("1- hereee !!! :"+this.currEmail+" - "+this.currPassword)
        this.event.publish("currentUserdata",data);
        
        Personne.unsubscribe()
       });
  this.event.subscribe("currentUserdata",(data) =>{
    let currEmail=data[0]
    let currPassword=data[3]
  
  if(currPassword==oldpassword)
  {
         /* this.currEmail=currEmail;
          this.currPassword=currPassword;
          console.log("2- hereee !!! :"+currEmail+" - "+currPassword)
          */
  var credential = firebase.auth.EmailAuthProvider.credential(currEmail, currPassword);
  
  console.log("current email : "+currEmail); 
  console.log("current password : "+currPassword); 
  
  //setTimeout(() => {
  currentUser.reauthenticateWithCredential(credential)
  
  .then(data =>{
    
  
  //console.log("email befor updating : "+this.newEmail);
  currentUser.updatePassword(password)
  .then(data =>{
  
   
          let alert = this.alertCtrl.create({
            title: 'success!',
            subTitle: 'Profile data have been changed',
            buttons: ['OK']
          });
          alert.present();
          /********update in data base ***********/
          this.getPictureURL()
          console.log("photo : "+this.photo)
          this.users.update(currentUser.uid, {
            pseudo: pseudo,
            password: password,
            poste: poste,
            imageURL :  this.photo,

          })
            .then(data => {
              this.personne.update(currentUser.uid, {
                pseudo: pseudo
              })

              this.getPictureURL()//to change picture in page
              this.event.publish("change menu picture",this.photo);


              //   loader.dismiss();
              //    this.event.publish("reconnecting after updating");
              /*********************Reconnection *************************/
              // this.event.subscribe("reconnecting after updating",()=>{
  
              /*    this.fauth.auth.signInWithEmailAndPassword(email,password)
                  .then(data =>{
                    console.log("reconnected after updating with : "+data.email)
                  }).catch(error=>{
                    console.log("after updating "+error.message);
                  //})
  
                })*/
  
              console.log("nothing is going on here!!")
            })
            .catch(error => {
              //  loader.dismiss();
              console.log('got an error', error);
              let alert = this.alertCtrl.create({
               // title: 'Error wile update in database!',
               title: 'Error !',

                subTitle: `error happened, ${error.message}`,
                buttons: ['CANCEL']
              });
              alert.present();
            })
          /**************************************/
  
        }).catch(error => {
          //   loader.dismiss();
          console.log('got an error', error);
          let alert = this.alertCtrl.create({
           // title: 'Error while updatePassword!',
           title: 'Error !',

            subTitle: `error happened, ${error.message}`,
            buttons: ['CANCEL']
          });
          alert.present();
  
  
        });//updatePassword.catch
  
  
      //loader.dismiss();
    })//reauth.then
  .catch(error=>{
   // loader.dismiss();
    console.log('got an error',error);
          let alert = this.alertCtrl.create({
           // title: 'Error while reauth !',
           title: 'Error !',
            subTitle: `error happened, ${error.message}`,
            buttons: ['CANCEL']
          });
          alert.present();
    })//reauth.catch
  
  
  
     
  
  }//if()
  else {
    console.log('got an error',error);
          let alert = this.alertCtrl.create({
          //  title: 'Error typping password !',
            title: 'Error !',

            subTitle:"the current password is not equal to the user's password typed",
            buttons: ['CANCEL']
          });
          alert.present();
    
  }
  
    loader.dismiss();
  
   /* loader.dismiss();
  }, 2000);*/
  })//susbcribe
  
  
  
  
  }
updateProfileByPseudAndPost(pseudo,poste){
  if(this.role == "admin"){
    this.updateAdminByPseudAndPost(pseudo,poste)
   //console.log(this.role)
  }else if(this.role == "user"){
    this.updateUserByPseudAndPost(pseudo,poste)
   //console.log(this.role)
  }
}
updateUserByPseudAndPost(pseudo,poste){
  var currentUser = firebase.auth().currentUser;
  let loader = this.loadingCtrl.create({
    content: "Please wait...",
    spinner : "dots"
  
  });
  loader.present();
  
    /********update in data base ***********/
      this.users.update(currentUser.uid,{
        pseudo :pseudo,
        poste : poste,
        imageURL :  this.photo,

      })
      .then(data =>{
        this.personne.update(currentUser.uid,{
          pseudo :pseudo
        })
        let alert = this.alertCtrl.create({
          title: 'success!',
          subTitle: 'data have been changed',
          buttons: ['OK']
        });
        alert.present();

        this.getPictureURL()//to change picture in page
        this.event.publish("change menu picture",this.photo);


            
      })
      .catch(error=>{
      //  loader.dismiss();
        console.log('got an error',error);
        let alert = this.alertCtrl.create({
        //  title: 'Error wile update in database!',
          title: 'Error !',

          subTitle: `error happened, ${error.message}`,
          buttons: ['CANCEL']
        });
        alert.present();
      })
    /**************************************/
    loader.dismiss();
}
updateAdminByPseudAndPost(pseudo,poste){
  var currentUser = firebase.auth().currentUser;
  let loader = this.loadingCtrl.create({
    content: "Please wait...",
    spinner : "dots"
  
  });
  loader.present();
  
    /********update in data base ***********/
      this.admins.update(currentUser.uid,{
        pseudo :pseudo,
        poste : poste,
        imageURL :  this.photo,

      })
      .then(data =>{
        this.personne.update(currentUser.uid,{
          pseudo :pseudo
        })
        let alert = this.alertCtrl.create({
          title: 'success!',
          subTitle: 'data have been changed',
          buttons: ['OK']
        });
        alert.present();

        this.getPictureURL()//to change picture in page
        this.event.publish("change menu picture",this.photo);


            
      })
      .catch(error=>{
      //  loader.dismiss();
        console.log('got an error',error);
        let alert = this.alertCtrl.create({
        //  title: 'Error wile update in database!',
        title: 'Error !',

          subTitle: `error happened, ${error.message}`,
          buttons: ['CANCEL']
        });
        alert.present();
      })
    /**************************************/
    loader.dismiss();
}



  gotoAdminPage(){
   // this.provider.gotoAdminPage();
    this.navCtrl.setRoot(AdminPage);
    this.event.publish('buttoncolor');
  }
  goToChatList(){
    this.navCtrl.push(ListTaskDiscussPage)
   }
  changePassword(){
    this.updatePassword=!this.updatePassword;
  }
 
}


/*
currentUser.updateEmail(this.newEmail)
.then(data =>{

console.log("bfore subscribing to email error");


    //////////////////////////testing email problem 
this.event.subscribe("email error avoiding",()=>{
  console.log("cannot find email raising!!");
      });//email error avoiding susbscribing
/////////////////////testing email problem 

//loader.dismiss();
  let alert = this.alertCtrl.create({
    title: 'success!',
    subTitle: 'your data have been updated successfully, your new email is :',
    buttons: ['OK']
  });
  alert.present();
  
  currentUser.updatePassword(password)
    .then(data =>{

     
      let alert = this.alertCtrl.create({
        title: 'success!',
        subTitle: 'password have been changed',
        buttons: ['OK']
      });
      alert.present();
        //////////update in data base ////////////
          this.admins.update(currentUser.uid,{
            pseudo :pseudo,
            email : this.newEmail,
            password : password,
            poste : poste,
          })
          .then(data =>{
            this.personne.update(currentUser.uid,{
              pseudo :pseudo
            })
         //   loader.dismiss();
                //    this.event.publish("reconnecting after updating");
                  /////////////////////Reconnection ////////////////////
                 // this.event.subscribe("reconnecting after updating",()=>{

                    this.fauth.auth.signInWithEmailAndPassword(email,password)
                    .then(data =>{
                      console.log("reconnected after updating with : "+data.email)
                    }).catch(error=>{
                      console.log("after updating "+error.message);
                    //})

                  })
                 
                  console.log("nothing is going on here!!")
          })
          .catch(error=>{
          //  loader.dismiss();
            console.log('got an error',error);
            let alert = this.alertCtrl.create({
              title: 'Error wile update in database!',
              subTitle: `error happened, ${error.message}`,
              buttons: ['CANCEL']
            });
            alert.present();
          })
       /////////////////////////////////////

    }).catch(error =>{
   //   loader.dismiss();
      console.log('got an error',error);
      let alert = this.alertCtrl.create({
        title: 'Error while updatePassword!',
        subTitle: `error happened, ${error.message}`,
        buttons: ['CANCEL']
      });
      alert.present();

      
    });//updatePassword.catch
 

}).catch(error =>{
 // loader.dismiss();
  console.log('got an error',error);
  let alert = this.alertCtrl.create({
    title: 'Error while updateEmail !',
    subTitle: `error happened, ${error.message}`,
    buttons: ['CANCEL']
  });
  alert.present();
  
  if(error.message=="Cannot read property 'email' of undefined"){
    console.log("publishing email error avoiding ...");
        this.event.publish("email error avoiding");
  }
  console.log("email after updating in catch: "+this.newEmail);
  
})//updateEmail.catch
*/