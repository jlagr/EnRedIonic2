import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { API_ENDPOINT } from '../../constants/api';
import { USER_ROLES } from '../../constants/api';
import { STORE_KEYS } from '../../constants/api';

@Injectable()
export class TicketServiceProvider {
  headers: any = new Headers();
  options: any = new RequestOptions;

  constructor(public http: Http, private auth: AuthServiceProvider) {
    this.headers.append('X-Auth-Token', this.auth.authToken);
    this.headers.append('content-type','application/json');
    this.options = new RequestOptions({ headers: this.headers});
  }

  public getTiketList(email) {
    var formData = {"p":"users","command":"userTickets","email":email}
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }

  public getTiketsEmpresaList(empresa) {
    var formData = {"p":"users","command":"getTiketsEmpresaList","empresa":empresa}
    console.log("Formdata: ", formData);
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }

  public getAllTiketsList(email) {
    var formData = {"p":"users","command":"getAllTiketsList"}
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }
}
