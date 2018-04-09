import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TicketDetailPage } from '../ticket-detail/ticket-detail'

@IonicPage()
@Component({
  selector: 'page-new-ticket',
  templateUrl: 'new-ticket.html',
})
export class NewTicketPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.navCtrl.push(TicketDetailPage, {
      ticket: null
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewTicketPage');
  }

}
