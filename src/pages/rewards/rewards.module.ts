import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Rewards } from './rewards';

@NgModule({
  declarations: [
    Rewards,
  ],
  imports: [
    IonicPageModule.forChild(Rewards),
  ],
  exports: [
    Rewards
  ]
})
export class RewardsModule {}
