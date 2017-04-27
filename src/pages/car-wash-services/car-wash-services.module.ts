import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarWashServices } from './car-wash-services';

@NgModule({
  declarations: [
    CarWashServices,
  ],
  imports: [
    IonicPageModule.forChild(CarWashServices),
  ],
  exports: [
    CarWashServices
  ]
})
export class CarWashServicesModule {}
