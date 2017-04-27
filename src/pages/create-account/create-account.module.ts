import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateAccount } from './create-account';

@NgModule({
  declarations: [
    CreateAccount,
  ],
  imports: [
    IonicPageModule.forChild(CreateAccount),
  ],
  exports: [
    CreateAccount
  ]
})
export class CreateAccountModule {}
