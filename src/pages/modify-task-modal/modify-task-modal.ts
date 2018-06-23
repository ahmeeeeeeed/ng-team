import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, Events, ViewController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Provider } from '../../providers/provider/provider';
import * as firebase from 'firebase';

/**
 * Generated class for the ModifyTaskModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modify-task-modal',
  templateUrl: 'modify-task-modal.html',
})
export class ModifyTaskModalPage {
  currusername: any;
  userRole: any;
  titre : any;
  description: any;
  estim_time : any;
  tache_a_faire: AngularFireList<any>;
  demandes: AngularFireList<any>;
  constructor(public navCtrl: NavController,
              public navParams : NavParams,
              private fire : AngularFireDatabase,
              public toastCtrl: ToastController,
              public alertCtrl :AlertController,
              public fauth : AngularFireAuth,
              public loadingCtrl: LoadingController,
              public provider : Provider,
              public event : Events,
              public viewCtrl : ViewController) 
  {
    this.tache_a_faire = fire.list('/taches/à faire');
    this.demandes = fire.list('/demandes');


    var currentUser = firebase.auth().currentUser;
      let Personne = this.fire.list(`/personne/${currentUser.uid}`).valueChanges().subscribe(data => {
  
          this.currusername=data[0]
          this.userRole=data[1];
          this.event.publish("getting user name")
    
      Personne.unsubscribe()
      });
      this.event.subscribe("getting user name",()=>{
        console.log("1-- user name :"+this.currusername,this.userRole);
      })

  }

  ionViewDidLoad() {
    var id = this.navParams.get("id");
    var role = this.navParams.get("role"); 

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
    
    loader.present();
    firebase.database().ref(`/taches/à faire/${id}`).on('value', resp => {

    let tache_a_faire = this.fire.list(`/taches/à faire/${id}`).valueChanges().subscribe(data => {
    //data[0] : date_creaiton
    //data[1] : description
    //data[2] : id 
    //data[3] : temps_estime
    //data[4] : titre
    //data[5] : user    
      this.description= data[1]
      this.estim_time = data[3]
      this.titre = data[4]
     // this.event.publish("get task title")
 });

  loader.dismiss();

});
 console.log(this.titre)
 // tache_a_faire.unsubscribe()
  }

updateTask(titre,description,estim_time){

  
  var id = this.navParams.get("id");
  var role = this.navParams.get("role");


    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner : "dots"
    
    });
    loader.present(); 

    if(role=="user"){//envoyer une demande

      let date_envoie =  new Date().toString();
      var currentUserId = firebase.auth().currentUser.uid;

      let tache_a_faire = this.fire.list(`/taches/à faire/${id}`).valueChanges().subscribe(data => {
        this.titre = data[4]

        console.log(this.titre)

      this.demandes.push({

        date_envoie : date_envoie,
        etat : "non lu",
        id_tache : id,
        nom_tache : this.titre,
        modification : {titre,description,estim_time},
        id_demandeur : currentUserId,
        pseudo_demandeur: this.currusername,
        type : "modification"
      
      }

      ).then(data =>{

        this.demandes.update(data.key,{id : data.key})
        .then(data =>{
          let toast = this.toastCtrl.create({
            message: 'une demande sera envoyée aux administrateurs !',
            duration: 2000,
            position : "bottom"
          });
          toast.present();

          loader.dismiss();
        })//update
  
    });//push

 });//valueChanges.subscribe

  }else{
    this.tache_a_faire.update(id, {
      titre :titre,
      description : description,
      temps_estime : estim_time,
    }).then(data =>{
      let toast = this.toastCtrl.create({
        message: 'tache a été midifié avec succés !',
        duration: 2000,
        position : "bottom"
      });
      toast.present();

      loader.dismiss();
    })
  }//else

}

  onClose(){
    this.viewCtrl.dismiss();
    
  }
}
