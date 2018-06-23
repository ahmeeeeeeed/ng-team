import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';


/**
 * Generated class for the StatByWeekPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stat-by-week',
  templateUrl: 'stat-by-week.html',
})
export class StatByWeekPage {

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

   date : any;
data : any;
statistiques_doughnut = [];
statistiques_line = [];
tab = []
mois : any


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    var mois= new Date().getMonth()
    switch(mois) {
      case 0: this.mois="Janvier"
          break;
      case 1:this.mois="Février"
          break;
      case 2:this.mois="Mars"
          break;
      case 3:this.mois="Avril"
          break;   
      case 4:this.mois="Mai"
          break;
      case 5:this.mois="Juin"
          break;
      case 6:this.mois="Juillet"
          break; 
      case 7:this.mois="Août"
          break;
      case 8:this.mois="Septembre"
          break;
      case 9:this.mois="Octobre"
          break; 
      case 10:this.mois="Novembre"
          break;
      case 11:this.mois="Décembre"
          break;  
  }
    console.log(mois)
    this.getStatByWeek()
  }

  getStatByWeek(){

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
    this.lineChartData = [{data: [moy_sem_1,moy_sem_2,moy_sem_3,moy_sem_4], label: this.mois}];
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

    // events
    public chartClicked(e:any):void {
      //console.log(e);
    }
    
    public chartHovered(e:any):void {
      //console.log(e);
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