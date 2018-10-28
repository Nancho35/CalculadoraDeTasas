import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * Generated class for the AmortizacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-amortizacion',
  templateUrl: 'amortizacion.html',
})
export class AmortizacionPage {
  FormAmortiza: FormGroup;
  periodo: string ;
  constructor(public navCtrl: NavController, public navParams: NavParams,public formBuilder: FormBuilder) {
    this.FormAmortiza = this.createMyForm();
  }

  private createMyForm() {
    return this.formBuilder.group({
      txtValor: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?'), Validators.required])],
      txtPlazo: ['', Validators.required],
      txtTasa: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9]+(\.[0-9][0-9]?)?'), Validators.required])],
      cmbPeriodicity: ['', Validators.required],
      
    });
  }

  onSelectPeriod(selectedValue: any) {
switch(selectedValue) { 
   case "12": { 
      this.periodo = " en Meses";
      break; 
   } 
   case "6": { 
    this.periodo = " en Bimestres";
      break; 
   } 
   case "4": {
    this.periodo = " en Trimestres";
      break;    
   } 
   case "2": { 
    this.periodo = " en Semestres";
      break; 
   }  
   case "1": { 
    this.periodo = " en Años";
      break; 
   } 
   default: { 
      console.log("Invalid choice"); 
      break;              
   } 
}
  }

  Amortiza(){
    let valor = parseFloat(this.FormAmortiza.value.txtValor);
    let plazo = parseInt(this.FormAmortiza.value.txtPlazo);
    let tasa = parseFloat(this.FormAmortiza.value.txtTasa)/100;
    let lstRates = new Array();

    for (var x = 0; x < plazo+1; x++) {
      var amortiza = new FilaAmortiza();
      amortiza.Periodo = x;
      
      
      if(x==0){
        amortiza.Cuota= 0;
        amortiza.Interes=  0;
        amortiza.AbonoCapital=  0;
        amortiza.Saldo= valor.toString();
        
      }else{
        amortiza.Cuota= valor * (((Math.pow((1+tasa),plazo)*tasa)/(Math.pow((1+tasa),plazo)-1)));
        amortiza.Interes=  parseFloat(lstRates[x-1].Saldo)*tasa;
        amortiza.AbonoCapital=  (amortiza.Cuota)-(amortiza.Interes);
        amortiza.Saldo= ((lstRates[x-1].Saldo)-(amortiza.AbonoCapital)).toFixed(2);
        
      }
      

      //agregamos el objeto rate al array
      lstRates.push(amortiza);
  }

  //formateo de datos
  for (var y = 0; y < lstRates.length; y++) {

    lstRates[y].Cuota = "$ "+( lstRates[y].Cuota).toLocaleString();

    lstRates[y].Interes = "$ "+(lstRates[y].Interes).toLocaleString();
    lstRates[y].AbonoCapital = "$ "+(lstRates[y].AbonoCapital).toLocaleString();
    lstRates[y].Saldo = "$ "+parseFloat((lstRates[y].Saldo)).toLocaleString() ;
  }

  var salida = JSON.stringify(lstRates);
  document.getElementById('showData').innerHTML = this.json2table(lstRates, 'table');
  
}


json2table(json, classes) {
  var cols = Object.keys(json[0]);

  var headerRow = '';
  var bodyRows = '';

  classes = classes || '';

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  cols.map(function (col) {
    headerRow += '<th>' + capitalizeFirstLetter(col) + '</th>';
  });

  json.map(function (row) {
    bodyRows += '<tr>';

    cols.map(function (colName) {
      bodyRows += '<td>' + row[colName] + '</td>';
    })

    bodyRows += '</tr>';
  });

  return '<table class="' +
    classes +
    '"><thead><tr>' +
    headerRow +
    '</tr></thead><tbody>' +
    bodyRows +
    '</tbody></table>';
}
}


class FilaAmortiza {
  Periodo: number;
  Cuota: number;
  Interes: number;
  AbonoCapital: number;
  Saldo: string;

}

