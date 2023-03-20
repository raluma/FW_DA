import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { AppComponent } from '../app.component';

@Component({
    selector: 'login',
    templateUrl: '../../view/components/loginForm.html'
  })
  export class LoginForm extends AppComponent {
    http = inject(HttpClient);

    form = new FormGroup(
        {
            authUser: new FormControl(),
            password: new FormControl()
        }
    )

    login(e: Event) {
        e.preventDefault();
        
        const { authUser, password} = this.form.value;
    
        this.http.post(`http://localhost:3000/login?login=${authUser}&password=${password}`, null)
          .subscribe(data => {
            console.log(data);
            this.loged = true;
        });
      }
}