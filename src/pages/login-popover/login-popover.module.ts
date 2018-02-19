import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPopoverPage } from './login-popover';

@NgModule({
  declarations: [
    LoginPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPopoverPage),
  ],
})
export class LoginPopoverPageModule {}
