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
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }

  public getAllTiketsList(email) {
    var formData = {"p":"users","command":"getAllTiketsList"}
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }

  public getImageList(ticket){
    var formData = {"p": "tickets", "command": "getImages", "ticket":ticket}
    //console.log("Formdata: ", formData);
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }

  public getEditType(userRol, ticketStatus) {
    //Reglas para la ediciòn del ticket.
    //1: Solo el admin puede editar todo el ticket sin restrincciones.
    //2: El trabajador puede editar solo los comentarios, agregar fotos y el estatus.
    //3: El usuario puede editar solo el titulo y fotos si el ticket está en "abierto"
    //Si el ticket esta cerrado solo el admin puede editar
    //TODO: en la base de datos se guarda una aditoria de cada cambio, el usuario que lo hace y el día.
    console.log(userRol + "-" + ticketStatus);
    switch (userRol) {
      case "admin": return 1;
      case "worker": 
        if(ticketStatus == "abierto" || ticketStatus == "en proceso"){
          return 2;
        }
      case "user": 
        if(ticketStatus == "abierto" || ticketStatus == "en proceso"){
          return 3;
        }
    }
    return 0;
  }

  public updateTicket(ticket) {
    var formData = {"p": "tickets", "command": "updateTicket", "titulo":ticket.titulo , "descripcion":ticket.descripcion, 
    "comentarios":ticket.comentarios ,"id":ticket.id, "estatus":ticket.estatus};
    console.log("Formdata: ", formData);
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }

  public updateTicketStatus(id,estatus) {
    var formData = {"p": "tickets", "command": "updateTicketStatus", "id":id, "estatus":estatus};
    console.log("Formdata: ", formData);
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }

  public addNewTicket(user, ticket, lat, long) {
    var formData = {"p": "tickets", "command": "addNewTicket", "titulo":ticket.titulo , "descripcion":ticket.descripcion, 
    "nombre":user.nombre ,"email":user.email, lat:lat,long:long};
    console.log("Formdata: ", formData);
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }

  public uploadImages(ticket,thum,image){
    var formData = {"p": "tickets", "command": "uploadImage64", "id":ticket.id , "thum":thum, 
    "image":image};
    console.log("Formdata: ", formData);
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }

  public getImage(imageId) {
    var formData = {"p": "tickets", "command": "getImage64", "id":imageId};
    //console.log("Formdata: ", formData);
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }

  public deliteImage(imageId) {
    var formData = {"p": "tickets", "command": "deliteImage", "id":imageId};
    //console.log("Formdata: ", formData);
    return this.http.post(API_ENDPOINT.url, formData, this.options).map(res => res.json());
  }
}
