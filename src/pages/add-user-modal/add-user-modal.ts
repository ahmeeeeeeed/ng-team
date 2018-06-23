import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, ToastController, AlertController, LoadingController, Events, ActionSheetController } from 'ionic-angular';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Provider } from '../../providers/provider/provider';
import { EmailComposer } from '@ionic-native/email-composer';
import { Camera, CameraOptions } from '@ionic-native/camera';


import * as firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-add-user-modal',
  templateUrl: 'add-user-modal.html',
})
export class AddUserModalPage {

  users: AngularFireList<any>;
  admins: AngularFireList<any>;
  personne: AngularFireList<any>;

  pseudo= null;
  email=null
  poste=null
  password=null;
  profilePicture ="http://www.stpaulusbc.org/content/images/no-profile.png"
  photo ="http://www.stpaulusbc.org/content/images/no-profile.png"

  currEmail : string ;
  currPassword : string;



  constructor(public navCtrl: NavController,
    public navParams : NavParams,
    private fire : AngularFireDatabase,
    public toastCtrl: ToastController,
    public alertCtrl :AlertController,
    public fauth : AngularFireAuth,
    public loadingCtrl: LoadingController,
    public provider : Provider,
    public event : Events,
     public viewCtrl : ViewController,
     private emailComposer: EmailComposer,
     public actionSheetCtrl : ActionSheetController,
    private camera: Camera
    ) {

      this.users = fire.list('/users');
      this.admins = fire.list('/admins');
      this.personne = fire.list('/personne');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddUserModalPage');
    //this.getPictureURL()

  }
  onClose(){
    this.viewCtrl.dismiss();
  }
  addUser(pseudo,email,poste,password){
    //this.test  = true;
   let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
    loader.present();
  

   // setTimeout(() => {
  
     if( this.registre_with_email_password(pseudo,email,poste,password))
      
         loader.dismiss();
   // }, 2000);
 
         
 //console.log(pseudo,email,poste,password)
  
  }
sendEmail(pseudo,email,poste,password){

  let alert = this.alertCtrl.create({
    title: 'Envoie des données',
    subTitle: `un email sera envoyé au : ${email} contenant ses données personnelles ajoutées`,
      buttons: [
        {
          text: 'ok',
           handler: () => {
            let Email = {
              to: email,
              subject: 'Bienvenue', 
              body: `Bienvenu ${pseudo} chez NG-TEAM , vous avez ajouter à notre équipe du travail ,
              votre poste sera ${poste} et vous pouvez acceder à notre plateforme avec votre mot de passe :  ${password}`,
              isHtml: true
            };
            // Send a text message using default options
            this.emailComposer.open(Email)
           }
         }
       ]
  });
  alert.present();
     
  
}

  registre_with_email_password(pseudo,email,poste,password){

    let person: any = []
    let curUser = firebase.auth().currentUser

    let Personne = this.fire.list(`/admins/${curUser.uid}`).valueChanges().subscribe(data => {
      person = data;
      this.currEmail = person[0];
      this.currPassword = person[3];
      this.event.publish('checkCurrUser', person);
      //   console.log("user in app.component.ts:"+this.personne)
      console.log("Email : " + this.currEmail + " Password " + this.currPassword)
      Personne.unsubscribe();
    });

    this.event.subscribe('checkCurrUser', (p) => {
      this.currEmail = p[0];
      this.currPassword = p[3];


      this.fauth.auth.createUserWithEmailAndPassword(email, password)

        .then(data => {

          // setTimeout(() => {
          //this.fauth.auth.signOut();
          console.log('got data', data);
          let alert = this.alertCtrl.create({
            title: 'success!',
            subTitle: `Welcome  ${pseudo} ,you have registred and logged in`,
            buttons: ['OK']
          });
         // alert.present();
          console.log('registred with ', email, password);


          // return true;
          this.setInDatabase(data.uid, pseudo, email, poste, password);
          this.pseudo = null;
          this.email = null
          this.poste = null
          this.password = null;
          /* loader.dismiss();
          }, 2000);*/

            this.fauth.auth.signOut().then(()=>{
              console.log("befor signin - Email : " + this.currEmail + " Password " + this.currPassword)
              this.fauth.auth.signInWithEmailAndPassword(this.currEmail, this.currPassword).then(()=>{
                console.log("-------->"+firebase.auth().currentUser.email)
    
              })
            })
         


          this.sendEmail(pseudo,email,poste,password)
        })
        .catch(error => {
          // setTimeout(() => {
          console.log('got an error', error);
          let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: `error happened, ${error.message}`,
            buttons: ['CANCEL']
          });
          alert.present();

          /*     loader.dismiss();
             }, 2000);*/

        });
      // console.log('test_password_validation',test_password_validation);
      // return true;
    });
    return true;
  }
  
  setInDatabase(id,pseudo,email,poste,password){
  
      this.users.set(id,{
        pseudo :pseudo,
        email : email,
        id : id,
        password : password,
        role : "user",
        poste : poste,
        evaluation_rendement : 0,
        imageURL :  this.photo,
  
      }
  
    ).then(data =>{

      this.getPictureURL()

    console.log(" user registred !")
    let toast = this.toastCtrl.create({
      message:  'user was added successfully',
      duration: 3000,
      position : "middle"
    });
  //  toast.present();

  
  
    });
    
    
    this.personne.set(id,{
      pseudo : pseudo,
      role : "user",  
    });
  
  }
  addPicture(){  
  
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
     // alert.present();
    })
     //loader.dismiss();
  }

  

}
