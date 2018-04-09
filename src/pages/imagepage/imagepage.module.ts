import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImagepagePage } from './imagepage';

@NgModule({
  declarations: [
    ImagepagePage,
  ],
  imports: [
    IonicPageModule.forChild(ImagepagePage),
  ],
})
export class ImagepagePageModule {}
