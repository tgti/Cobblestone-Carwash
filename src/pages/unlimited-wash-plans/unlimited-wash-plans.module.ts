import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnlimitedWashPlans } from './unlimited-wash-plans';

@NgModule({
  declarations: [
    UnlimitedWashPlans,
  ],
  imports: [
    IonicPageModule.forChild(UnlimitedWashPlans),
  ],
  exports: [
    UnlimitedWashPlans
  ]
})
export class UnlimitedWashPlansModule {}
