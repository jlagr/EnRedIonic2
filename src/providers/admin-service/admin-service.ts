import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { API_ENDPOINT } from '../../constants/api';
import { STORE_KEYS } from '../../constants/api';

@Injectable()
export class AdminServiceProvider {
  headers: any = new Headers();
  options: any = new RequestOptions;
  empresas: any;

  constructor(public http: Http, private auth: AuthServiceProvider) {
    //console.log("Desde admin: ", this.auth.authToken);    
    // Set the token as header for all requests
    this.headers.append('X-Auth-Token', this.auth.authToken);
    this.headers.append('content-type','application/json');
    this.options = new RequestOptions({ headers: this.headers});

    this.getEmpresas();
  }

  public getUsersList() {
    var formData = {"p" : "users", "command" : "getAll"};
     //console.log(this.options);
     //console.log(formData);
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }

  public updateUser(user) {
    var act = 0;
    if(user.activo) {
      act = 1;
    }
    var formData = {'p':'users', 'command':'updateFromAdmin', 'id':user.id,
    'empresa':user.empresa, 'rol':user.rol, 'activo':act, 'email':user.email, 'nombre':user.nombre};
    //console.log(this.options.headers[0]);
    console.log(formData);
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }

  private getEmpresas() {
    if (this.empresas === undefined) {
      var formData = {'p':'users','command':'getEmpresas'};
      this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json()).subscribe(data => {
        if(data.success) {
          this.empresas = data.result;
          //console.log(this.empresas);
        }
        else {
          console.log(data);
        }
      });
    }
  }
}
