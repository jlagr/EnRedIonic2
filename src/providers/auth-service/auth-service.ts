import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { API_ENDPOINT } from '../../constants/api';
import { USER_ROLES } from '../../constants/api';

export class User {
  nombre: string;
  email: string;
  movil: string;
  empresa: string;
  proveedor: string;
  rol: string;

  constructor(nombre: string, email: string, movil: string, empresa: string, proveedor: string, rol: string) {
    this.nombre = name;
    this.email = email;
    this.movil = movil;
    this.empresa = empresa;
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
  LOCAL_TOKEN_KEY: string = 'EnRedToken';
  LOCAL_USER_EMAIL: string = 'EnRedUserEmail';
  isAuthenticated: boolean = false;
  authToken: string = '';

  constructor(public http: Http) {
    // this.headers.append('Access-Control-Allow-Origin' , '*');
    // this.headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
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
    window.localStorage.setItem(this.LOCAL_TOKEN_KEY, token);
    if(data != undefined){
      window.localStorage.setItem(this.LOCAL_USER_EMAIL, data.email)
    }
    this.useCredentials(data, token);
  }

  private useCredentials(data, token) {
    this.isAuthenticated = true;
    this.authToken = token;
    this.currentUser = new User(data.nombre,data.email,data.movil,data.empresa,data.proveedor,data.rol);
  
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
    var formData = {'p' : 'public', 'command':'add','nombre':registerData.nombre,
             'email': registerData.email, 'movil': registerData.movil, 
             'proveedorMovil': registerData.proveedor, 'password' : registerData.password};
    console.log("Register form: " + formData);
    return this.http.post(API_ENDPOINT.url, formData).map(res => res.json());
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
  

}
