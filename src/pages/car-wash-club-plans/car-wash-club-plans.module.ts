import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarWashClubPlans } from './car-wash-club-plans';

@NgModule({
  declarations: [
    CarWashClubPlans,
  ],
  imports: [
    IonicPageModule.forChild(CarWashClubPlans),
  ],
  exports: [
    CarWashClubPlans
  ]
})
export class CarWashClubPlansModule {}
