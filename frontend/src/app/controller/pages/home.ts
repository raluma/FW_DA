import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'home',
  templateUrl: '../../view/pages/home.html'
})
export class Home extends AppComponent { 
    form = new FormGroup(
      {
          authUser: new FormControl(""),
          password: new FormControl()
      }
    )
  
    login(e: Event) {
      e.preventDefault();
      
      const { authUser, password} = this.form.value;
  
      this.http.post(`http://localhost:3000/login?login=${authUser}&password=${password}`, null)
        .subscribe((data) => {

      });
    }
}


 