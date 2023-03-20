import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

      // this.http.post("http://localhost:3000/getEvents?login=Ralu&password=1234", null)
      //   .subscribe(data => {
          
      // });
    }

    toggleModal(){
      this.showModal = !this.showModal;
    }

    closeSession() {
      this.loged = false;
    }
  }