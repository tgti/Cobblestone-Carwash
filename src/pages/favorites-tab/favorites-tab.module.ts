import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoritesTab } from './favorites-tab';

@NgModule({
  declarations: [
    FavoritesTab,
  ],
  imports: [
    IonicPageModule.forChild(FavoritesTab),
  ],
  exports: [
    FavoritesTab
  ]
})
export class FavoritesTabModule {}
