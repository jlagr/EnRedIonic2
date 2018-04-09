import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ViewController, ToastController, App } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { TabsPage } from './../tabs/tabs';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  accountForm: FormGroup;
  submitAttempt: boolean = false;
  debouncer: any;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, 
    private auth: AuthServiceProvider, private loadingCtrl: LoadingController, 
    public viewCtrl: ViewController, private toastCtrl: ToastController,
    private app: App) {

    this.accountForm = formBuilder.group({
        nombre: [this.auth.currentUser.nombre, Validators.required],
        email: [this.auth.currentUser.email],
        empresa: [this.auth.currentUser.empresa],
        movil: [this.auth.currentUser.movil],
        proveedor: [this.auth.currentUser.proveedor, Validators.required]
    });
  }

  private cancel() {
    this.navCtrl.push(TabsPage,{tabIndex:0});
  }

  private updateAccount(){
    this.submitAttempt = true;
    
    if(this.accountForm.valid) {
      this.showLoading();
      this.submitAttempt = false;
      clearTimeout(this.debouncer);
      this.debouncer = setTimeout(() => {
        this.auth.updateAccount(this.accountForm.value).subscribe(res => {
          //console.log(res);
          this.dismissLoading();
          if (res.success) {
            //this.accountForm.reset();
            this.auth.currentUser.nombre = this.accountForm.value.nombre;
            this.auth.currentUser.movil = this.accountForm.value.movil;
            this.auth.currentUser.proveedor = this.accountForm.value.proveedor;
            this.navCtrl.push(TabsPage,{tabIndex:0});
            this.showMessage("Sus datos se actualizaron correctamente");
          } else {
            this.showError("No fue posible actualizar los datos, comuniquese con el administrador de la aplicación");
          }
        },
          error => {
            //console.log(error);
            this.dismissLoading();
            this.showError(error);
            if(error.status == 401){ //Sesion expiró
              this.navCtrl.setRoot(LoginPage);
           }
          });
      },2000);
    }
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Actulizando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
    }
  }

  showMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'middle',
      cssClass: "toastBox",
    });
    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });
  
    toast.present();
  }

  showError(message){
    this.dismissLoading();
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'buttom',
      showCloseButton: true,
      closeButtonText: 'Ok',
      cssClass: 'toastBox'
    });
    toast.present();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AccountPage');
  }

  private logout() {
    this.auth.logout().subscribe(res => {
      this.app.getRootNav().setRoot(LoginPage);
    },
      error => {
        this.showError(error);
      });
  }
}
