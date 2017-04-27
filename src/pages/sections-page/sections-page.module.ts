import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SectionsPage } from './sections-page';

@NgModule({
  declarations: [
    SectionsPage,
  ],
  imports: [
    IonicPageModule.forChild(SectionsPage),
  ],
  exports: [
    SectionsPage
  ]
})
export class SectionsPageModule {}
