import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TextClub } from './text-club';

@NgModule({
  declarations: [
    TextClub,
  ],
  imports: [
    IonicPageModule.forChild(TextClub),
  ],
  exports: [
    TextClub
  ]
})
export class TextClubModule {}
