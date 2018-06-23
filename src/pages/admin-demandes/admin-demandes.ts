import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, AlertController, ToastController } from 'ionic-angular';


import { AdminPage } from '../admin/admin';
import { ListTaskDiscussPage } from '../list-task-discuss/list-task-discuss';
import { Provider } from '../../providers/provider/provider';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';


/**
 * Generated class for the AdminDemandesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-demandes',
  templateUrl: 'admin-demandes.html',
})
export class AdminDemandesPage {

  date: Date;

  tab_tache = [];
  

  DEMANDES: Observable <any[]>;
  tache_a_faire: AngularFireList<any>;
  taches_encours: AngularFireList<any>;
  demandes: AngularFireList<any>;
  notifications: AngularFireList<any>;


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

            ) 
  {
      this.date =  new Date()
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        spinner: "dots"
  
      });
      loader.present();
  
     
      firebase.database().ref('/demandes/').on('value', resp => {
        this.DEMANDES = fire.list('/demandes').valueChanges()
        
        loader.dismiss();
      });
      this.tache_a_faire = fire.list('/taches/à faire');
      this.taches_encours = this.fire.list('/taches/en cours');

      this.demandes = fire.list('/demandes');

      this.notifications = fire.list('/notifications');


  }
  checkDatabase(id){
    firebase.database().ref(`/taches/à faire/${id}`).on('value', resp => {})
  }

  confirmation(id_demande,id_tache,nom_tache,type,pseudo_demandeur,modification,id_demandeur){
    var desc;
    var estime
    this.checkDatabase(id_tache)
    firebase.database().ref(`/taches/à faire/${id_tache}`).on('value', resp => {
      this.tab_tache = [];
  
      this.tab_tache = snapshotToArray(resp);
      console.log(this.tab_tache)
   });//database().ref() 

   
   for(let tache of this.tab_tache)
   {
    desc = tache.description;
    estime = tache.temps_estime
    
   }
   console.log(desc)

    if(type=="modification"){
  

    let confirm = this.alertCtrl.create({
      title: 'Demande de modification',
      message: `modification du titre de ${nom_tache} à ${modification.titre} , descrption de ${desc} à ${modification.description} , periode estimée de ${estime} à ${modification.estim_time}`,
      buttons: [
        {
          text: 'Accepter',
          handler: () => {
            this.acceptModification(id_demande,id_tache,nom_tache,type,pseudo_demandeur,modification,id_demandeur)
          }
        },
        {
          text: 'Refuser',
          handler: () => {
            this.refuseModification(id_demande,id_tache,nom_tache,type,pseudo_demandeur,modification,id_demandeur)
          }
        }
      ]
    });
    confirm.present();

  }else{
    let confirm = this.alertCtrl.create({
      title: 'Demande de suspension',
      message: pseudo_demandeur+"a demandé de suspendre la tache "+nom_tache,
      buttons: [
        {
          text: 'Accepter',
          handler: () => {
            this.acceptSuspension(id_demande,id_tache,nom_tache,type,pseudo_demandeur,modification,id_demandeur)
          }
        },
        {
          text: 'Refuser',
          handler: () => {
            this.refuseSuspension(id_demande,id_tache,nom_tache,type,pseudo_demandeur,modification,id_demandeur)
          }
        }
      ]
    });
    confirm.present();
  }


  }

  acceptModification(id_demande,id_tache,nom_tache,type,pseudo_demandeur,modification,id_demandeur){

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
    loader.present();
    
    this.tache_a_faire.update(id_tache, {
      titre :modification.titre,
      description : modification.description,
      temps_estime : modification.estim_time,
    }).then(data =>{

      this.demandes.update(id_demande, {etat : "lu"})

    }).then(data =>{
      var content = `votre demande de modification la tâche ${nom_tache} est acceptée`
      this.sendNotification(id_demandeur,this.date,content);

      let toast = this.toastCtrl.create({
        message: `Le tache a été modifiée avec succés ,un message d'acceptation sera envoyé à ${pseudo_demandeur}`,
        duration: 3000,
        position : "bottom"
      });
      toast.present();

      loader.dismiss();
    })


  }

  refuseModification(id_demande,id_tache,nom_tache,type,pseudo_demandeur,modification,id_demandeur){

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
    loader.present();
    
    this.demandes.update(id_demande, 
      {etat : "lu"}
      ).then(data =>{
        var content = `votre demande de modification la tâche ${nom_tache} est réfusée`

        this.sendNotification(id_demandeur,this.date,content);

        let toast = this.toastCtrl.create({
          message: `Demande réfusée , un message d'information sera envoyé à ${pseudo_demandeur}`,
          duration: 3000,
          position: "bottom"
        });
        toast.present();

        loader.dismiss();
      })

  }

  acceptSuspension(id_demande,id_tache,nom_tache,type,pseudo_demandeur,modification,id_demandeur){

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
    loader.present();
    
    let Tache = this.fire.list(`/taches/en cours/${id_tache}`).valueChanges().subscribe(data => {

    //  console.log(data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8])
      var titre = data[7];
      var description = data[3];
      var date_creation = data[0];
      var temps_estime = data[2];
      var user = data[8]
     
    this.taches_encours.remove(id_tache).then(data => {

      this.tache_a_faire.set(id_tache, {

        titre: titre,
        description: description,
        date_creation: date_creation,
        temps_estime: temps_estime,
        user: user,
        id: id_tache

      }).then(data => {
        this.demandes.update(id_demande, {etat : "lu"})
        var content = `votre demande de suspension la tâche ${nom_tache} est acceptée`

        this.sendNotification(id_demandeur,this.date,content);


        let toast = this.toastCtrl.create({
          message: `suppression a été effectuée avec succés , un message d'acceptation sera envoyé à ${pseudo_demandeur}`,
          duration: 3000,
          position: "bottom"
        });
        toast.present();

        loader.dismiss();
      })//set
    });//remove

    Tache.unsubscribe()
  });

  }
  refuseSuspension(id_demande,id_tache,nom_tache,type,pseudo_demandeur,modification,id_demandeur){

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
    loader.present();
    
    this.demandes.update(id_demande, 
      {etat : "lu"}
      ).then(data =>{
        var content = `votre demande de suspension la tâche ${nom_tache} est réfusée`

        this.sendNotification(id_demandeur,this.date,content);


        let toast = this.toastCtrl.create({
          message: `Demande réfusée , un message d'information sera envoyé à ${pseudo_demandeur}`,
          duration: 3000,
          position: "bottom"
        });
        toast.present();

        loader.dismiss();
      })
  }
  
sendNotification(receiver_id,date,content){
  let date_env =  new Date().toString();

  this.notifications.push({ 

    receiver_id : receiver_id,
    date : date_env,
    content : content

  }).then(data => {

    this.notifications.update(data.key, { id: data.key })

  });//push
}
  ionViewDidLoad() {
  //  this.provider.updateWeek(4)  
  }
  gotoAdminPage(){
    // this.provider.gotoAdminPage();
    this.navCtrl.setRoot(AdminPage);  
    this.event.publish('buttoncolor');
   }
   goToChatList(){
    this.navCtrl.push(ListTaskDiscussPage)
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