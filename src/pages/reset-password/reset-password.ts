import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ViewController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RepasswordValidator } from '../../validators/repassword';

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  resetForm: FormGroup;
  submitAttempt: boolean = false;
  debouncer: any;
  loading: Loading;
  email: any = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, 
    private auth: AuthServiceProvider, private loadingCtrl: LoadingController, 
    public viewCtrl: ViewController, private toastCtrl: ToastController) {
    //this.showMessage("El password se actualizó correctamente");
    this.email = this.navParams.get('email');

    this.resetForm = formBuilder.group({
      email: [this.email],
      password: ['', Validators.compose([Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[#$@$!%*?&]).{8,20}$'), Validators.required])],
      repassword: ['', RepasswordValidator.isSame]
    });
  }

  cancelReset() {
    this.resetForm.reset();
    this.viewCtrl.dismiss();
  }

  saveReset() {
    this.submitAttempt = true;
    
    if(this.resetForm.valid) {
      this.showLoading();
      clearTimeout(this.debouncer);
      this.debouncer = setTimeout(() => {
        this.auth.changePassword(this.resetForm.value).subscribe(res => {
          //console.log(res);
          this.dismissLoading();
          if (res.success) {
            this.resetForm.reset();
            this.viewCtrl.dismiss();
            this.showMessage("El password se actualizó correctamente");
          } else {
            this.showError("No fue posible actualizar el password, comuniquese con el administrador de la aplicación");
          }
        },
          error => {
            this.dismissLoading();
            //console.log(error);
            this.showError(error);
          });
      },2000);
    }
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Actualizando...',
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
    //console.log('ionViewDidLoad ResetPasswordPage');
  }

}
