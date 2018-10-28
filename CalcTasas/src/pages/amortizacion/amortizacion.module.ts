import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AmortizacionPage } from './amortizacion';

@NgModule({
  declarations: [
    AmortizacionPage,
  ],
  imports: [
    IonicPageModule.forChild(AmortizacionPage),
  ],
})
export class AmortizacionPageModule {}
