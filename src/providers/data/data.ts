import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class DataProvider {

  constructor( public loadingCtrl: LoadingController,) {
   
  }

}
