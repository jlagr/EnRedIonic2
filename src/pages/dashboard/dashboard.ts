import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  currentUser: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthServiceProvider) {
    this.currentUser = auth.currentUser;
  }

  test(){
    this.auth.test().subscribe(res => {
      console.log(res);
    })
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad DashboardPage');
  }

}
