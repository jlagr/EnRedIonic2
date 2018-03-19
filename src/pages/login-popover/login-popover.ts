import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController, Loading, LoadingController,ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ResetPasswordPage } from '../reset-password/reset-password';

@IonicPage()
@Component({
  selector: 'page-login-popover',
  templateUrl: 'login-popover.html',
})
export class LoginPopoverPage {
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthServiceProvider, 
    private alertCtrl: AlertController, private viewCtrl: ViewController, private barcodeScanner: BarcodeScanner,
    public modalCtrl: ModalController, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {

  }

  showPasswordOptions() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Recuperar password');

    alert.addInput({
      type: 'radio',
      label: 'Solicitar código',
      value: 'solicitar',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Escanear código',
      value: 'escanear'
    });

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        //console.log('Radio data:', data);
        if(data === 'solicitar'){
          this.showResetPassDialog();
        }
        if(data === 'escanear'){
          this.scanCode();
        }
      }
    });
    this.viewCtrl.dismiss();
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
        this.showError("Se envió un mail con el código para cambiar su password. Revise su bandeja de entrada y/o de elementos no deseados. Por seguridad el código tiene una caducidad de 24 horas.")
      }
    },
      error => {
        let response = error.json();
        //console.log("Error: " + response);
        this.showError(response.msg);
      });
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

  scanCode(){
    this.barcodeScanner.scan().then((barcodeData) => {
      if(!barcodeData.cancelled){
        //console.log("Scan successful: " + barcodeData.text);
        this.processToken(barcodeData.text);
      }
     }, (err) => {
      this.dismissLoading();
      console.log('Error', err);
     });
    // var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MTk5MzM0ODAsImF1ZCI6ImU1ODZhMzRkMWVkZjBjNTMxN2JmNjI2NTRlN2ViZGNjMDg4YmM5YTUiLCJkYXRhIjp7ImlkIjoiMSIsImVtYWlsIjoiamxhZ3JAb3V0bG9vay5jb20iLCJub21icmUiOiJKb3NlIEx1aXMgR29uelx1MDBlMWxleiBSb2phcyJ9fQ.NyjX5LQJhZ_uAmx8elsnAyG6lqTE5tmVCxEAKvEkq9c'
    // this.processToken(token);
  }

  processToken(token){
    this.showLoading();
    setTimeout(() => {
      this.dismissLoading();
      this.auth.validatePasswordToken(token).subscribe(res => {
        console.log(res);
        if(res.success){
          this.showResetModal(res.data);
        }
      },
        error => {
          //let response = error.json();
          //console.log("Error: " + response);
          this.showError(error);
        });
    }, 2000);
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

  showResetForm(email){
    this.navCtrl.push(ResetPasswordPage, {email: email})
  }

  showResetModal(email){
    let resetModal = this.modalCtrl.create(ResetPasswordPage, {email:email});
    resetModal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPopoverPage');
  }

}
