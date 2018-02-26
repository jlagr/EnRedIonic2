import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController, IonicPage, Loading, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RepasswordValidator } from '../../validators/repassword';
import { EmailValidator } from '../../validators/email';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {
  createSuccess = false;
  registerForm: FormGroup;
  submitAttempt: boolean = false;
  password_type: string = 'password';
  debouncer: any;
  loading: Loading;

  constructor(private nav: NavController, private auth: AuthServiceProvider, private alertCtrl: AlertController, 
    public emailValidator: EmailValidator, public formBuilder: FormBuilder, private loadingCtrl: LoadingController) { 

    this.registerForm = formBuilder.group({
      nombre: ['', Validators.compose([Validators.maxLength(40),Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.maxLength(70),
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), 
        Validators.required]), emailValidator.checkEmail.bind(emailValidator)],
      movil: ['', Validators.compose([Validators.maxLength(10),Validators.minLength(10), Validators.pattern('[0-9 ]*'), Validators.required])],
      proveedor: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[#$@$!%*?&]).{8,20}$'), Validators.required])],
      repassword: ['', RepasswordValidator.isSame]
    });
  }
 
  saveRegister() {
    this.submitAttempt = true;
    
    if(this.registerForm.valid) {
      this.showLoading();
      clearTimeout(this.debouncer);
      this.debouncer = setTimeout(() => {
        this.auth.register(this.registerForm.value).subscribe(res => {
          //console.log(res);
          this.dismissLoading();
          if (res.success) {
            this.createSuccess = true;
            this.registerForm.reset();
            this.nav.popToRoot();
            this.showPopup("EnRed Durango", "El usuario ha sigo creado, recibirá un correo cuando el administrador autorice su acceso a la aplicación.");
          } else {

            this.showPopup("Error", "No fue posible solicitar este usuario, comuniquese con el administrador de la aplicación");
          }
        },
          error => {
            this.dismissLoading();
            this.showPopup("Error", error);
          });
      },2000);
    }
  }
 
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Solicitando...',
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

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

  tooglePasswordMode() {
    //console.log('entro')
    this.password_type = this.password_type === 'text' ? 'password' : 'text'
  }

  cancelRegister() {
    if(this.hasInfo()){
      let alert = this.alertCtrl.create({
        title: 'Nuevo Usuario',
        subTitle: 'Hay datos sin guardar',
        message: '¿Desea cancelar esta solicitud de usuario?',
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Si',
            handler: () => {
              this.registerForm.reset();
              this.nav.popToRoot();
            }
          }
        ]
      });
      alert.present();
    }
    else {
      this.registerForm.reset();
      this.nav.popToRoot();
    }
  }

  hasInfo() {
    console.log(this.registerForm.value);
    var result: boolean = false;
    if(this.registerForm.value.nombre !== '' || this.registerForm.value.email !== '' || 
    this.registerForm.value.movil !== '' || this.registerForm.value.password !== '') {
      result = true;
    }
    return result;
  }
}
