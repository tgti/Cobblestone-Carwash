import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailServices } from './detail-services';

@NgModule({
  declarations: [
    DetailServices,
  ],
  imports: [
    IonicPageModule.forChild(DetailServices),
  ],
  exports: [
    DetailServices
  ]
})
export class DetailServicesModule {}
