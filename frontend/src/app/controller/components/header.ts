import { Component } from '@angular/core';
import { Home } from '../pages/home';
import { FormControl, FormGroup } from '@angular/forms';
import { faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'header',
    templateUrl: '../../view/components/header.html'
  })
  export class Header extends Home {
    faUser = faUser;
    faRightToBracket = faRightToBracket;

    modalStage = false;

    toggleModal() {
      this.modalStage = !this.modalStage;
    }

    loginForm = new FormGroup(
      {
          authUser: new FormControl(),
          password: new FormControl()
      }
    )
  
    login(e: Event) {
      e.preventDefault();
      
      const { authUser, password} = this.loginForm.value;
  
      this.http.post(`http://localhost:3000/login?login=${authUser}&password=${password}`, null)
        .subscribe(() => {
          sessionStorage.setItem("authUser", authUser);
          sessionStorage.setItem("password", password);
          this.toggleModal();
      });
    }

    logout() {
      sessionStorage.removeItem("authUser");
      sessionStorage.removeItem("password");
    }
  }