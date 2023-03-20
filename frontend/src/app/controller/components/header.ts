import { Component } from '@angular/core';
import { faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { AppComponent } from '../app.component';

@Component({
    selector: 'header',
    templateUrl: '../../view/components/header.html'
  })
  export class Header extends AppComponent {
    faUser = faUser;
    faRightToBracket = faRightToBracket;

    showModal = false;

    toggleModal(){
      this.showModal = !this.showModal;
    }

    logout() {
      this.authUser = "";
      this.password = "";
      this.loged = false;
      this.showModal = false;
    }
  }