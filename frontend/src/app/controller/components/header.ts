import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Home } from '../pages/home';
import { FormControl, FormGroup } from '@angular/forms';
import { faUser, faRightToBracket, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'header',
    templateUrl: '../../view/components/header.html'
  })
  export class Header extends Home {
    @ViewChild("password") password: ElementRef | undefined;

    constructor(private renderer: Renderer2) { super();}

    faUser = faUser;
    faRightToBracket = faRightToBracket;
    faEye = faEye;
    faEyeSlash = faEyeSlash;

    modalStage = false;
    modalLogin = true;
    passwordStage = false;
   

    toggleModal() {
      this.modalStage = !this.modalStage;
    }

    toggleAuth() {
      this.modalLogin = !this.modalLogin;
    }

    togglePassword() {
      this.passwordStage = !this.passwordStage;

      if (this.password?.nativeElement.type === 'password') {
        this.renderer.setAttribute(this.password?.nativeElement, "type", "text");
      } else {
        this.renderer.setAttribute(this.password?.nativeElement, "type", "password");
      }

      this.password?.nativeElement.focus();
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
          localStorage.setItem("authUser", authUser);
          localStorage.setItem("password", password);
          this.toggleModal();
      });
    }

    logout() {
      localStorage.removeItem("authUser");
      localStorage.removeItem("password");
    }
  }