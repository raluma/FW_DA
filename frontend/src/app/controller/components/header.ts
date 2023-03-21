import { Component } from '@angular/core';
import { Home } from '../pages/home';
import { FormControl, FormGroup } from '@angular/forms';
import { faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'header',
    templateUrl: '../../view/components/header.html'
  })
  export class Header extends Home {
    showModal = false;

    toggleModal(){
      this.showModal = !this.showModal;
    }

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
        .subscribe((data) => {
          this.authUser = authUser;
          this.password = password;
          this.loged = true;
          console.log(data);
      });
    }

    logout() {
      this.authUser = "";
      this.password = "";
      this.loged = false;
      this.showModal = false;
    }

    faUser = faUser;
    faRightToBracket = faRightToBracket;
  }