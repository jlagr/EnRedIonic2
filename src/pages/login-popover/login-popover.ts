import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-login-popover',
  templateUrl: 'login-popover.html',
})
export class LoginPopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthServiceProvider, 
    private alertCtrl: AlertController, private viewCtrl: ViewController) {
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

  showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  scanCode(){
    //TODO: Implementar el cordovaBarcodeScanner
    //Paso1: Revisar si no se ha cancelado la peticion
    //Paso2: Al terminar de escanear el código mostrar una nueva página
    //Donde muestre el correo de quien solicita el password en readonly
    //Las reglas para el nuevo password
    //un par de inputs para pass y re pass
    //boton de cancelar y cambiar
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPopoverPage');
  }

}
