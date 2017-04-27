import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemPage } from './item-page';

@NgModule({
  declarations: [
    ItemPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemPage),
  ],
  exports: [
    ItemPage
  ]
})
export class ItemPageModule {}
