import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Loading, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import { TicketServiceProvider } from '../../providers/ticket-service/ticket-service';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-ticket-detail',
  templateUrl: 'ticket-detail.html',
})
export class TicketDetailPage {
  ticket: any;
  viewSelect: string = "text";
  currentUser: any;
  ticketForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthServiceProvider, 
    public tickets: TicketServiceProvider, private toastCtrl: ToastController,
    private loadingCtrl: LoadingController, public formBuilder: FormBuilder) {
    //Reference to current user
    this.currentUser = this.auth.currentUser;
    //Get selected ticket from patameters
    this.ticket = this.navParams.get('ticket');
    //Creates the user form with selected user data
    this.ticketForm = formBuilder.group({
      id: [this.ticket.id],
      titulo: [this.ticket.titulo],
      descripcion: [this.ticket.descripcion],
      comentarios: ["Hola"]
    });
  }

  updateTicket() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketDetailPage');
  }

  ionViewWillEnter() {
    this.viewSelect = "text"
  }

  public segmentChanged(event){
    this.viewSelect = event.value;
  }
}
