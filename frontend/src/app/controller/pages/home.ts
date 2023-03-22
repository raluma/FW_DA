import { Component } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'home',
  templateUrl: '../../view/pages/home.html'
})
export class Home extends AppComponent { 
  showProfile() {
    alert("Acceso al perfil");
  }
}


 