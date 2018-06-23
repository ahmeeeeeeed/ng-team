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


/**
 * Generated class for the UsertachesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-usertaches',
  templateUrl: 'usertaches.html',
})
export class UsertachesPage {
  
  
  
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides ;

  SwipedTabsIndicator :any= null;
  tabs:any=[];

  TACHES_AFAIRE: Observable<any[]>;
  TACHES_ENCOURS: Observable<any[]>;
  TACHES_REALISEE: Observable<any[]>;

  taches_afaire: AngularFireList<any>;
  taches_encours: AngularFireList<any>;
  taches_realisee: AngularFireList<any>;

  demandes: AngularFireList<any>;

  statistiques_bar: AngularFireList<any>;


  currusername : any;
  userRole : any;
  note : any;
  titre: any;
  test : Array<any> = [1,2,3,4,5]

  id_Doughnut = "LDRvAXTErUGZOhwIkqM"
  userId = firebase.auth().currentUser.uid;


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
  

      this.tabs=["Tâches à faire","Tâches en cours","Tâches réalisées"];

    var currentUser = firebase.auth().currentUser;
    let Personne = this.fire.list(`/personne/${currentUser.uid}`).valueChanges().subscribe(data => {

      this.currusername = data[0]
      this.userRole = data[1];
      this.event.publish("getting user name")

      Personne.unsubscribe()
    });
    this.event.subscribe("getting user name", () => {
      console.log("1-- user name :" + this.currusername, this.userRole);
    })

     
  }
  

  ionViewDidLoad() {
   /*var time :  number = new Date().valueOf()
   console.log(time)
   console.log(new Date(1529189254960).getMinutes())*/

 //this.provider.recieveNotification();

   /* this.statistiques_bar = this.fire.list('/statistiques/Line');


    this.statistiques_bar.push({
    
      semaine_1 : {nb_tache : 8, temps_realisation : 20},
      semaine_2 : {nb_tache : 9, temps_realisation : 22},
      semaine_3 : {nb_tache : 10, temps_realisation : 26},
      semaine_4 : {nb_tache : 5, temps_realisation : 13},

     
  }

    ).then(data =>{

    this.statistiques_bar.update(data.key,{id : data.key})
   
});//push.then*/


    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner: "dots"

    });
    loader.present();
    //readed so many times !!!

    firebase.database().ref('/taches/').on('value', resp => {

      this.TACHES_AFAIRE = this.fire.list('/taches/à faire/').valueChanges();
      this.TACHES_ENCOURS = this.fire.list('/taches/en cours/').valueChanges();
      this.TACHES_REALISEE = this.fire.list('/taches/réalisées/').valueChanges()
      
        
  
      this.taches_afaire = this.fire.list('/taches/à faire');
      this.taches_encours = this.fire.list('/taches/en cours');
      this.taches_realisee = this.fire.list('/taches/réalisées');

      this.demandes = this.fire.list('/demandes');

     // this.statistiques_Doughnut = this.fire.list('/statistiques/Doughnut');

  
      loader.dismiss();

    });



    console.log('ionViewDidLoad UsertachesPage');
/*
    let Personne = this.fire.list('/taches/réalisées/-LAJuCMYqHUYOO70-P3V').valueChanges().subscribe(data => {
          
      this.note=data[6]
      
      this.event.publish("getting task note")
      
  
  Personne.unsubscribe()
  });
  this.event.subscribe("getting task note",()=>{
    console.log("2-- task note :"+this.note);
  })
  */
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
  /*
  deleteTask(id,titre){

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
  
     loader.present()
     setTimeout(()=>{
      this.taches_afaire.remove(id).then(data =>{
          let toast = this.toastCtrl.create({
            message: 'suppression a été effectuée avec succés !',
            duration: 2000,
            position : "bottom"
          });
          toast.present();
      });
      loader.dismiss();
     },1000)
    
  }*/

chooseTask(id,titre,description,date_creation,temps_estime,creator_user){
  let loader = this.loadingCtrl.create({
    content: "Please wait...",
    spinner : "dots"
  
  });
  
  loader.present();

    let date_debut =  new Date().toString();
    let dateDebut =  new Date()
  
  
    let date_limite_estime = new Date()


 //au lieu de faire + temps_estime , c'est bizarre !!!
    date_limite_estime.setHours( date_limite_estime.getHours() - (-temps_estime) )
 var time = date_limite_estime.valueOf()
   // console.log(new Date(time))
    var userId = firebase.auth().currentUser.uid;

    this.taches_encours.push({
    
        titre :titre,
        description : description,
        date_creation :date_creation ,
        date_debut : date_debut,
        date_debut_info : {day : dateDebut.getDay(), hour : dateDebut.getHours()},
        temps_estime : temps_estime,
        date_limite_estime : date_limite_estime.toString(),
        createur : creator_user,
        proprietaire :  this.currusername,
        id_developer : userId
    }

    ).then(data =>{

      this.taches_encours.update(data.key,{id : data.key})
      .then(data =>{

          this.taches_afaire.remove(id).then(data => {
            this.provider.statistiquesDoughnutUpdate();

            let toast = this.toastCtrl.create({
              message: 'suppression a été effectuée avec succés !',
              duration: 2000,
              position: "bottom"
            });
            //toast.present();
          });

        var message = `vous avez depassé la periode estimé pour la réalisation de la tâche ${titre}`
        this.provider.sendNotification(userId,time,message)

        

        console.log(" task added !")
        let toast = this.toastCtrl.create({
        message:  `Vous avez commancer à developper la tâche ${titre}`,
        duration: 3000,
        position : "bottom"
        });
        toast.present();
        loader.dismiss();

      })//update
    
  });//push.then
/*  this.taches_afaire.remove(id).then(data =>{
          this.provider.statistiquesUpdate();

    let toast = this.toastCtrl.create({
      message: 'suppression a été effectuée avec succés !',
      duration: 2000,
      position : "bottom"
    });
    //toast.present();
});*/


}

stopTask(id,titre,description,date_creation,temps_estime,user){//suspendre
  
  var currentUser = firebase.auth().currentUser;

 
  let tache_a_faire = this.fire.list(`/taches/en cours/${id}`).valueChanges().subscribe(data => {
    //data[0] : date_creaiton
    //data[1] : description
    //data[2] : id 
    //data[3] : temps_estime
    //data[4] : titre
    //data[5] : user    

      this.titre = data[4]
      this.event.publish("get task title",titre)
      tache_a_faire.unsubscribe()
 });


  
  let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
  
     loader.present()

  if (this.userRole == "user") {//envoyer une demande

    let date_envoie = new Date().toString();
    var currentUserId = firebase.auth().currentUser.uid;

this.event.subscribe("get task title",(titre)=>{
this.titre=titre;
    
    this.demandes.push({ 

      date_envoie: date_envoie,
      etat: "non lu",
      id_tache: id,
      nom_tache : this.titre,
      id_demandeur: currentUserId,
      pseudo_demandeur: this.currusername,
      type: "suspension"

    }).then(data => {

      this.demandes.update(data.key, { id: data.key })
        .then(data => {

          this.provider.statistiquesDoughnutUpdate();

          let toast = this.toastCtrl.create({
            message: 'une demande sera envoyée aux administrateurs !',
            duration: 2000,
            position: "bottom"
          });
          toast.present();

          loader.dismiss();
        })//update

    });//push

  })//event.subscribe

  } else {

    this.taches_encours.remove(id).then(data => {

      this.taches_afaire.set(id, {

        titre: titre,
        description: description,
        date_creation: date_creation,
        temps_estime: temps_estime,
        user: user,
        id: id

      }).then(data => {

        this.provider.statistiquesDoughnutUpdate();

        let toast = this.toastCtrl.create({
          message: 'suppression a été effectuée avec succés !',
          duration: 2000,
          position: "bottom"
        });
        toast.present();

        loader.dismiss();
      })//set
    });//remove
   

 }
 //console.log(this.userRole);
   
}

  endTask(id,titre,description,date_creation,date_debut,date_debut_info,temps_estime,user,note){//terminer
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
    
    loader.present();

    let date_finition =  new Date().toString();
    var periode_dev = 0;
    let date = new Date()
    let diffDay = date.getDay() - date_debut_info.day 
    let diffHour = date.getHours() - date_debut_info.hour

   /* if (diffDay<0)
    {
      diffDay=diffDay + 7;
    }

    if (diffHour<0)
    {
      diffHour=diffHour + 24;
    }*/

    if(diffDay==0 && diffHour >=0){//dans le meme jours
       periode_dev = diffHour;
       console.log("condition 1 : "+periode_dev)
    }
    else if(diffDay ==1 && diffHour <0 ){//moin de 24h dans le deuxieme jours
      diffHour=diffHour + 24;
      periode_dev = diffHour;
       console.log("condition 2 ")
    }
    else if(diffDay >=1 && diffHour >= 0){// plus que 1 jours
        periode_dev = diffDay*24 + diffHour
        console.log("condition 3 ")
    }
    else if(diffDay >=1 && diffHour < 0){// plus que 1 jours
        periode_dev = diffDay*24 + diffHour
        console.log("condition 4 :")
    }
    else if(diffDay <0 && diffHour <0 ){//moin que une semaine 
        diffDay=diffDay + 7;
        periode_dev= (diffDay)*24 + diffHour
        console.log("condition 5 ")
    }
    else if(diffDay <0 && diffHour >=0 ){//presque une semaine 
        diffDay=diffDay + 7;
        periode_dev= (diffDay)*24 + diffHour
        console.log("condition 6 ")
    }
    else if(diffDay == 0 && diffHour <0 ){//presque ou une semaine exactement
      periode_dev= 7*24 + diffHour
      console.log("condition 7 ")
  }

  console.log("periode de dev : "+ periode_dev)

  var userId = firebase.auth().currentUser.uid;

    this.taches_encours.remove(id).then(data =>{
          this.taches_realisee.set(id,{
            
            titre :titre,
            description : description,
            date_creation :date_creation ,
            date_debut : date_debut,
            temps_estime : temps_estime,
            date_finition : date_finition,
            periode_dev : periode_dev,
            developpeur :  this.currusername,
            note: note,
            createur : user,
            id_developer : userId
        }

        ).then(data =>{
          

         /* this.taches_realisee.update(data.key,{id : data.key})
          .then(data =>{*/

        //   this.taches_encours.remove(id)

        this.provider.statistiquesDoughnutUpdate();
        this.provider.updateWeek(periode_dev);
        this.provider.statistiquesBar(this.currusername,id,titre,temps_estime,periode_dev);
        
        loader.dismiss();



          console.log(" task ended !")
            let toast = this.toastCtrl.create({
            message:  `vous avez termié la tâche ${titre}`,
            duration: 1500,
            position : "bottom"
            });
            toast.present();
          })//set.then

        
    })//remove.then
    


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
   }


}
