import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { Home } from '../pages/home';

@Component({
    selector: 'header',
    templateUrl: '../../view/components/header.html'
  })
  export class Header extends Home {
    faUser = faUser;
    faRightToBracket = faRightToBracket;

    showModal = false;

    form = new FormGroup(
      {
        authUser: new FormControl(),
        password: new FormControl()
      }
    )

    login(e: Event) {
      e.preventDefault();
      console.log(this.form.value)
      this.showModal = false;
    }

    toggleModal(){
      this.showModal = !this.showModal;
    }

    formLogin() {
      // this.http.post("http://localhost:3000/getEvents?login=Ralu&password=1234", null)
      //   .subscribe(data => {
          
      // });
    }

    closeSession() {
      this.loged = false;
    }
  }