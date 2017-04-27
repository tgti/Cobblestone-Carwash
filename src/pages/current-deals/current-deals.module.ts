import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrentDeals } from './current-deals';

@NgModule({
  declarations: [
    CurrentDeals,
  ],
  imports: [
    IonicPageModule.forChild(CurrentDeals),
  ],
  exports: [
    CurrentDeals
  ]
})
export class CurrentDealsModule {}
