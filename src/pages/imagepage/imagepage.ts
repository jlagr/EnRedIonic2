import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Loading, LoadingController, FabContainer } from 'ionic-angular';
import { TicketServiceProvider } from '../../providers/ticket-service/ticket-service';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-imagepage',
  templateUrl: 'imagepage.html',
})
export class ImagepagePage {
  loading: Loading;
  imageId: string = '';
  titulo: string = '';
  bigImg = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController,
    private loadingCtrl: LoadingController, public tickets: TicketServiceProvider, private alertCtrl: AlertController) {
    this.imageId = this.navParams.get('imageId');
    this.titulo = this.navParams.get('titulo');
    this.loadImage();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ImagepagePage');
  }

  closeModal() {
    this.navCtrl.pop();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando...',
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

  loadImage() {
    this.showLoading();
    setTimeout(() => {
        this.tickets.getImage(this.imageId).subscribe(res => {
          //console.log(res);
          this.dismissLoading();
          if (res.success) {
            this.bigImg = res.data[0].image;
          } else {
            this.showError("No se encontró la imagen solicitada");
          }
        },
          error => {
            this.dismissLoading();
            this.showError(error);
            if(error.status == 401){ //Sesion expiró
              this.navCtrl.setRoot(LoginPage);
           }
          });
      },2000);
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

  deleteImage64() {
    this.tickets.deliteImage(this.imageId).subscribe(res => {
      //console.log(res);
      this.dismissLoading();
      if (res.success) {
        this.bigImg = null;
        this.closeModal();
      } else {
        this.showError("No se pudo eliminar la imagen");
      }
    },
      error => {
        this.dismissLoading();
        this.showError(error);
        if(error.status == 401){ //Sesion expiró
          this.navCtrl.setRoot(LoginPage);
       }
      });
  }


  showDeleteDialog(event, fab: FabContainer){
    fab.close();
    let alert = this.alertCtrl.create({
      title: 'Eliminar Imagen',
      subTitle: '¿Está seguro de eliminar la imagen del ticket?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Eliminar',
          handler: data => {
              this.deleteImage64();
          }
        }
      ]
    });
    alert.present();
  }
}
