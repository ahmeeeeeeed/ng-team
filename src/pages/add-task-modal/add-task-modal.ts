import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, ToastController, AlertController, LoadingController, Events } from 'ionic-angular';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Provider } from '../../providers/provider/provider';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
/**
 * Generated class for the AddTaskModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-task-modal',
  templateUrl: 'add-task-modal.html',
})
export class AddTaskModalPage {
  taches_afaire: AngularFireList<any>;
  taches_encours: AngularFireList<any>;
  taches_realisee: AngularFireList<any>;


  type :string;
  currusername : any;


  constructor(public navCtrl: NavController,
              public navParams : NavParams,
              private fire : AngularFireDatabase,
              public toastCtrl: ToastController,
              public alertCtrl :AlertController,
              public fauth : AngularFireAuth,
              public loadingCtrl: LoadingController,
              public provider : Provider,
              public event : Events,
              public viewCtrl : ViewController
  ) {
              this.taches_afaire = fire.list('/taches/à faire');
              this.taches_encours = fire.list('/taches/en cours');
              this.taches_realisee = fire.list('/taches/réalisées');

              

         /*     this.taches_afaire.push({ll : "z"}).then(data =>{
                this.taches_afaire.update(data.key,{id : data.key})
            });
              this.taches_encours.push({ll : "z"}).then(data =>{
                this.taches_encours.update(data.key,{id : data.key})
              });
                this.taches_realisee.push({ll : "z"}).then(data =>{
                  this.taches_realisee.update(data.key,{id : data.key})
                });
               // console.log(this.taches_afaire.query);
               */

          /*    this.type = this.navParams.get('type')
              console.log("type :"+ this.type)
              */

    var currentUser = firebase.auth().currentUser;
    let Personne = this.fire.list(`/personne/${currentUser.uid}`).valueChanges().subscribe(data => {

      this.currusername = data[0]
      this.event.publish("getting user name")


      Personne.unsubscribe()
    });
    this.event.subscribe("getting user name", () => {
      console.log("1-- user name :" + this.currusername);
    })

              

  }
 
createTask(titre,description,estim_time){
    /*let days;
    let hours;
    let minutes ;
console.log("days : "+(days=estim_time /24))
console.log("hours : "+(hours=estim_time % 24))
console.log("minutes : ")
*/
let loader = this.loadingCtrl.create({
  content: "Please wait...",
  spinner : "dots"

});

loader.present();


let date_creation =  new Date().toString();
      this.taches_afaire.push({
      
          titre :titre,
          description : description,
          date_creation :date_creation ,
          temps_estime : estim_time,
          user : this.currusername
      }

      ).then(data =>{

        this.taches_afaire.update(data.key,{id : data.key})
        .then(data =>{

          this.provider.statistiquesDoughnutUpdate(); 

          console.log(" task added !")
          let toast = this.toastCtrl.create({
          message:  'task was added successfully',
          duration: 2000,
          position : "bottom"
          });
          toast.present();
        })//update

        loader.dismiss();

      
    });//push


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTaskModalPage');
    
  }
  onClose(){
    this.viewCtrl.dismiss();
    
  }

}
