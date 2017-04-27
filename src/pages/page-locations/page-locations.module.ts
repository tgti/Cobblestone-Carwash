import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PageLocations } from './page-locations';

@NgModule({
  declarations: [
    PageLocations,
  ],
  imports: [
    IonicPageModule.forChild(PageLocations),
  ],
  exports: [
    PageLocations
  ]
})
export class PageLocationsModule {}
