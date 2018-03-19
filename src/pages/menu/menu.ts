import { DashboardPage } from './../dashboard/dashboard';
import { AccountPage } from './../account/account';
import { TabsPage } from './../tabs/tabs';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, Loading, LoadingController,ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';

export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}
 
@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  // Basic root for our content view
  rootPage = TabsPage;
  loading: Loading;
  currentUserRol = '';
  showAdmin = false;
  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;
  
  constructor(public navCtrl: NavController, private auth: AuthServiceProvider, private toastCtrl: ToastController,
    private loadingCtrl: LoadingController ) { 
      this.currentUserRol = this.auth.currentUser.rol;
    }
  
  private logout() {
    this.auth.logout().subscribe(res => {
      this.navCtrl.setRoot(LoginPage);
    },
      error => {
        this.showError(error);
      });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Autenticando...',
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

  public goToAdmin(){
    this.navCtrl.push('AdministrationPage');
  }

  public goToDashboard() {
    this.navCtrl.popToRoot();
  }
}