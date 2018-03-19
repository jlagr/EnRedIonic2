import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Loading, LoadingController,ToastController } from 'ionic-angular';
import { AdminServiceProvider } from '../../providers/admin-service/admin-service';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html',
})
export class UserDetailPage {
  user: any;
  empresas: any;
  loading: Loading;
  userForm: FormGroup;
  submitAttempt: boolean = false;
  debouncer: any;
  isActive: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private loadingCtrl: LoadingController, private toastCtrl: ToastController,
    public formBuilder: FormBuilder, public admServ: AdminServiceProvider) {
    this.user = this.navParams.get('user');

    this.isActive = false;
    if(this.user.activo == 1) {
      this.isActive = true
    }
    
    //Fill the empresas array from service;
    this.empresas = this.admServ.empresas;
    //console.log(this.empresas);
    //Creates the user form with selected user data
    this.userForm = formBuilder.group({
      id: [this.user.id],
      nombre: [this.user.nombre],
      email: [this.user.email],
      movil: [this.user.movil],
      proveedorMovil: [this.user.proveedorMovil],
      empresa: [this.user.empresaId,Validators.compose([Validators.pattern('^[1-9][0-9]?$|^100$'), Validators.required])],
      rol: [this.user.rolId, Validators.required],
      activo: [this.isActive]
    });
    //console.log(this.userForm.value);
  }

  private updateUser(){
    this.submitAttempt = true;
    if(this.userForm.valid) {
      this.showLoading();
      this.submitAttempt = false;
      clearTimeout(this.debouncer);
      this.debouncer = setTimeout(() => {
        this.admServ.updateUser(this.userForm.value).subscribe(res => {
          console.log(res);
          this.dismissLoading();
          if (res.success) {
            //this.accountForm.reset();
            this.showMessage(res.result);
          } 
          else {
            this.showError("No fue posible actualizar los datos, comuniquese con el desarollador de la aplicación");
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
      content: 'Procesando...',
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
    //console.log('ionViewDidLoad UserDetailPage');
  }

}
