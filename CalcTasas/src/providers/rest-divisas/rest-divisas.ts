import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RestDivisasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestDivisasProvider {

  constructor(public http: HttpClient) {
    
  }

  getDivisas(){

    return new Promise(resolve => {
      this.http.get('https://openexchangerates.org/api/latest.json?app_id=f486e594017f4381aa6494cb8f810ba7').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}
