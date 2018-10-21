import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myForm: FormGroup;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder) {
    this.myForm = this.createMyForm();
  }


  Calcular() {
    let rate = this.myForm.value.txtRate.replace(",", "") / 100;
    let period = this.myForm.value.cmbPeriodicity;
    let lstPeriods = [12, 6, 4, 2, 1];
    let lstPeriodName = ["Mensual", "Bimensual", "Trimestral", "Semestral", "Anual"];
    let rateType = this.myForm.value.cmbRateType;
    let paymentType = this.myForm.value.cmbPaymentType;
    let lstRates = new Array();
    let posRate = 0;


    if (rate > 0) {
      //calculamos el renglon dado por el usuario
      for (var x = 0; x < lstPeriods.length; x++) {
        var objRate = new prueba();
        objRate.Period = lstPeriods[x];
        objRate.PeriodName = lstPeriodName[x];
        objRate.Nominal_Vencida = 0;
        objRate.Efectiva_Vencida = 0;
        objRate.Nominal_Anticipada = 0;
        objRate.Efectiva_Anticipada = 0;

        if (lstPeriods[x] == period) {
          posRate = x;

          switch (rateType) {
            case "NOMINAL":
              //convertimos a tasa efectiva
              var efective = rate / period;

              switch (paymentType) {
                case "VENCIDA":
                  objRate.Efectiva_Vencida = efective * 100;
                  objRate.Nominal_Vencida = rate * 100;

                  //calculamos las anticipadas
                  objRate.Efectiva_Anticipada = (efective / (1 + efective)) * 100;
                  objRate.Nominal_Anticipada = ((efective / (1 + efective)) * period) * 100;
                  break;
                case "ANTICIPADA":
                  objRate.Efectiva_Anticipada = efective * 100;
                  objRate.Nominal_Anticipada = rate * 100;

                  //calculamos las vencidas
                  objRate.Efectiva_Vencida = (efective / (1 - efective)) * 100;
                  objRate.Nominal_Vencida = (efective / (1 - efective) * period) * 100;
                  break;
              }
              break;
            case "EFECTIVA":
              switch (paymentType) {
                case "VENCIDA":
                  objRate.Efectiva_Vencida = rate * 100;
                  objRate.Nominal_Vencida = (rate * period) * 100;

                  //calculamos las anticipadas
                  objRate.Efectiva_Anticipada = (rate / (1 + rate)) * 100;
                  objRate.Nominal_Anticipada = (rate / (1 + rate) * period) * 100;
                  break;
                case "ANTICIPADA":
                  objRate.Efectiva_Anticipada = rate * 100;
                  objRate.Nominal_Anticipada = (rate * period) * 100;

                  //calculamos las vencidas
                  objRate.Efectiva_Vencida = (rate / (1 - rate)) * 100;
                  objRate.Nominal_Vencida = (rate / (1 - rate) * period) * 100;
                  break;
              }
              break;
          }
        }

        //agregamos el objeto rate al array
        lstRates.push(objRate);
      }

      //calculamos las demas tasas
      for (var x = 0; x < lstPeriods.length; x++) {
        //si es una fila sin datos
        if (posRate != x) {
          //calculamos la tasa efectiva
          var efective1 = (Math.pow((1 + (lstRates[posRate].Efectiva_Vencida / 100)),
            (lstRates[posRate].Period / lstPeriods[x])) - 1);

          lstRates[x].Efectiva_Vencida = efective1 * 100;
          lstRates[x].Nominal_Vencida = (efective1 * lstPeriods[x]) * 100;

          lstRates[x].Efectiva_Anticipada = (efective1 / (1 + efective1)) * 100;
          lstRates[x].Nominal_Anticipada = (efective1 / (1 + efective1)) * 100 * lstPeriods[x];
        }
      }

      for (var y = 0; y < lstPeriods.length; y++) {
        lstRates[y].Efectiva_Vencida = parseFloat(lstRates[y].Efectiva_Vencida).toFixed(3) + "%";
        lstRates[y].Nominal_Vencida = parseFloat(lstRates[y].Nominal_Vencida).toFixed(3) + "%";

        lstRates[y].Efectiva_Anticipada = parseFloat(lstRates[y].Efectiva_Anticipada).toFixed(3) + "%";
        lstRates[y].Nominal_Anticipada = parseFloat(lstRates[y].Nominal_Anticipada).toFixed(3) + "%";
      }

      var salida = JSON.stringify(lstRates);
      //var col = ["Pagos Anuales", "Periodo", "Nominal Vencida", "Efectiva Vencida", "Nominal Anticipada", "Efectiva Anticipada"]


    }


    /* How to use it */


    document.getElementById('showData').innerHTML = this.json2table(lstRates, 'table');

    /* Live example */

    var dom = {
      // data: document.getElementById('data'),
      table: document.getElementById('showData'),
    };

    //dom.data.value = lstRates;
    //dom.data.addEventListener('input', function () {
    //  dom.table.innerHTML = json2table(JSON.parse(dom.data.value), 'table');
    //});

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

  private createMyForm() {
    return this.formBuilder.group({
      txtRate: ['', Validators.required],
      cmbRateType: ['', Validators.required],
      cmbPeriodicity: ['', Validators.required],
      cmbPaymentType: ['', Validators.required],
    });
  }
}

class prueba {
  Period: number;
  PeriodName: string;
  Nominal_Vencida: number;
  Efectiva_Vencida: number;
  Nominal_Anticipada: number;
  Efectiva_Anticipada: number;

  constructor() {

  }
}
