import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { LoginPopoverPage } from '../pages/login-popover/login-popover'
import { RegisterPage } from '../pages/register/register';
import { MenuPage } from '../pages/menu/menu';
import { TabsPage } from '../pages/tabs/tabs';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { TicketDetailPage } from '../pages/ticket-detail/ticket-detail';
import { NewTicketPage } from '../pages/new-ticket/new-ticket';
import { NotificationsPage } from '../pages/notifications/notifications';
import { NotificationDetailPage } from '../pages/notification-detail/notification-detail'
import { AccountPage } from '../pages/account/account';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    LoginPopoverPage,
    MenuPage,
    TabsPage,
    DashboardPage,
    TicketDetailPage,
    NewTicketPage,
    NotificationsPage,
    NotificationDetailPage,
    AccountPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, { 
      links: [
        {component: RegisterPage, name: 'Register' , segment: 'register'},
        {component: LoginPage, name: 'Login' , segment: 'login' }
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    LoginPopoverPage,
    MenuPage,
    TabsPage,
    DashboardPage,
    TicketDetailPage,
    NewTicketPage,
    NotificationsPage,
    NotificationDetailPage,
    AccountPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider
  ]
})
export class AppModule {}
