import { FormControl } from '@angular/forms';

export class RepasswordValidator {
    static isSame(control: FormControl): any {
        if(control.value != control.root.value['password']) {
            return {
                "El password no coincide": true
            }
        }

        return null;
    }
}