import { Component ,ViewChild} from '@angular/core';
import {Nav, Platform,LoadingController,Events ,AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AngularFireList,AngularFireDatabase} from 'angularfire2/database';
import { timer } from 'rxjs/observable/timer';
//import * as firebase from 'firebase';
import firebase from 'firebase';

import { HomePage } from '../pages/home/home';
import { AdminPage } from '../pages/admin/admin';
import { AdminEquipePage } from '../pages/admin-equipe/admin-equipe';
import { AdminProfilPage } from '../pages/admin-profil/admin-profil';
import { AdminStatPage } from '../pages/admin-stat/admin-stat';
import { AdminTachesPage } from '../pages/admin-taches/admin-taches';
import { Provider } from '../providers/provider/provider';
import { TabsAdminsUsersPage } from '../pages/tabs-admins-users/tabs-admins-users';
import { AdminDemandesPage } from '../pages/admin-demandes/admin-demandes';
/*import { UserTachesPage } from '../pages/user-taches/user-taches';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { UserNotificationsPage } from '../pages/user-notifications/user-notifications';
*/
//import { UserprofilePage } from '../pages/userprofile/userprofile';
import { UsertachesPage } from '../pages/usertaches/usertaches';
import { UsernotificationsPage } from '../pages/usernotifications/usernotifications';
import { SuperTabsStatPage } from '../pages/super-tabs-stat/super-tabs-stat';


///push


import { User } from '../modules/Users';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  templateUrl: 'app.html'
 
})
export class MyApp {
 

  @ViewChild(Nav) nav: Nav;

  showSplash = true;
  


  rootPage:any//= HomePage;
  activePage: any;
  user = {} as User;
  loader : any;
  buttonColor : boolean = true;

  interface_name :string;
  role : string;
  activated : boolean =false ;
  prov : Provider;

  personne: any = [];
  pseudoPersonne : string ;
  rolePersonne : string
  testconnect : boolean = true;
  currentUser : any ;

  photo : any= "http://www.stpaulusbc.org/content/images/no-profile.png"

    
  /*users: AngularFireList<any>;
  admins: AngularFireList<any>;*/


  pages: Array<{title: string, component: any,icon : string}>;

  constructor( public fire : AngularFireDatabase,
              public fauth : AngularFireAuth,
              private events : Events,
              public provider : Provider, 
              public loading : LoadingController,
              public platform: Platform,
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public alertCtrl : AlertController
  
  ) {

    
    let loader = this.loading.create({
     content : `<div class="sk-cube-grid">
  <div class="sk-cube sk-cube1"></div>
  <div class="sk-cube sk-cube2"></div>
  <div class="sk-cube sk-cube3"></div>
  <div class="sk-cube sk-cube4"></div>
  <div class="sk-cube sk-cube5"></div>
  <div class="sk-cube sk-cube6"></div>
  <div class="sk-cube sk-cube7"></div>
  <div class="sk-cube sk-cube8"></div>
  <div class="sk-cube sk-cube9"></div>
</div> Please wait...`,
    //  content: "Please wait...",
      spinner : "hide"
    
    });
    console.log("testconnect : "+this.testconnect)
    
    
    this.fauth.authState.subscribe(data =>{
          this.fauth.auth.onAuthStateChanged(user => {
            //this.fauth.authState
            if (!user && this.testconnect==true){//if its not conncted !
              console.log("user not logged in")
            this.rootPage= HomePage;
            }
          })
          
            
      this.currentUser = data.email;
      console.log("data.email : "+data.email)
      console.log("2-curr user : "+firebase.auth().currentUser);

      if(this.testconnect==false){}//if its connected but current user changed
      else
      if(this.currentUser && this.testconnect){//if its connected wihle loading
        loader.present();

        setTimeout(() => {
          this.getPictureURL()//"http://www.stpaulusbc.org/content/images/no-profile.png"

        //  this.getPictureURL() 
          
           
          this.provider.checkingDataBase() 


          console.log("user logged in ! testconnected : "+this.testconnect)
          this.testconnect=false

          var thisUser = firebase.auth().currentUser;

      let Personne = this.fire.list(`/personne/${thisUser.uid}`).valueChanges().subscribe(data => {
        this.personne = data;
        this.pseudoPersonne=this.personne[0];
        this.rolePersonne=this.personne[1]; 
     //   console.log("user in app.component.ts:"+this.personne)
        if(this.rolePersonne=="admin") this.interface_name="Administrateur";
        else this.interface_name="Utilisateur"
     
     console.log("pseudoPersonne : "+ this.pseudoPersonne+" rolePersonne "+ this.rolePersonne)
        Personne.unsubscribe();
        this.events.publish('rootpage',this.rolePersonne);
      });

      this.rootPage= AdminPage;
      loader.dismiss();
    }, 2000);
      } else {//if its not connected
      console.log("user not logged in")
     this.rootPage= HomePage;
    }

//  });
      
      })//authState
      
      
    //const personRef: firebase.database.Reference = firebase.database().ref(`/person1/`);
 /*   this.fauth.auth.onAuthStateChanged(user => {
      //this.fauth.authState
      if (user) {
        loader.present();
      setTimeout(() => {
              console.log("user logged in !")
      //  console.log(user);
        
     
  let Personne = this.fire.list(`/personne/${user.uid}`).valueChanges().subscribe(data => {
          this.personne = data;
          this.pseudoPersonne=this.personne[0];
          this.rolePersonne=this.personne[1];
       //   console.log("user in app.component.ts:"+this.personne)
       console.log("pseudoPersonne : "+ this.pseudoPersonne+" rolePersonne "+ this.rolePersonne)
          Personne.unsubscribe();
        });
this.events.publish('rootpage');
        this.rootPage= AdminPage;
        loader.dismiss();
      }, 1000);
    } else {
        console.log("user not logged in")
       this.rootPage= HomePage;
      }

    });*/



    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
    
      splashScreen.hide();
    //  timer(3000).subscribe(() => this.showSplash = false)
      

    });


    platform.registerBackButtonAction(() => {

   /*   let nav = app.getActiveNavs()[0];
      let activeView = nav.getActive();                

      if(activeView.name === "FirstPage") {

          if (nav.canGoBack()){ //Can we go back?
              nav.pop();
          } else {*/
            
              const alert = alertCtrl.create({
                  title: 'App termination',
                  message: 'Do you want to close the app?',
                  buttons: [{
                      text: 'Cancel',
                      role: 'cancel',
                      handler: () => {
                          console.log('Application exit prevented!');
                      }
                  },{
                      text: 'Close App',
                      handler: () => {
                          platform.exitApp(); // Close this application
                      }
                  }]
              });
              alert.present();
        
          });

this.events.subscribe('rootpage',(role)=>{
       
       //console.log("this shiiit : "+data)
       if(role=="admin"){
          this.pages = [
            
              { title: 'Profil', component: AdminProfilPage ,icon:"md-person" },
              { title: "Liste de l'equipe", component: TabsAdminsUsersPage ,icon :"ios-people"},
              { title: 'Tâches', component: AdminTachesPage, icon : "ios-information-circle"},
              { title: 'Statistiques', component: SuperTabsStatPage,icon :"md-stats"},
              { title: 'Demandes', component: AdminDemandesPage, icon : "md-notifications"},
              { title: 'Déconncter', component: HomePage, icon : "md-wifi"},
               // { title: 'Statistiques', component: AdminStatPage,icon :"md-stats"},

            ];
          }else if(role=="user"){
            this.pages = [
            
              { title: 'Profil', component: AdminProfilPage ,icon:"md-person" },
              { title: 'Tâches', component: UsertachesPage ,icon:"ios-information-circle"},
              { title: 'Notifications', component: UsernotificationsPage ,icon:"md-notifications" },
              { title: 'Déconncter', component: HomePage, icon : "md-wifi"},
              //{ title: 'test', component: TestPage, icon : "md-wifi"},
               
            ];
          }else
          console.log("error !!! : interface appear with wrong informations")


            
            this.activePage = this.pages[this.pages.length];
    });

    events.subscribe('buttoncolor', () =>{
      console.log("button color before: "+this.buttonColor)
      this.buttonColor=false;
      console.log("button color after: "+this.buttonColor)
    });
/**************************in case of login block**************************/

   events.subscribe('user:login', (rolee,pseudo,interface_namee) => {
          //this.activated=variable; 
         // this.getPictureURL() 
         this.events.subscribe("change menu picture",(pic)=>{
          this.photo = pic
        })
         this.getPictureURL()//"http://www.stpaulusbc.org/content/images/no-profile.png"

      this.role=rolee;
      console.log("this.role :"+this.role);
      this.pseudoPersonne=pseudo;
          this.interface_name=interface_namee;
        console.log("2-role : "+this.role+" interface name : "+this.interface_name);
          //this.loggedIn( this.activated);
     
          //if(true) console.log("role : "+this.role+" interface name : "+this.interface_name);
    if(true) console.log("pseudoPersonne !!: "+ this.pseudoPersonne+" role "+ this.role)
         
          if( /*this.rolePersonne */ this.role==/*this.personne[1]*/"admin"){
            
         /*   if(this.personne =="user") this.interface_name="Utilisateur";
             else this.interface_name="Administrateur";*/
          this.pages = [
            
            { title: 'Profil', component: AdminProfilPage ,icon:"md-person" },
            { title: "Liste de l'equipe", component: TabsAdminsUsersPage ,icon :"ios-people"},
            { title: 'Tâches', component: AdminTachesPage, icon : "ios-information-circle"},
            { title: 'Statistiques', component: SuperTabsStatPage,icon :"md-stats"},
            { title: 'Demandes', component: AdminDemandesPage, icon : "md-notifications"},
            { title: 'Déconncter', component: HomePage, icon : "md-wifi"},
         // { title: 'Statistiques', component: AdminStatPage,icon :"md-stats"},
          ];
          this.activePage = this.pages[this.pages.length];
        }else if(/*this.rolePersonne*/ this.role=="user")
        {
          this.pages = [
            
            { title: 'Profil', component: AdminProfilPage ,icon:"md-person" },
            { title: 'Tâches', component: UsertachesPage ,icon:"ios-information-circle"},
            { title: 'Notifications', component: UsernotificationsPage ,icon:"md-notifications" },
            { title: 'Déconncter', component: HomePage, icon : "md-wifi"},
            //{ title: 'test', component: TestPage, icon : "md-wifi"},
            

            
      
          ];
          this.activePage = this.pages[this.pages.length];
        }
        else (console.log("errorrrrr !!! : interface appear with wrong informations"));


});



 //   console.log("test_activated : "+this.user.test_activated);
  /*  provider.setMyGlobalVar(true);
    console.log("value1 : "+provider.getMyGlobalVar());
this.activated=provider.getMyGlobalVar();*/

this.events.subscribe("change menu picture",(pic)=>{
  this.photo = pic
})

  
}
getPictureURL(){

  var userEmail = firebase.auth().currentUser.email;
  console.log("email : "+userEmail)
  firebase.storage().ref().child(userEmail).getDownloadURL()
  .then( (url) =>{

      this.photo=url

   /*   let alert = this.alertCtrl.create({
        title : "success",
        subTitle: `${this.photo}`,
        buttons: ['OK']
      });
      alert.present();*/
     // return url

  }).catch(error =>{
    let alert = this.alertCtrl.create({
      title : "error",
      subTitle: `${error.message}`,
      buttons: ['OK']
    });
  //  alert.present();
  })
}

  checkActive(page){
   
    
    return page == this.activePage; 
   
  
  }
  
  openPage(page) {
    this.events.subscribe("change menu picture",(pic)=>{
      this.photo = pic
    })
    
  /*  let loader = this.loading.create({
      content: "Please wait...",
      spinner: "dots"

    });
   // loader.present();

    var nb_taches_afaire = 0
    var nb_taches_encours = 0
    var nb_taches_realisees =0
    

      if(page.component === AdminStatPage){
        
        firebase.database().ref('/taches/').on('value', resp => {

          let TACHES_AFAIRE = this.fire.list('/taches/à faire/').valueChanges().subscribe(data => {
             nb_taches_afaire = data.length;
             this.events.publish("nb_taches_afaire",nb_taches_afaire);
         //  console.log("taches à faire : ",nb_taches_afaire)

           TACHES_AFAIRE.unsubscribe()
          })
          let TACHES_ENCOURS = this.fire.list('/taches/en cours/').valueChanges().subscribe(data => {
            nb_taches_encours = data.length;
            this.events.publish("nb_taches_encours",nb_taches_encours);

         // console.log("taches en cours: ",nb_taches_encours)
         TACHES_ENCOURS.unsubscribe()
          })
          let TACHES_REALISEE = this.fire.list('/taches/réalisées/').valueChanges().subscribe(data => {
            nb_taches_realisees = data.length;
          // console.log(" taches réalisées : ",nb_taches_realisees)
          TACHES_REALISEE.unsubscribe()
          })




      this.activePage = page;
      this.buttonColor=true;

          loader.dismiss();

        });
      }
      else*/
      let loader = this.loading.create({
        content: "Please wait...",
        spinner : "dots",
        duration : 1000
      
      });
      if(page.component===HomePage){
        
        
          if(firebase.auth().currentUser){
            
            loader.onDidDismiss(() => {
                  this.fauth.auth.signOut().then(()=>{
                    this.nav.setRoot(page.component);
                    this.activePage = page;
                    this.buttonColor=true;
                  })
                  
            });
          
            loader.present();
          }
      }else
      {
      this.nav.setRoot(page.component);
      this.activePage = page;
      this.buttonColor=true;
    }

}
  

  
  /*public goBack(){

    this.loader = loading.create({
      content: "Please wait...",
      spinner : "dots",
      duration : 1000
    
    });

    this.loader.onDidDismiss(() => {
      this.nav.setRoot(HomePage);
      console.log("disconnected !");
    });
  
    this.loader.present();
  }*/

  /*
      ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.nav.setRoot(HomePage); //I've tried also with this.rootPage = HomePage and the behavieur is the same
      } else {
        this.nav.setRoot(LoginPage);  //I've tried also with this.rootPage = LoginPage and the behavieur is the same
      }
    });
  }
  
  
  logout() {
    if (this.navCtrl.last().index > 0) {
      this.navCtrl.remove(this.navCtrl.last().index)
        .then( () => {
          this.afAuth.auth.signOut();
        },
        error => {console.error(error); }
        );
    }
    else {
      this.authService.logout();
    }*/
   
    
    
    loggedIn(variable) {
    console.log("event"+variable);
    }

    
}

