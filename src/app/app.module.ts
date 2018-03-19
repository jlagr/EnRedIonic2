import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { IonicStorageModule } from '@ionic/storage';
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
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { EmailValidator } from '../validators/email';
import { AdministrationPage } from '../pages/administration/administration';
import { AdminServiceProvider } from '../providers/admin-service/admin-service';
import { UserDetailPage } from '../pages/user-detail/user-detail';
import { TicketServiceProvider } from '../providers/ticket-service/ticket-service';

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
    AccountPage,
    ResetPasswordPage,
    UserDetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, { 
      links: [
        {component: RegisterPage, name: 'Register' , segment: 'register'},
        {component: LoginPage, name: 'Login' , segment: 'login' },
        {component: AdministrationPage, name: 'Administration' , segment: 'administration' },
      ]
    }),
    IonicStorageModule.forRoot()
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
    AccountPage,
    ResetPasswordPage,
    UserDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    EmailValidator,
    BarcodeScanner,
    AdminServiceProvider,
    TicketServiceProvider
  ]
})
export class AppModule {}
