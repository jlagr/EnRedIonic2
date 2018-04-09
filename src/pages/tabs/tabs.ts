import { Component } from '@angular/core';

import { DashboardPage } from '../dashboard/dashboard';
import { TicketDetailPage } from '../ticket-detail/ticket-detail';
import { NotificationsPage } from '../notifications/notifications';
import { AccountPage } from '../account/account';
import { NavParams, Select } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = DashboardPage;
  tab2Root = TicketDetailPage;
  tab3Root = NotificationsPage;
  tab4Root = AccountPage;
  myIndex: number;

  constructor(navParams: NavParams) {
    this.myIndex = navParams.data.tabIndex || 0;
    
  }

  ionViewWillEnter() {
    //console.log("tabs activas");
  }

}
