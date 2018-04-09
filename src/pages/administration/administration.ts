import { Component } from '@angular/core';
import { IonicPage, NavController, App, NavParams, ToastController, Loading, LoadingController } from 'ionic-angular';
import { AdminServiceProvider } from '../../providers/admin-service/admin-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserDetailPage } from '../../pages/user-detail/user-detail';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-administration',
  templateUrl: 'administration.html',
})
export class AdministrationPage {
  loading: Loading;
  administration: string = "users"
  userList: any;
  userListAll: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public admServ: AdminServiceProvider, 
    private toastCtrl: ToastController, private loadingCtrl: LoadingController,
    private auth: AuthServiceProvider, private app:App) {
    this.administration = "users";
    this.doRefresh(0);
    //this.userList = [{nombre:"hugo"}, {nombre:"paco"},{nombre:"luis"}];
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AdministrationPage');
    //this.fillAllUsers();
    //this.administration = "users";
  }

  ionViewWillEnter() {
    this.doRefresh(0);
  }
  public segmentChanged(event){
    console.log("Evento: " + event.value);  
    this.doRefresh(0);
  }

  private fillAllUsers() {
    //console.log("Llenando los usuarios")
    this.admServ.getUsersList().subscribe(res => {
      //console.log(res);
      if(res.success){
        //console.log(res.result);
        this.userList = res.result;
        this.userListAll = this.userList.slice();
        
      }
      else {
        this.showError(res.msg);
      }
    },
      error => {
          console.log("Error: ", error);
          if(error.status == 401){ //Sesion expiró
            this.logout();
          }
          else {
            console.log (error)
            this.showError(error);
          }
      });
  }
  
  private folterItems(ev) {
    let val = ev.target.value;
    
    if (val && val.trim() != '') {
      switch (this.administration){
        case 'users':
          this.userList = this.userList.filter((item) => {
            return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
          break;
        case 'notifications':
          return this.userList;
      } 
    }
    else {
      this.userList = this.userListAll.slice();
    }
  }

  private openUserDetails(user) {
    //console.log("Usuario: ", user.id);
    this.navCtrl.push(UserDetailPage, {
      user: user
    })
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

  doRefresh(refresher) {
    this.showLoading();
    console.log("Refreshing: ", this.administration);
    setTimeout(() => {
      this.dismissLoading();
      switch (this.administration){
        case 'users':
          this.fillAllUsers();
          break;
        case 'notifications':
          //Call service to fill list of notifications
          break;
      }
      
      if(refresher != 0)
        refresher.complete();
    }, 2000);
  }

  private logout() {
    this.showError("La sesion ha caducado");
    this.auth.logout().subscribe(res => {
      this.app.getRootNav().setRoot(LoginPage);
    },
      error => {
        this.showError(error);
      });
  }
}
