import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, App, NavParams, ToastController, AlertController, ModalController, Loading, LoadingController, FabContainer } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import { TicketServiceProvider } from '../../providers/ticket-service/ticket-service';
import { LoginPage } from '../login/login';
import { API_ENDPOINT } from '../../constants/api';
import { ImagepagePage } from '../imagepage/imagepage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@IonicPage()
@Component({
  selector: 'page-ticket-detail',
  templateUrl: 'ticket-detail.html',
})

export class TicketDetailPage {
  loading: Loading;
  ticket: any;
  componentTitle: string = "Nuevo Ticket"
  viewSelect: string = "text";
  currentUser: any;
  ticketForm: FormGroup;
  submitAttempt: boolean = false;
  images: any;
  imagePath: string = "";
  editType: number;
  cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    correctOrientation: true,
    allowEdit: false
  }; 
  bigImg = null;
  bigSize = '0';
  medImg = null;
  medSize = '0';
  smallImg = null;
  smallSize = '0';
  lat: number = 0;
  long: number = 0;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthServiceProvider, 
    public tickets: TicketServiceProvider, private toastCtrl: ToastController,
    private loadingCtrl: LoadingController, public formBuilder: FormBuilder,
    public modalCtrl: ModalController, private camera: Camera, 
    public geolocation: Geolocation, private alertCtrl: AlertController, private app: App) {
    //Reference to current user
    this.currentUser = this.auth.currentUser;
    //Get selected ticket from patameters
    if(this.navParams.get('ticket') == null) {
      this.ticket = {id:"0", titulo:"", descripcion:"", comentarios:"", estatus:"abierto", fecha:Date.now(), lat:0, long:0};
    }
    else 
    {
      this.ticket = this.navParams.get('ticket');
      this.componentTitle = this.ticket.id + "-" + this.ticket.descripcion;
    }
    
    //Reglas para el tipo de edición
    this.editType = 3;
    this.editType = this.tickets.getEditType(this.currentUser.rol, this.ticket.estatus);
    console.log("editType: ", this.editType);
    //Creates the user form with selected user data
    this.ticketForm = formBuilder.group({
      id: [this.ticket.id],
      titulo: [this.ticket.titulo, Validators.compose([Validators.maxLength(100), Validators.required])],
      descripcion: [this.ticket.descripcion, Validators.compose([Validators.maxLength(500), Validators.required])],
      comentarios: [this.ticket.comentarios],
      estatus: [this.ticket.estatus]
    });
  }

  updateTicket() {
    this.submitAttempt = true;
    console.log("Updating...", this.ticket.valid);
    if(this.ticketForm.valid) {
      this.showLoading();
      setTimeout(() => {
        this.tickets.updateTicket(this.ticketForm.value).subscribe(res => {
          console.log(res);
          this.dismissLoading();
          if (res.success) {
            this.showMessage("El ticket se actualizó correctamente");
          } else {
            this.showError("No fue posible actualizar el ticket, comuniquese con el administrador de la aplicación");
          }
        },
          error => {
            this.dismissLoading();
            this.showError(error);
            if(error.status == 401){ //Sesion expiró
              this.logout();
           }
          });
      },2000);
    }
  }

  saveTicket() {
    this.submitAttempt = true;
    
    if(this.ticketForm.valid) {
      this.showLoading();
      setTimeout(() => {
        this.tickets.addNewTicket(this.currentUser,this.ticketForm.value, this.lat, this.long).subscribe(res => {
          console.log(res);
          this.dismissLoading();
          if (res.success) {
            this.showMessage("Se generó el ticket número: " + res.data);
          } else {
            this.showError("No fue posible generar el ticket, comuniquese con el administrador de la aplicación");
          }
        },
          error => {
            this.dismissLoading();
            this.showError(error);
            if(error.status == 401){ //Sesion expiró
              this.logout();
           }
          });
      },2000);
    }
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  ionViewWillEnter() {
    this.viewSelect = "text"
    this.getImages();
  }

  public segmentChanged(event){
    this.viewSelect = event.value;
  }

  private getImages(){
    this.tickets.getImageList(this.ticket.id).subscribe(res => {
      //console.log(res);
      if(res.success){
        //console.log(res.result);
        this.images = res.data;
      }
      else {
        console.log(res.msg);
      }
      
    },
      error => {
          if(error.status == 401){ //Sesion expiró
            this.logout();
          }
          else {
            this.showError(error);
          }
    })
  }

  showMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'middle',
      cssClass: "toastBox",
    });
    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });
  
    toast.present();
  }

  showError(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'buttom',
      showCloseButton: true,
      closeButtonText: 'Ok',
      cssClass: 'toastBox'
    });
    toast.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
    }
  }

  openImage(imageId) {
    //console.log("Open: ", imageId);
    let imageModal = this.modalCtrl.create(ImagepagePage, {imageId:imageId, titulo:this.ticket.titulo});
    imageModal.onDidDismiss(() => {
      this.getImages();
    });
    imageModal.present();
  }

  imageFromCamera(event, fab: FabContainer) {
    fab.close();
    this.cameraOptions.sourceType = this.camera.PictureSourceType.CAMERA;
    this.takeImage();
  }
  imageFromGallery(event, fab: FabContainer) {
    fab.close();
    this.cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    this.takeImage();
  }

  takeImage() {
    this.camera.getPicture(this.cameraOptions).then(imageData => {
      let base64data = 'data:image/jpeg;base64,' + imageData;
      //console.log("Big: ", base64data);
      this.bigImg = base64data;
      this.bigSize = this.getImageSize(this.bigImg);
      this.reziseImage();
      this.createThumbnail();
      this.uploadImages();
    }, err => {
      console.log('gallery error: ', err);
    });
  }

  reziseImage() {
    this.generateFromImage(this.bigImg, 720, 720, 0.9, data => {
      this.medImg = data;
      //console.log("Med:", data);
      //this.medSize = this.getImageSize(this.medImg);
    });
  }

  createThumbnail() {
    this.generateFromImage(this.bigImg, 300, 300, 0.8, data => {
      this.smallImg = data;
      //console.log("Thumb:", data);
      //this.smallSize = this.getImageSize(this.smallImg);
    });
  }

  generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
    var canvas: any = document.createElement("canvas");
    var image = new Image();
 
    image.onload = () => {
      var width = image.width;
      var height = image.height;
 
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
 
      ctx.drawImage(image, 0, 0, width, height);
 
      // IMPORTANT: 'jpeg' NOT 'jpg'
      var dataUrl = canvas.toDataURL('image/jpeg', quality);

      callback(dataUrl)
    }
    image.src = img;
  }
 
  getImageSize(data_url) {
    var head = 'data:image/jpeg;base64,';
    return ((data_url.length - head.length) * 3 / 4 / (1024*1024)).toFixed(4);
  }

  uploadImages(){
    console.log("subiendo...");
    //if(this.medImg != null && this.smallImg != null) {
      console.log('paso1');
      this.showLoading();
      setTimeout(() => {
        this.tickets.uploadImages(this.ticket, this.smallImg, this.medImg).subscribe(res => {
          console.log("result: ", res);
          this.dismissLoading();
          if (res.success) {
            this.getImages();
          } else {
            this.showError("Error al agregar la imagen");
          }
        },
          error => {
            this.dismissLoading();
            this.showError(error);
            if(error.status == 401){ //Sesion expiró
              this.logout();
           }
          });
      },2000);
    //}
  }

  loadMap() {
    console.log('loading map');
    //console.log("pos: ", this.ticket.lat, ",", this.ticket.lon);
    var latLng: any;
    if(this.ticket.id > 0) 
    {
      //Position is getting from ticket data
      if(this.ticket.lat != null && this.ticket.lon != null) 
      {
        console.log("Usando la posision del ticket");
        let latLng = new google.maps.LatLng(this.ticket.lat, this.ticket.lon);
      }
      else
      {
        console.log("Usando la posision fake");
        let latLng = new google.maps.LatLng(-34.9290, 138.6010);
      }
      
      let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarker();
    }
    else 
    {
      //Position is calculated from device location
      this.geolocation.getCurrentPosition().then((position) => {
        this.lat = position.coords.latitude;
        this.long =  position.coords.longitude;
        console.log("pos:", this.lat,this.long);
        let latLng = new google.maps.LatLng(this.lat, this.long);
  
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
  
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.addMarker();
      }, (err) => {
        console.log(err);
      });
    }
    
  }

  addMarker(){
 
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
   
    let content = "<p class='ticket-box'>" + this.ticket.id + " - " + this.ticket.titulo + "</p>";         
   
    this.addInfoWindow(marker, content);
   
  }

  addInfoWindow(marker, content){
 
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
   
  }
  
  changeStatusDialog() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Cambiar Estatus');

    alert.addInput({
      type: 'radio',
      label: 'abierto',
      value: 'abierto',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'en proceso',
      value: 'en proceso'
    });

    alert.addInput({
      type: 'radio',
      label: 'cerrado',
      value: 'cerrado'
    });

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        if(data != this.ticket.estatus){
          this.changeStatus(data);
        }
      }
    });
    alert.present();
  }

  changeStatus(newStatus){
    this.ticket.estatus = newStatus;
    this.showLoading();
      setTimeout(() => {
        this.tickets.updateTicketStatus(this.ticket.id, newStatus).subscribe(res => {
          console.log(res);
          this.dismissLoading();
          if (res.success) {
            this.showMessage("El ticket se actualizó correctamente");
          } else {
            this.showError("No fue posible actualizar el ticket, comuniquese con el administrador de la aplicación");
          }
        },
          error => {
            this.dismissLoading();
            this.showError(error);
            if(error.status == 401){ //Sesion expiró
              this.logout();
           }
          });
      },2000);
  }

  private logout() {
    this.showError("Su session ha caducado.");
    this.auth.logout().subscribe(res => {
      this.app.getRootNav().setRoot(LoginPage);
    },
      error => {
        this.showError(error);
      });
  }
}
