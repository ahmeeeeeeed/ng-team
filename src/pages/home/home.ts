import { Component ,ViewChild} from '@angular/core';
import {Nav, NavController, AlertController,ToastController,LoadingController, NavParams ,Events, ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Camera, CameraOptions } from '@ionic-native/camera';

//import {AngularFireModule} from 'angularfire2';
//import { AngularFireAuthModule } from 'angularfire2/auth';
import {AngularFireList,AngularFireDatabase } from 'angularfire2/database';
//import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { DataProvider } from '../../providers/data/data'; 
import { AdminPage } from '../admin/admin';
import { Provider } from '../../providers/provider/provider';

//import { ThenableReference } from '@firebase/database-types';
import { User } from '../../modules/Users';
import { AdminProfilPage } from '../admin-profil/admin-profil';
import { error } from '@firebase/database/dist/esm/src/core/util/util';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Nav) nav: Nav;
  reg_pseudo=null;
  reg_email=null;
  reg_pass =null;
  reg_role =null;
  reg_poste =null;
  login_username = null;
  login_password = null;

  profilePicture ="http://www.stpaulusbc.org/content/images/no-profile.png"
  photo ="http://www.stpaulusbc.org/content/images/no-profile.png"

  user = {} as User;
  
  users: AngularFireList<any>;
  admins: AngularFireList<any>;
  personne: AngularFireList<any>;

registred : boolean= false;
selectedValue =null;
test : boolean = true; 

 personnes : any = [];
 role : string;
 pseudo : string;
 interface_name : string;

 userData : any;

 personneConnected: any = [];
  pseudoPersonne : string ;
  rolePersonne : string

//test_password_validation : boolean = true;


  constructor(public navCtrl: NavController,
              public navParams : NavParams,
              private fire : AngularFireDatabase,
              public toastCtrl: ToastController,
              public alertCtrl :AlertController,
              public fauth : AngularFireAuth,
              public loadingCtrl: LoadingController,
              public provider : Provider,
              public event : Events,
              private verifdata : DataProvider,
              public actionSheetCtrl : ActionSheetController,
              private camera: Camera,
           //   public user : User
  ) {
    this.users = fire.list('/users');
    this.admins = fire.list('/admins');
    this.personne = fire.list('/personne');
   // this.testbase.push({ahmed : 111});
    //provider.initialization();
  
   
    }

  ionViewDidLoad(){
 /* let loader = this.loadingCtrl.create({
    content: "Please wait...",
    spinner : "dots"
  
  });
  
    if(firebase.auth().currentUser){
      loader.present();
    //  console.log("singnout")
      this.fauth.auth.signOut().then(()=>{
        loader.dismiss();
      })
    }
    */

    /*var s = "ssss"
    firebase.storage().ref().child(s).getDownloadURL().then(url=>{
      console.log(url)
    }).catch(error =>{
      console.log(error)
    })*/

   
   // this.verifdata;
   /* this.fauth.auth.onAuthStateChanged(user => {
      if (user) {
        console.log("user logged in")
       
      } else {
        console.log("user not logged in")
       
      }
    });*/
  }

  /*registre_validation (reg_pseudo,reg_email,reg_pass,reg_poste,reg_role){
    if(reg_pseudo =="" ||
      reg_email =="" ||
      reg_pass =="" || 
      reg_poste =="" ){
      console.log("some field is empty !!!");
        this.test = false;
        return this.test;
    }
    
    else if(reg_pseudo ==null ||
      reg_email ==null ||
      reg_pass ==null || 
      reg_poste ==null ||
      this.selectedValue ==null)
      {
        this.test = false ;
        console.log("false : ",this.selectedValue);
        return this.test;
      }
    else {
      this.test = true;
        console.log("true",this.selectedValue, reg_poste);
        return this.test;
      }
  }
  */
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

  /* const picture = firebase.storage().ref('images/');
   picture.putString(this.base64Image,'data_url')
*/
var putPics = firebase.storage().ref().child(this.reg_email).putString(this.profilePicture,'data_url')
//this.getPictureURL()
.then(()=>{
  this.getPictureURL()
  loader.dismiss();
 })
   loader.dismiss();
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

   var putPics = firebase.storage().ref().child(this.reg_email).putString(this.profilePicture,'data_url')
   .then(()=>{
    this.getPictureURL()
    loader.dismiss();
   })  }, (err) => {
   // Handle error
   console.log(err)
   loader.dismiss();

  });
  
}
getPictureURL(){

  var userId = firebase.auth().currentUser.uid;
 // firebase.storage().ref().child(userId).getDownloadURL()

  firebase.storage().ref().child(this.reg_email).getDownloadURL()
  .then( (url) =>{

      this.photo=url

      let alert = this.alertCtrl.create({
        title : "success",
        subTitle: `${this.photo}`,
        buttons: ['OK']
      });
    //  alert.present();
     
  }).catch(error =>{
    let alert = this.alertCtrl.create({
      title : "error",
      subTitle: `La photo n'est pas encore chargée`,
      buttons: ['OK']
    });
    alert.present();
  })
   //loader.dismiss();
}
registre_with_email_password(reg_pseudo,reg_email,reg_pass,reg_poste,reg_role,role){

  let loader = this.loadingCtrl.create({
    content: "Please wait...",
    spinner : "dots"
  
  });
  loader.present();

  this.fauth.auth.createUserWithEmailAndPassword(reg_email,reg_pass)

    .then(data => {
    

   // setTimeout(() => {
    //this.fauth.auth.signOut();
          
        
        // return true;
      this.setInDatabase(data.uid, reg_pseudo, reg_email, reg_pass, reg_poste, reg_role, role);
      //this.fauth.auth.signOut();
      //this.navCtrl.setRoot(AdminPage);
      var message;
   /*   if (this.photo == this.profilePicture) {
       // message = " vous êtes enregistré et connecté mais votre photo n'a pas encore été chargée"
        message = "you have registred and logged in but your photo dosnt uploaded yet"
      }
      else// message = "vous êtes avec succés , veuillez patientez lors de l'ouverture de votre session"
     */
     message = `Welcome  ${reg_pseudo} ,you have registred and logged in`

     // var putPics = firebase.storage().ref().child(data.uid).putString(this.profilePicture,'data_url');


        console.log('got data',data);
          let alert = this.alertCtrl.create({
            title: 'success!',
            subTitle: `${message}`,
            buttons: ['OK']
          });
       //   alert.present();
          console.log('registred with ',reg_email,reg_pass);
          console.log(data);
        this.login(reg_email,reg_pass)

    /* loader.dismiss();
    }, 2000);*/

    loader.dismiss();

    })
    .catch(error =>{
      // setTimeout(() => {
        console.log('got an error',error);
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: `error happened, ${error.message}`,
          buttons: ['CANCEL']
        });
        alert.present();
     
 /*     loader.dismiss();
    }, 2000);*/

    loader.dismiss();


    })
   // console.log('test_password_validation',test_password_validation);
}

setInDatabase(id,reg_pseudo,reg_email,reg_pass,reg_poste,reg_role,role){
if(role == "admin"){
  this.admins.set(id,{
        pseudo :reg_pseudo,
        email : reg_email,
        id : id,
        password : reg_pass,
        role : role,
        poste : reg_poste,
        imageURL :  this.photo,


      }
      

    ).then(data =>{
    console.log(" admin registred !")
    let toast = this.toastCtrl.create({
      message:  'admin was added successfully',
      duration: 3000,
      position : "top"
    });
   // toast.present();
    this.cancel();this.gotoRegistreinterface();


    });
  
  }
else if(role == "user"){
    this.users.set(id,{
      pseudo :reg_pseudo,
      email : reg_email,
      id : id,
      password : reg_pass,
      role : role,
      poste : reg_poste,
      imageURL :  this.photo,
      evaluation_rendement : 0

    }

  ).then(data =>{
  console.log(" user registred !")
  let toast = this.toastCtrl.create({
    message:  'user was added successfully',
    duration: 3000,
    position : "middle"
  });
 // toast.present();
  //this.cancel();this.gotoRegistreinterface();


  });
  }
  
  this.personne.set(id,{
    pseudo : reg_pseudo,
    role : role,  
    //imageURL :  this.photo
  });

}

registre(reg_pseudo,reg_email,reg_pass,reg_poste,reg_role){
  //this.test  = true;


  this.onChange(this.selectedValue);
  console.log("Selected:",this.selectedValue);

  {
    this.registre_with_email_password(reg_pseudo,reg_email,reg_pass,reg_poste,reg_role,this.selectedValue)

  }

//this.registred = true;

}

/*login_validation (login_username,login_password){
  if(login_username ==null ||
  login_password ==null ){
    console.log("some fields are empty !!!");
      
      return false;
  }
  else {
      console.log("true");
      return true;
    }
}
*/

login(login_username,login_password){

  /* if(this.login_validation (login_username,login_password)){*/
   let loader = this.loadingCtrl.create({
     content: "Please wait...",
     spinner : "dots"
   
   });
   loader.present();
 

this.fauth.auth.signInWithEmailAndPassword(login_username,login_password)
     .then(data =>{
 
      setTimeout(() => {
       // this.navCtrl.setRoot(AdminPage);
     //  console.log("befor testing state changed ! !")
      // this.fauth.auth.onAuthStateChanged(user => {
       
        //  console.log("user logged in !")
        //  console.log(user);
    //   if (user) {

        /*  let Personnes = this.fire.list(`/personne/${this.userData.uid}`).valueChanges().subscribe(data => {
            this.personnes = data;
             this.pseudo=this.personnes[0];
             this.role= this.personnes[1];
            
             console.log(" shiit 1:"+this.pseudo+" "+this.role)
             console.log("userData.uid : "+this.userData.uid)
            Personnes.unsubscribe();
          });  */
      /*  } else {
          console.log("error of login")
       //   this.rootPage= HomePage;
         
        }*/
   
     // });
      
   /* if(role=="user") interface_name="utilisateur"
        else interface_name="administrateur"*/
      //  console.log(" shiit 2:"+this.pseudo+" "+this.role)
      


      // this.event.publish('user:login',"admin",interface_name);
      var thisUser = firebase.auth().currentUser;
      console.log("get curr user :"+thisUser);

      let Personne = this.fire.list(`/personne/${thisUser.uid}`).valueChanges().subscribe(data => {
        this.personneConnected = data;
        this.pseudoPersonne=this.personneConnected[0];
        this.rolePersonne=this.personneConnected[1];
      //  this.thisUserAdminsPassword=this.thisUserAdmins[2];
     //   console.log("user in app.component.ts:"+this.personne)
     console.log("in homePage :personConnected "+this.personneConnected+" pseudoPersonne : "+ this.pseudoPersonne+" rolePersonne :"+this.rolePersonne)
     this.event.publish("sendDataToLogin",this.personneConnected)
     Personne.unsubscribe();
      });
      
       
this.event.subscribe("sendDataToLogin",(data)=>{
 
if(data[1]=="admin") {this.interface_name="Administrateur"}
else {this.interface_name="Utilisateur"}

  this.event.publish('user:login',data[1],data[0],this.interface_name);
  console.log(data[1],data[0], "administrateur")
})
     
      this.navCtrl.setRoot(AdminPage);

          let toast = this.toastCtrl.create({
            message: 'Welcome '+login_username,
            duration: 2000,
            position : "middle"
          });
         // toast.present();

      loader.dismiss();
      }, 1000);

     }).catch(error =>{
       //loader.dismiss();
       setTimeout(() => {
 
         console.log('login error ',error);
         //test_password_validation = false;
         let alert = this.alertCtrl.create({
           title: 'Error!',
           subTitle: `error happened, ${error.message}`,
           buttons: ['CANCEL']
         });
         alert.present();

       loader.dismiss();
      }, 1000);
        
        // return false;
   
       })
   /*  }
   else {
             //console.log("error !");
         let alert = this.alertCtrl.create({
           title: 'Oupss!',
           subTitle: 'il faut remplir tous les champs !',
           buttons: ['OK']
         });
         alert.present();
   }
 */
 
 /*
 
       console.log('login error');
         let alert = this.alertCtrl.create({
           title: 'Error!',
           subTitle: 'wrong email or password !!',
           buttons: ['OK']
         });
         alert.present();
     }
   })
       
     }catch(e){
       console.log(e);
     }*/
 
    // this.registred = false;
   
this.registred = false;

}
resetPassword(){
  const prompt = this.alertCtrl.create({
    title: 'Réinitialisation du mot de passe',
    message: "Saisir votre email pour récupérer votre mot de passe",
    inputs: [
      {
        name: 'email',
        placeholder: 'Email',
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
          console.log("email to reset password "+data)

        }
      },
      {
        text: 'Save',
        handler: data => {
          this.sendReset(data)
          console.log("email to reset password "+data)
        }
      }
    ]
  });
  prompt.present();
}
sendReset(data) {
  let toast = this.toastCtrl.create({
    message: 'Un email de réinitialisation du mot de passe a été envoyé. Vérifiez votre boîte de réception!',
    duration: 3000
  });
  toast.present();
  /*
  firebase.auth().sendPasswordResetEmail(data).then(data =>{


    let toast = this.toastCtrl.create({
      message: 'Un email de réinitialisation du mot de passe a été envoyé. Vérifiez votre boîte de réception!',
      duration: 3000
    });
    toast.present();
  }).catch(error =>{
    let alert = this.alertCtrl.create({
      title : "error",
      subTitle: 'Un problème est survenu lors de la réinitialisation de votre mot de passe. Veuillez réessayer!',
      buttons: ['OK']
    });
    alert.present();
  })*/

}
 cancel(){
    this.registred = false;

   this.reg_pseudo = null;
   this.reg_email= null;
   this.reg_pass = null;
   this.reg_poste = null;
    this.reg_role  = null;
    this.selectedValue= null;

    this.login_username = null;
    this.login_password = null;
    this.profilePicture ="http://www.stpaulusbc.org/content/images/no-profile.png"


    
  }
  gotoRegistreinterface(){
    this.registred = true;
  
  }
  onChange(selectedValue){
    
    this.selectedValue=selectedValue;
    this.test = false ;
    console.log("Selected:",this.selectedValue);
  }
   gotoAdmininterface(){
    /*this.user.test=true  
    console.log(this.user.test)*/
  /*  this.navCtrl.setRoot(AdminPage);
    
    this.user.test=true;
    console.log("test : "+this.user.test);*/
   /* console.log("value1 in home.ts : "+this.provider.getMyGlobalVar());
    this.provider.setMyGlobalVar(false);
    console.log("value2 in home.ts : "+this.provider.getMyGlobalVar());
*//* this.navCtrl.push(AdminProfilPage)
  this.event.publish('hello',"ahmed")*/
 // this.event.publish('user:login',"user","utilisateur");


    this.event.publish('user:login',"admin","","administrateur");
    
       this.navCtrl.setRoot(AdminPage);


  //this.fauth.authState.subscribe(data =>{console.log(data.email)})
  // this.logout();

 
  
  }
  gotoUserinterface(){
    this.event.publish('user:login',"user","","utilisateur");
    this.navCtrl.setRoot(AdminPage);
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
      this.fauth.auth.logout();
    }*/

  ionViewWillLeave() {

  /*    let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: `Looks like I'm about to leave :(`,
        buttons: ['CANCEL']
      });
      alert.present();*/
     // console.log("Looks like I'm about to leave :(");
 

    
  }
}
