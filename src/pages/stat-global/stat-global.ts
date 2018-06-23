import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Provider } from '../../providers/provider/provider';
import * as firebase from 'firebase';


/**
 * Generated class for the StatGlobalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stat-global',
  templateUrl: 'stat-global.html', 
})
export class StatGlobalPage {

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


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public event : Events,
              public provider : Provider) {
  }

  ionViewDidLoad() {

    this.getStatGlobal();

  }

  getStatGlobal(){
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