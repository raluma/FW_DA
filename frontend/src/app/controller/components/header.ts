import { Component } from '@angular/core';
import { Home } from '../pages/home';
import { faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'header',
    templateUrl: '../../view/components/header.html'
  })
  export class Header extends Home {
    faUser = faUser;
    faRightToBracket = faRightToBracket;

    showModal = false;

    toggleModal(){
      this.showModal = !this.showModal;
    }
  }