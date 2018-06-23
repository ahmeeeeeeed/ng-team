import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events ,AlertController, LoadingController, ToastController, ModalController, ModalOptions, Slides, ActionSheetController } from 'ionic-angular';
import {AngularFireList,AngularFireDatabase,} from 'angularfire2/database';
import { Observable ,} from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { Provider } from '../../providers/provider/provider';
import { AdminPage } from '../admin/admin';
import { AddTaskModalPage } from '../add-task-modal/add-task-modal';
import { ModifyTaskModalPage } from '../modify-task-modal/modify-task-modal';
import { ListTaskDiscussPage } from '../list-task-discuss/list-task-discuss';
import { error } from '@firebase/database/dist/esm/src/core/util/util';


/**
 * Generated class for the UsertachesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-taches',
  templateUrl: 'admin-taches.html',
})



export class AdminTachesPage {
  
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides ;

  SwipedTabsIndicator :any= null;
  tabs:any=[];

  TACHES_AFAIRE: Observable<any[]>;
  TACHES_ENCOURS: Observable<any[]>;
  TACHES_REALISEE: Observable<any[]>;

  

  taches_afaire: AngularFireList<any>;
  taches_encours: AngularFireList<any>;
  taches_realisee: AngularFireList<any>;

  users: AngularFireList<any>;

  currusername : any;
  userRole: any
  note : any;
  test : Array<any> = [1,2,3,4,5]

  old_Developer

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
   public fire : AngularFireDatabase,
   public event : Events,
   public fauth : AngularFireAuth,
   public alertCtrl: AlertController,
   public loadingCtrl: LoadingController,
   public toastCtrl: ToastController,
   public modalCtrl: ModalController,
   public actionSheetCtrl: ActionSheetController,
   public provider : Provider,

  ) {
    
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner: "dots"

    });
    loader.present();

    firebase.database().ref('/taches/').on('value', resp => {

      this.TACHES_AFAIRE = fire.list('/taches/à faire/').valueChanges();
      this.TACHES_ENCOURS = fire.list('/taches/en cours/').valueChanges();
      this.TACHES_REALISEE = fire.list('/taches/réalisées/').valueChanges()
      
        
  
      this.taches_afaire = fire.list('/taches/à faire');
      this.taches_encours = fire.list('/taches/en cours');
      this.taches_realisee = fire.list('/taches/réalisées');

      this.users = fire.list('/users'); 

  
      loader.dismiss();

    });

    

      this.tabs=["Tâches à faire","Tâches en cours","Tâches réalisées"];

      var currentUser = firebase.auth().currentUser;
      let Personne = this.fire.list(`/personne/${currentUser.uid}`).valueChanges().subscribe(data => {
  
          this.currusername=data[0]
          this.userRole=data[1];

          this.event.publish("getting user name")
    
      Personne.unsubscribe()
      });
      this.event.subscribe("getting user name",()=>{
        console.log("1-- user name :"+this.currusername);
      })
     
  }

  ionViewDidLoad() {


    console.log('ionViewDidLoad UsertachesPage');

    let Personne = this.fire.list('/taches/réalisées/-LAJuCMYqHUYOO70-P3V').valueChanges().subscribe(data => {
          
      this.note=data[6]
      
      this.event.publish("getting task note")
      
  
  Personne.unsubscribe()
  });
  this.event.subscribe("getting task note",()=>{
    console.log("2-- task note :"+this.note);
  })
  
  }
  addTask(){
   
    const modalOptions :ModalOptions = {
      enableBackdropDismiss : false
    };
    
       let addUserModal = this.modalCtrl.create(
        AddTaskModalPage,modalOptions);
       addUserModal.present();
    
    
    }
    
  modifyTask(id){
    const modalOptions :ModalOptions = {
      enableBackdropDismiss : false
    };
    let role = this.userRole; 
       let addUserModal = this.modalCtrl.create(
        ModifyTaskModalPage,{id,role},modalOptions);
       addUserModal.present(); 

  }
  
  deleteTask(id,titre){

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
  
     loader.present()
  //   setTimeout(()=>{
      this.taches_afaire.remove(id).then(data =>{
          let toast = this.toastCtrl.create({
            message: 'suppression a été effectuée avec succés !',
            duration: 2000,
            position : "bottom"
          });
          toast.present();
          loader.dismiss();

      });
   //  },1000)
    
  }
  evaluateDeveloper(id_tache,id_developer,note){
   // console.log(Math.floor((11+2) / 2))
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
    loader.present();
   // console.log(id_developer)
    let User = this.fire.list(`/users/${id_developer}`).valueChanges().subscribe(data => {
      var evaluation

      if (data[1] == 0) {//s'il n'est pas noté encore
        evaluation = note.value
      } else {//s'il est déjà noté
      
        evaluation = Math.floor((note.value -(- data[1])) /2)
        console.log(data[1],evaluation)
      }

      this.users.update(id_developer, {

        evaluation_rendement: evaluation
        //  evaluation_rendement : note.value

      }).then(() => {

        let toast = this.toastCtrl.create({
          message: `developpeur a été évalué !`,
          duration: 2000,
          position: "bottom"
        });
        toast.present();
        loader.dismiss();

      }).catch(error => {
        console.log(error.message)
        loader.dismiss();
      })

      User.unsubscribe()
    });
  
  }

  changeDeveloper(id,nom_tache,id_developer,old_developer,temps_estime){

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner: "dots"

    });

    this.provider.getUserListToChangeDeveloper();

    this.event.subscribe("get user data to changet",data => {

      loader.present();

    var date_debut =  new Date().toString();
  
    var date_limite_estime = new Date()

 //au lieu de faire + temps_estime , c'est bizarre !!!
    date_limite_estime.setHours( date_limite_estime.getHours() - (-temps_estime) )


      this.taches_encours.update(id, {
        proprietaire: data.pseudo,
        date_debut: date_debut,
        date_limite_estime: date_limite_estime,
        id_developer : data.id
      })//update
      .then(() => { 
          var message1=`un administrateur a chargé la réalisation de votre tâche ${nom_tache} à un autre developpeur`
          var message2=`un administrateur vous a chargé de réaliser la tâche ${nom_tache} dès maintenant !!`
          
          this.provider.sendNotification(id_developer,date_limite_estime,message1)
          this.provider.sendNotification(data.id,date_limite_estime,message2)
        
          let toast = this.toastCtrl.create({
            message: `${data.pseudo} et ${old_developer} seront notifiés !`,
            duration: 2000,
            position : "bottom"
          });
          toast.present();

          loader.dismiss();

        })//then
    })//subscribe

  }

stopTask(id,titre,description,date_creation,temps_estime,user){//suspendre
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
  
     loader.present()
     //setTimeout(()=>{
      this.taches_encours.remove(id).then(data =>{

        this.taches_afaire.set(id,{
    
          titre :titre,
          description : description,
          date_creation :date_creation ,
          temps_estime : temps_estime,
          user : user,
          id : id

          }).then(data =>{
            let toast = this.toastCtrl.create({
              message: 'suppression a été effectuée avec succés !',
              duration: 2000,
              position : "bottom"
            });
            toast.present();
            loader.dismiss();

          })//set.then      
      });//remove.then
   //  },1000)
  }
  

/********************slides indicator functions*******************/
  ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");
  }

  selectTab(index) {    
    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(100*index)+'%,0,0)';
    this.SwipedTabsSlider.slideTo(index, 500);
  }

  updateIndicatorPosition() {
      // this condition is to avoid passing to incorrect index
  	if( this.SwipedTabsSlider.length()> this.SwipedTabsSlider.getActiveIndex())
  	{
  		this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(this.SwipedTabsSlider.getActiveIndex() * 100)+'%,0,0)';
  	}
    
  }

  animateIndicator($event) {
  	if(this.SwipedTabsIndicator)
   	    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (($event.progress* (this.SwipedTabsSlider.length()-1))*100) + '%,0,0)';
  }
/******************************************************************/



  gotoAdminPage(){
    this.navCtrl.setRoot(AdminPage);
    this.event.publish('buttoncolor');
    //this.provider.gotoAdminPage();
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