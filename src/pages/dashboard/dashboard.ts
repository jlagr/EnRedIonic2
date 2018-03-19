import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonicPage, NavController, NavParams, ToastController, Loading, LoadingController} from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import { TicketServiceProvider } from '../../providers/ticket-service/ticket-service';
import { LoginPage } from '../login/login';
import { TicketDetailPage } from '../ticket-detail/ticket-detail';
@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  loading: Loading;
  currentUser: any;
  viewSelect: string = "mios";
  ticketList: any;
  ticketListAll: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthServiceProvider, 
    public tickets: TicketServiceProvider, private toastCtrl: ToastController,
    private loadingCtrl: LoadingController) {
    this.currentUser = auth.currentUser;
    this.showLoading();
    this.doRefresh(0);
  }

  public segmentChanged(event){
    this.viewSelect = event.value;
    this.doRefresh(0);
  }

  private fillAllTickets() {
    console.log("Llenando todos los tickets");
    setTimeout(() => {
      this.tickets.getTiketList(this.currentUser.email).subscribe(res => {
        //console.log(res);
        if(res.success){
          //console.log(res.result);
          this.ticketList = res.result;
          this.ticketListAll = this.ticketList.slice();
        }
        else {
          this.showError(res.msg);
        }
        
      },
        error => {
            if(error.status == 401){ //Sesion expiró
                this.showError("La sesión ha caducado");
                this.navCtrl.setRoot(LoginPage);
            }
            else {
              this.showError(error);
            }
        })}, 2000);
  }

  private fillMisTickets() {
    console.log("Llenando los tickets");
    setTimeout(() => {
      this.tickets.getTiketList(this.currentUser.email).subscribe(res => {
        //console.log(res);
        if(res.success){
          //console.log(res.result);
          this.ticketList = res.result;
          this.ticketListAll = this.ticketList.slice();
          
        }
        else {
          this.showError(res.msg);
        }
        
      },
        error => {
            if(error.status == 401){ //Sesion expiró
              this.showError("La sesión ha caducado");
              this.navCtrl.setRoot(LoginPage);
            }
            else {
              console.log(error)
            }
        })}, 2000);
  }

  private fillEmpresaTickets() {
    console.log("Llenando los tickets empresa: ", this.currentUser.empresa);
    setTimeout(() => {
      this.tickets.getTiketsEmpresaList(this.currentUser.empresaId).subscribe(res => {
        //console.log(res);
        if(res.success){
          //console.log(res.result);
          this.ticketList = res.result;
          this.ticketListAll = this.ticketList.slice();
          
        }
        else {
          this.showError(res.msg);
        }
        
      },
        error => {
            
            if(error.status == 401){ //Sesion expiró
              this.showError("La sesión ha caducado");
              this.navCtrl.setRoot(LoginPage);
            }
            else {
              this.showError(error);
            }
        })}, 2000);
  }

  private folterItems(ev) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.ticketList = this.ticketList.filter((item) => {
        return (item.titulo.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.id == val);
      })
    }
    else {
      this.ticketList = this.ticketListAll.slice();
    }
  }

  private openTicketDetails(ticket) {
    //console.log("Usuario: ", user.id);
    this.navCtrl.push(TicketDetailPage, {
      ticket: ticket
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

  ionViewDidLoad() {
    //this.doRefresh(0);
  }

  doRefresh(refresher) {
    this.showLoading();
    setTimeout(() => {
      this.dismissLoading();
      if(this.currentUser.rol == "user") {
        switch (this.viewSelect){
          case 'mios':
            //Call service to fill list of my tickets
            this.fillMisTickets();
            break;
          case 'empresa':
            //Call service to fill list of empresa tickets
            this.fillEmpresaTickets();
          break;
        }
      }
      else {
        this.fillAllTickets();
      }
      if(refresher != 0)
        refresher.complete();
    }, 2000);
  }
}
