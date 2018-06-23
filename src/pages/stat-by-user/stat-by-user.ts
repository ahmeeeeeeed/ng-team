import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';


/**
 * Generated class for the StatByUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stat-by-user',
  templateUrl: 'stat-by-user.html',
})
export class StatByUserPage {

   /***** bar chart ****** */
   public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['tache 1', 'tache 2', 'tache 3', 'tache 4', 'tache 5', 'tache 6', 'tache 7','tache 8','tache 9','tache 10'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
  
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Temps estimé'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Temps de réalisation'}
  ];


tab_list_user = [];
pseudo="";
tab_liste_titre =[]
showStat = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public event : Events,
    public alertCtrl: AlertController,

  ) {
    
         
  }

  ionViewDidLoad() {

    this.event.subscribe("get user data in stat",data => {
    
      console.log("user gotted "+data)  
      this.getStatByUser(data)


    })
   
  }
  ionViewDidLeave(){
    this.showStat = false
  }

  getStatByUser(users){

this.pseudo = users.pseudo
    
    firebase.database().ref(`/statistiques/Bar/${users.pseudo}`).on('value', resp => {

      this.tab_list_user = [];
      var temps_estim_data = []
      var temps_ralisation_data = []

     this.tab_liste_titre  = []
      var i =0


      this.tab_list_user = snapshotToArray(resp);
    //  console.log("befor : "+this.tab_list_user)
      for(let user of this.tab_list_user){
        i++
       //console.log(user.temps_estime)
       temps_estim_data.push(user.temps_estime)
       temps_ralisation_data.push(user.periode_dev)
       this.tab_liste_titre.push("Tâche "+i+" : "+user.titre)

      }
      this.showStat= true;


      this.barChartData = [
        {data: temps_estim_data, label: 'Temps estimé'},
        {data: temps_ralisation_data, label: 'Temps de réalisation'}
      ];
     
    });
    
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