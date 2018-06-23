import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, LoadingController, ToastController, ModalController, ActionSheetController, Slides } from 'ionic-angular';

import { Provider } from '../../providers/provider/provider';
import { AdminPage } from '../admin/admin';
import { ListTaskDiscussPage } from '../list-task-discuss/list-task-discuss';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { forEach } from '@firebase/util';

/**
 * Generated class for the AdminStatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-stat',
  templateUrl: 'admin-stat.html',
})
export class AdminStatPage {
  /**line chart********* */
  public lineChartData:Array<any> = [{data: [65, 59, 80, 81], label: 'Ce mois'}];
  public lineChartLabels:Array<any> = ['semaine 1', 'semaine 2', 'semaine 3', 'semaine 4'];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    /*{ // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }*/
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  /***** bar chart ****** */
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
  
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];
/*** Doughnut Chart ***/  
// Doughnut
 nb_taches_afaire=0;
 nb_taches_encours=0;
 nb_taches_realisees=0;

public doughnutChartLabels:string[] = ['Tâches à faire', 'Tâches en cours', 'Tâches réalisées'];
public doughnutChartData:number[] = [20, 50, 30];

public doughnutChartType:string = 'doughnut';



date : any;
data : any;
statistiques_doughnut = [];
statistiques_line = [];
tab = []


@ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides ;

SwipedTabsIndicator :any= null;
tabs:any=[];


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
            
    ){this.date =  new Date()

      
      this.tabs=["Globale","par semaine","par utilisateur"];





    }

  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }
  
  // events
  public chartClicked(e:any):void {
    //console.log(e);
  }
  
  public chartHovered(e:any):void {
    //console.log(e);
  }

  ionViewDidLoad() {

  /*  let TACHES_REALISEE = this.fire.list('/taches/réalisées/').valueChanges().subscribe(data => {
      if(data.length==0)

     })*/

    //this.provider.updateWeek(4)
    this.statGlobal();
    this.statByWeek();
  }

  statGlobal(){
    var nb_taches_afaire=0
    var nb_taches_encours=0
    var nb_taches_realisees=0;

    firebase.database().ref('/statistiques/Doughnut').on('value', resp => {
      this.statistiques_doughnut = [];

      this.statistiques_doughnut = snapshotToArray(resp);
     // console.log("befor : "+this.statistiques_doughnut)
      for(let stat of this.statistiques_doughnut){
        nb_taches_afaire = stat.taches_a_faire;
        nb_taches_encours = stat.taches_encours;
        nb_taches_realisees = stat.taches_realisées;
        
      }
    //  console.log("1- "+nb_taches_afaire+" "+nb_taches_encours+" "+nb_taches_realisees)
     this.doughnutChartData = [nb_taches_afaire,nb_taches_encours, nb_taches_realisees];
    });
   // console.log("2- "+nb_taches_afaire+" "+nb_taches_encours+" "+nb_taches_realisees)

   if(this.SwipedTabsSlider.getActiveIndex()==2){
   let alert = this.alertCtrl.create();
    alert.setTitle('Lightsaber color');
var i=0
    for(i=0;i<10;i++){

    alert.addInput({
      type: 'radio',
      label: 'Blue',
      value: 'blue',
      checked: true
    });
  }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
   
      }
    });
    alert.present();
  }
  }

  statByWeek(){

    var semaine_1 = {nb_tache : 0,temps_realisation : 0}
    var semaine_2 = {nb_tache : 0,temps_realisation : 0}
    var semaine_3 = {nb_tache : 0,temps_realisation : 0}
    var semaine_4 = {nb_tache : 0,temps_realisation : 0}

    var moy_sem_1 = 0
    var moy_sem_2 = 0
    var moy_sem_3 = 0
    var moy_sem_4 = 0



    firebase.database().ref('/statistiques/Line').on('value', resp => {
      this.statistiques_line = [];

      this.statistiques_line = snapshotToArray(resp);
     // console.log("befor : "+this.statistiques_doughnut)
      for(let stat of this.statistiques_line){
        semaine_1.nb_tache = stat.semaine_1.nb_tache
        semaine_2.nb_tache = stat.semaine_2.nb_tache
        semaine_3.nb_tache = stat.semaine_3.nb_tache
        semaine_4.nb_tache = stat.semaine_4.nb_tache

        semaine_1.temps_realisation = stat.semaine_1.temps_realisation
        semaine_2.temps_realisation = stat.semaine_2.temps_realisation
        semaine_3.temps_realisation = stat.semaine_3.temps_realisation
        semaine_4.temps_realisation = stat.semaine_4.temps_realisation
        
      }

    /*  moy_sem_1=semaine_1.temps_realisation / semaine_1.nb_tache;
      moy_sem_2=semaine_2.temps_realisation / semaine_2.nb_tache;
      moy_sem_3=semaine_3.temps_realisation / semaine_3.nb_tache;
      moy_sem_4=semaine_4.temps_realisation / semaine_4.nb_tache;*/

      moy_sem_1= semaine_1.nb_tache / semaine_1.temps_realisation
      moy_sem_2= semaine_2.nb_tache / semaine_2.temps_realisation 
      moy_sem_3= semaine_3.nb_tache / semaine_3.temps_realisation 
      moy_sem_4= semaine_4.nb_tache / semaine_4.temps_realisation 

      
      //console.log("1- "+semaine_1+" "+semaine_2+" "+semaine_3)
    this.lineChartData = [{data: [moy_sem_1,moy_sem_2,moy_sem_3,moy_sem_4], label: 'Ce mois'}];
  });

 /* firebase.database().ref('/taches/réalisées/').on('value', resp => { 
   
    this.tab = [];
    var item = new Date();

    this.tab = snapshotToArray(resp);

    for(let date of this.tab){ 
      item=date.date_creation;
      console.log(item.getDay)
    }
    
});*/


  }

  

  /********************slides indicator functions*******************/
  ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");
  }

  selectTab(index) {    
    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(100*index)+'%,0,0)';
    this.SwipedTabsSlider.slideTo(index, 500);
    if(this.SwipedTabsSlider.getActiveIndex()==2)
    console.log(this.SwipedTabsSlider.getActiveIndex())

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
   // this.provider.gotoAdminPage();
   this.navCtrl.setRoot(AdminPage);  
   this.event.publish('buttoncolor');
  }
  goToChatList(){
    this.provider.getCurrentUser()
     this.event.subscribe("getting user name",(curruser)=>{
  
      console.log("current user :"+curruser);
      this.navCtrl.push(ListTaskDiscussPage,{user : curruser})
  })
    
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