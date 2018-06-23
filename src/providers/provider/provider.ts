

import { Component, Injectable ,ViewChild} from '@angular/core';
import { Nav,NavController, AlertController,ToastController,LoadingController, Events , } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import {AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {AngularFireList,AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { HttpClientModule } from '@angular/common/http'; 
import { Http ,HttpModule} from '@angular/http' ;
import * as firebase from 'firebase';


import { AdminPage } from '../../pages/admin/admin';
import { HomePage } from '../../pages/home/home';
import { StatByUserPage } from '../../pages/stat-by-user/stat-by-user';


@Injectable()
export class Provider {
  currusername: {};
    @ViewChild(Nav) nav: Nav;
  
    reg_pseudo=null;
    reg_email=null;
    reg_pass =null;
    reg_role =null;
    reg_poste =null;
    login_username = null;
    login_password = null;
    
  /*  users: AngularFireList<any>;
    admins: AngularFireList<any>;*/

    navCtrl : NavController = null;

 myGlobalVar : boolean = false ;

 statistiques_Doughnut: AngularFireList<any>;
 statistiques_line: AngularFireList<any>;
 statistiques_bar: AngularFireList<any>;
 notifications: AngularFireList<any>;




 id_Doughnut = "LDRvAXTErUGZOhwIkqM"
 id_line = "-LDbqK8ayLf5ZxKU7e8B"

 tab_stat_line = [];
 tab_list_user = [];

 

 constructor(public fire : AngularFireDatabase,
            public fauth : AngularFireAuth,
            public event : Events,
            public alertCtrl: AlertController,



             
           /* public fauth : AngularFireAuth,
            public alertCtrl :AlertController,
            private fire : AngularFireDatabase,
          //  public navCtrl: NavController,
            public toastCtrl: ToastController,
            public loadingCtrl: LoadingController*/
  ){
    this.statistiques_Doughnut = this.fire.list('/statistiques/Doughnut');
    this.statistiques_line = this.fire.list('/statistiques/Line');
    this.notifications = fire.list('/notifications');

    //this.statistiques_bar = this.fire.list('/statistiques/Bar');
    //var username = this.getCurrentUser()
   // this.statistiques_bar = this.fire.list(`/statistiques/Bar/${username}`);

 }

  initialization(admins,users){
  users = this.fire.list('/users');
  admins = this.fire.list('/admins');
  }

  setMyGlobalVar(value) { 
    this.myGlobalVar = value; 
    }
    
    getMyGlobalVar() { 
    return this.myGlobalVar; 
    } 
  getCurrentUser(){

    var currentUser = firebase.auth().currentUser;
    console.log(currentUser)
    let Personne = this.fire.list(`/personne/${currentUser.uid}`).valueChanges().subscribe(data => {

        this.currusername=data[0]
        this.event.publish("getting user name",this.currusername)
  
    Personne.unsubscribe()
    });
    this.event.subscribe("getting user name",(curruser)=>{

        console.log("1-- user name :"+curruser);
        return curruser;
  
    })
    
  }
  getCurrentUserRole(){

    var currentUser = firebase.auth().currentUser;
    let Personne = this.fire.list(`/personne/${currentUser.uid}`).valueChanges().subscribe(data => {

        var curruserRole=data[1]
       
        console.log("1-- user role :"+curruserRole);
        return curruserRole;
   
    });
  }

  statistiquesDoughnutUpdate(){

    let TACHES_AFAIRE = this.fire.list('/taches/à faire/').valueChanges().subscribe(data => {
      
      this.statistiques_Doughnut.update(this.id_Doughnut,{
        taches_a_faire : data.length
      })
     })
     let TACHES_ENCOURS = this.fire.list('/taches/en cours/').valueChanges().subscribe(data => {
      this.statistiques_Doughnut.update(this.id_Doughnut,{
        taches_encours : data.length
      })
     })
     let TACHES_REALISEE = this.fire.list('/taches/réalisées/').valueChanges().subscribe(data => {
      this.statistiques_Doughnut.update(this.id_Doughnut,{
        taches_realisées: data.length
      })

     })
  
  }
  updateWeek(temps_realisation){

    var semaine_1 = {nb_tache : 0,temps_realisation : 0}
    var semaine_2 = {nb_tache : 0,temps_realisation : 0}
    var semaine_3 = {nb_tache : 0,temps_realisation : 0}
    var semaine_4 = {nb_tache : 0,temps_realisation : 0}
  
    firebase.database().ref('/statistiques/Line').on('value', resp => {
      this.tab_stat_line = [];
  
      this.tab_stat_line = snapshotToArray(resp);
      for(let stat of this.tab_stat_line){
    
        semaine_1.nb_tache = stat.semaine_1.nb_tache
        semaine_2.nb_tache = stat.semaine_2.nb_tache
        semaine_3.nb_tache = stat.semaine_3.nb_tache
        semaine_4.nb_tache = stat.semaine_4.nb_tache

        semaine_1.temps_realisation = stat.semaine_1.temps_realisation
        semaine_2.temps_realisation = stat.semaine_2.temps_realisation
        semaine_3.temps_realisation = stat.semaine_3.temps_realisation
        semaine_4.temps_realisation = stat.semaine_4.temps_realisation
      }
      console.log("1- "+semaine_1.nb_tache+" "+semaine_2.nb_tache+" "+semaine_3.nb_tache+" "+semaine_4.nb_tache)
      console.log("1- "+semaine_1.temps_realisation+" "+semaine_2.temps_realisation+" "+semaine_3.temps_realisation+" "+semaine_4.temps_realisation)


   });//database().ref() 

   console.log("2- "+semaine_1.nb_tache+" "+semaine_2.nb_tache+" "+semaine_3.nb_tache+" "+semaine_4.nb_tache)
   console.log("2- "+semaine_1.temps_realisation+" "+semaine_2.temps_realisation+" "+semaine_3.temps_realisation+" "+semaine_4.temps_realisation)
  
   let date = new Date().getDate()
   if(date>=1 && date <=7){
     semaine_1.nb_tache++;
     semaine_1.temps_realisation=semaine_1.temps_realisation+temps_realisation
   }
   else if(date>7 && date <=14){
     semaine_2.nb_tache++;
     semaine_2.temps_realisation=semaine_2.temps_realisation+temps_realisation

   }
   else if(date>14 && date <=21){
     semaine_3.nb_tache++;
     semaine_3.temps_realisation=semaine_3.temps_realisation+temps_realisation

   }
   else { 
     semaine_4.nb_tache++;
     semaine_4.temps_realisation=semaine_4.temps_realisation+temps_realisation

   }

   this.statistiques_line.update(this.id_line,{
    semaine_1 : semaine_1,
    semaine_2 : semaine_2,
    semaine_3 : semaine_3,
    semaine_4 : semaine_4,
   }) 
 }

 statistiquesBar(pseudo,id_tache,titre,temps_estime,periode_dev){
   
  this.statistiques_bar = this.fire.list(`/statistiques/Bar/${pseudo}`);
 
  this.statistiques_bar.set(id_tache,{
    titre : titre,
    temps_estime : temps_estime,
      periode_dev : periode_dev
  })

//deuxieme methode !

  /*let newData = firebase.database().ref(`/statistiques/Bar/${pseudo}`).push();
  newData.set({
    temps_estime : temps_estime,
      periode_dev : periode_dev
  })*/
 }



getUserList(){

  firebase.database().ref('/users/').on('value', resp => {
    this.tab_list_user = [];

    this.tab_list_user = snapshotToArray(resp);

 });//database().ref() 

  let alert = this.alertCtrl.create();
  alert.setTitle('Liste des utilisateurs');

  for(let user of this.tab_list_user){
  
    alert.addInput({
      type: 'radio',
      label: user.pseudo,
      value:  user,
    });
  }

  alert.addButton({
    text: 'OK',
    handler: data => {
      this.event.publish("get user data in stat",data)
    //  console.log(data)
 
    }
  });
  alert.present();

}
getUserListToChangeDeveloper(){
  firebase.database().ref('/users/').on('value', resp => {
    this.tab_list_user = [];

    this.tab_list_user = snapshotToArray(resp);

 });//database().ref() 

  let alert = this.alertCtrl.create();
  alert.setTitle('Liste des utilisateurs');

  for(let user of this.tab_list_user){
  
    alert.addInput({
      type: 'radio',
      label: user.pseudo,
      value:  user,
    });
  }

  alert.addButton({
    text: 'OK',
    handler: data => {
      this.event.publish("get user data to change",data)
    //  console.log(data)
 
    }
  });
  alert.present();
}

sendNotification(receiver_id,date,content){
  let date_env =  new Date().toString();

  this.notifications.push({ 

    receiver_id : receiver_id,
    date : date_env,
    content : content,
    date_limite_estime : date

  }).then(data => {

    this.notifications.update(data.key, { id: data.key })

  });//push
}
recieveNotification(){
  let Tache = this.fire.list(`/notifications`).valueChanges().subscribe(data => {
    
    console.log(data)
    Tache.unsubscribe();
  });
}


checkingDataBase(){

  firebase.database().ref('/statistiques/Line').on('value',resp=>{})
  firebase.database().ref('/users').on('value',resp=>{})
 // firebase.database().ref(`/taches/à faire/`).on('value', resp => {})

  console.log("Database checked !!")


 //console.log(" while checking : "+semaine_1+" "+semaine_2+" "+semaine_3+" "+semaine_4)

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