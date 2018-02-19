import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, Loading, LoadingController, PopoverController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPopoverPage } from '../../pages/login-popover/login-popover';
import { TabsPage } from '../tabs/tabs';
import { MenuPage } from '../menu/menu';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: Loading;
  registerCredentials = {email: '', password: ''};

  constructor(private navCtrl: NavController, private auth: AuthServiceProvider, 
    private alertCtrl: AlertController, private loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController) {
  }

  public createAccount() {
    this.navCtrl.push('RegisterPage');
  }

  public login() {
    if(this.registerCredentials.email === '' || this.registerCredentials.password === ''){
      return false;
    }
    this.showLoading();
    this.auth.login(this.registerCredentials).subscribe(allowed => {
      if (allowed) {        
        this.navCtrl.setRoot(MenuPage);
      } else {
        this.showError("Credenciales incorrectas.");
      }
    },
      error => {
        this.showError(error);
      });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(LoginPopoverPage,{});
    popover.present({ev: event});
    //popover.onDidDismiss();
  }
}
