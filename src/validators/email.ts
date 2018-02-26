import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

@Injectable()
export class EmailValidator {
    debouncer: any;

    constructor (public authProvider: AuthServiceProvider){

    }

    checkEmail(control: FormControl): any {
        
        clearTimeout(this.debouncer);

        return new Promise(resolve => {
 
            this.debouncer = setTimeout(() => {
       
              this.authProvider.validateEmail(control.value).subscribe((res) => {
                console.log(res.data);
                if(res.success){
                  resolve(null);
                }
              }, (err) => {
                resolve({'El email ya existe': true});
              });
       
            }, 1000);     
       
          });
    }
}