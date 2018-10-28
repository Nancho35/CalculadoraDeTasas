import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestDivisasProvider} from '../../providers/rest-divisas/rest-divisas';
import { LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  divisas: any;
  salida: any[]=[];
  myGroup: FormGroup;
  resultado: string;
  constructor(public formBuilder: FormBuilder, public loadingController: LoadingController,public restDivisasProvider: RestDivisasProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.myGroup = this.createMyForm();
  }

  Divisas(){ 
    let loader = this.loadingController.create({
      content: 'Obteniendo Resultado...',
      duration: 8000
    });

    loader.present().then(() => {
      this.restDivisasProvider.getDivisas()
      .then(data => {
        this.divisas = data;
        this.salida = this.divisas;
        let dinero = parseFloat(this.myGroup.value.txtDinero);
        let de = this.myGroup.value.cmbDE;
        let para = this.myGroup.value.cmbPara;
        let convert = (dinero/this.salida["rates"][de]);
        console.log((convert* this.salida["rates"][para]));
        console.log((convert* this.salida["rates"][para]).toFixed(4));

        this.resultado = dinero.toLocaleString('de-DE', { style: 'currency', currency: de })+" son : "+ (convert* this.salida["rates"][para]).toLocaleString('de-DE', { style: 'currency', currency: para,minimumFractionDigits: 4 });

        loader.dismiss();
      });
     
    });
  }


  private createMyForm() {
    return this.formBuilder.group({
      txtDinero: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?'), Validators.required])],
      cmbDE: ['', Validators.required],
      cmbPara: ['', Validators.required]
    });
  }
}
