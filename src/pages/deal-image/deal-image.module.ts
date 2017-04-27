import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealImage } from './deal-image';

@NgModule({
  declarations: [
    DealImage,
  ],
  imports: [
    IonicPageModule.forChild(DealImage),
  ],
  exports: [
    DealImage
  ]
})
export class DealImageModule {}
