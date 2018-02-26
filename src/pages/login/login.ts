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
  password_type: string = 'password';
  debouncer: any;

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

    clearTimeout(this.debouncer);
    
    this.showLoading();

    this.debouncer = setTimeout(() => {
      this.auth.login(this.registerCredentials).subscribe(res => {
        if(res.success){
          //console.log(res.data);
          this.auth.storeUserCredentials(res.data, res.token);
          if (this.auth.isAuthenticated) {       
            this.navCtrl.setRoot(MenuPage);
          } else {
            this.showError("Credenciales incorrectas.");
          }
        }
        else {
          this.showError(res.msg);
        }
        
      },
        error => {
          let response = error.json();
          console.log(response);
          if(response.msg = "Password incorrecto favor de verificarlo."){
            this.showDialog();
          }
          else {
            this.showError(response.msg);
          }
        });
    },2000);

     
  }
  
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Autenticando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  showError(text) {
    this.dismissLoading();
 
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
    }
  }

  showDialog() {
    this.dismissLoading();
    let alert = this.alertCtrl.create({
      title: 'Password Incorrecto',
      message: '¿Desea solicitar un reset del password?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.registerCredentials.password = '';
          }
        },
        {
          text: 'Solicitar',
          handler: () => {
            this.showResetPassDialog();
          }
        }
      ]
    });
    alert.present();
  }

  showResetPassDialog(){
    let alert = this.alertCtrl.create({
      title: 'Reset Password',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Reset',
          handler: data => {
            if(data.email != ""){
              this.passwordReset(data.email);
            }
          }
        }
      ]
    });
    alert.present();
  }

  passwordReset(email){
    this.auth.passwordReset(email).subscribe(res => {
      if(res.success){
        this.registerCredentials.email = '';
        this.showResetMessage();
      }
    },
      error => {
        let response = error.json();
        //console.log("Error: " + response);
        this.showError(response.msg);
      });
  }

  showResetMessage(){
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: "Se envió un mail con el código para cambiar su password. Revise su bandeja de entrada y/o de elementos no deseados. Por seguridad el código tiene una caducidad de 24 horas.",
      buttons: ['OK']
    });
    alert.present(); 
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad LoginPage');
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(LoginPopoverPage,{});
    popover.present({ev: event});
    //popover.onDidDismiss();
  }

}
