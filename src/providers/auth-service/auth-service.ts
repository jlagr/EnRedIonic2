import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Storage } from '@ionic/storage';
import { API_ENDPOINT } from '../../constants/api';
import { USER_ROLES } from '../../constants/api';
import { STORE_KEYS } from '../../constants/api';

export class User {
  nombre: string;
  email: string;
  movil: string;
  empresa: string;
  empresaId: string;
  proveedor: string;
  rol: string;

  constructor(nombre: string, email: string, movil: string, empresa: string, emprsaId: string, proveedor: string, rol: string) {
    this.nombre = nombre;
    this.email = email;
    this.movil = movil;
    this.empresa = empresa;
    this.empresaId = emprsaId;
    this.proveedor = proveedor;
    if (rol == 'admin') {
      this.rol = USER_ROLES.admin
    }
    if (rol == 'worker') {
      this.rol = USER_ROLES.worker
    }
    if (rol == 'user') {
      this.rol = USER_ROLES.user
    }
  }
}

@Injectable()
export class AuthServiceProvider {
  currentUser: User;
  headers: any = new Headers();
  options: any = new RequestOptions;
  isAuthenticated: boolean = false;
  authToken: string = '';

  constructor(public http: Http, private storage: Storage) {
    
  }

  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Favor de proporcionar sus credenciales.");
    } 
    else {
      var formData = {"p" : "login", "email" : credentials.email, "password" : credentials.password};
      return this.http.post(API_ENDPOINT.url,formData).map(res => res.json());
    }
  }
 
  public storeUserCredentials(data, token) {
    //console.log(token);
    //window.localStorage.setItem(STORE_KEYS.token, token);
    this.storage.set(STORE_KEYS.token,token);
    if(data != undefined){
      //window.localStorage.setItem(this.LOCAL_USER_EMAIL, data.email)
      this.storage.set(STORE_KEYS.email, data.email);
    }
    this.useCredentials(data, token);
  }

  public getStoredEmail(){
    return this.storage.get(STORE_KEYS.email);
  }

  private useCredentials(data, token) {
    this.isAuthenticated = true;
    this.authToken = token;
    //console.log("current: ", data);
    this.currentUser = new User(data.nombre,data.email,data.movil,data.empresa,data.empresaId, data.proveedorMovil,data.rol);
    
    // Set the token as header for all requests
    this.headers.append('X-Auth-Token', token);
    this.headers.append('content-type','application/json');
    this.options = new RequestOptions({ headers: this.headers});
  }

  public test(){
    var formData = {"p" : "check"};
    return this.http.post(API_ENDPOINT.url,formData,this.options).map(res => res.json());
  }

  public passwordReset(email){
    var formData = {"p" : "public", "command" : "requestPasswordChange", "email" :email};
    return this.http.post(API_ENDPOINT.url,formData).map(res => res.json());
  }

  public register(registerData) {
    var formData = {"p" : "public", "command":"add","nombre":registerData.nombre,
             "email": registerData.email, "movil": registerData.movil, 
             "proveedorMovil": registerData.proveedor, "password" : registerData.password};
    //console.log("Register form: " + formData);
    return this.http.post(API_ENDPOINT.url, formData).map(res => res.json());
  }
 
  public validatePasswordToken(token) {
    var formData = {"p" : "public", "command" : "validatePasswordToken", "token" : token};
    return this.http.post(API_ENDPOINT.url,formData).map(res => res.json());
  }

  public changePassword(resetData) {
    var formData = {"p" : "public", "command":"updatePassword","email":resetData.email,"password":resetData.password};
    console.log(formData);
    return this.http.post(API_ENDPOINT.url,formData).map(res => res.json());
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

  validateEmail(email){
    var formData = {"p" : "public", "email" : email, "command" : "validateEmail"};
    return this.http.post(API_ENDPOINT.url,formData, this.options).map(res => res.json());
  }
  
  public updateAccount(userData) {
    var formData = {'p' : 'users', 'command':'updateAccount','nombre':userData.nombre,
             'email' : userData.email, 'movil':userData.movil, 'proveedorMovil':userData.proveedor};
    // console.log(this.options.headers[0]);
    // console.log(formData);
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }

}
