import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OilLubeServices } from './oil-lube-services';

@NgModule({
  declarations: [
    OilLubeServices,
  ],
  imports: [
    IonicPageModule.forChild(OilLubeServices),
  ],
  exports: [
    OilLubeServices
  ]
})
export class OilLubeServicesModule {}
