import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IndividualSectionPage } from './individual-section-page';

@NgModule({
  declarations: [
    IndividualSectionPage,
  ],
  imports: [
    IonicPageModule.forChild(IndividualSectionPage),
  ],
  exports: [
    IndividualSectionPage
  ]
})
export class IndividualSectionPageModule {}
