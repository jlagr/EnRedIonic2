import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdministrationPage } from './administration';

@NgModule({
  declarations: [
    AdministrationPage,
  ],
  imports: [
    IonicPageModule.forChild(AdministrationPage),
  ],
})
export class AdministrationPageModule {}
