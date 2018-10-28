import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CapitalizacionPage } from './capitalizacion';

@NgModule({
  declarations: [
    CapitalizacionPage,
  ],
  imports: [
    IonicPageModule.forChild(CapitalizacionPage),
  ],
})
export class CapitalizacionPageModule {}
