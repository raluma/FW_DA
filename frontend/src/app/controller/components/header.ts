import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Home } from '../pages/home';
import { FormControl, FormGroup } from '@angular/forms';
import { faUser, faRightToBracket, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'header',
    templateUrl: '../../view/components/header.html'
  })
  export class Header extends Home {
    constructor(private renderer: Renderer2) { super(); }

    faUser = faUser;
    faRightToBracket = faRightToBracket;
    faEye = faEye;
    faEyeSlash = faEyeSlash;

    modalStage = false;

    toggleModal() {
      this.modalStage = !this.modalStage;
    }
    
    modalLogin = true;

    toggleAuth() {
      this.modalLogin = !this.modalLogin;
    }

    @ViewChild("loginPassword") loginPassword: ElementRef | undefined;
    loginPasswordStage = false;

    toggleLoginPassword() {
      this.loginPassword?.nativeElement.focus();
      this.loginPasswordStage = !this.loginPasswordStage;

      if (this.loginPassword?.nativeElement.type === 'password') {
        this.renderer.setAttribute(this.loginPassword?.nativeElement, "type", "text");
      } else {
        this.renderer.setAttribute(this.loginPassword?.nativeElement, "type", "password");
      }
    }

    loginForm = new FormGroup(
      {
          authUser: new FormControl(),
          password: new FormControl()
      }
    )
  
    login(e: Event) {
      e.preventDefault();
      
      const { authUser, password } = this.loginForm.value;
  
      this.http.post(`http://localhost:3000/login?login=${authUser}&password=${password}`, null)
        .subscribe((obj : any) => {
          if (obj instanceof Object && obj['error'] !== undefined) {
            alert(obj['error']);
          } else {
            localStorage.setItem("authUser", authUser);
            localStorage.setItem("password", password);
            this.toggleModal();
          }
      });
    }

    logout() {
      localStorage.removeItem("authUser");
      localStorage.removeItem("password");
      
      window.location.href = "/";
    }

    @ViewChild("signUpPassword1") signUpPassword1: ElementRef | undefined;
    @ViewChild("signUpPassword2") signUpPassword2: ElementRef | undefined;
    signUpPassword1Stage = false;
    signUpPassword2Stage = false;

    toggleSignUpPassword1() {
      this.signUpPassword1?.nativeElement.focus();
      this.signUpPassword1Stage = !this.signUpPassword1Stage;

      if (this.signUpPassword1?.nativeElement.type === 'password') {
        this.renderer.setAttribute(this.signUpPassword1?.nativeElement, "type", "text");
      } else {
        this.renderer.setAttribute(this.signUpPassword1?.nativeElement, "type", "password");
      }
    }

    toggleSignUpPassword2() {
      this.signUpPassword2?.nativeElement.focus();
      this.signUpPassword2Stage = !this.signUpPassword2Stage;

      if (this.signUpPassword2?.nativeElement.type === 'password') {
        this.renderer.setAttribute(this.signUpPassword2?.nativeElement, "type", "text");
      } else {
        this.renderer.setAttribute(this.signUpPassword2?.nativeElement, "type", "password");
      }
    }

    signUpForm = new FormGroup(
      {
          email: new FormControl(),
          username: new FormControl(),
          password1: new FormControl(),
          password2: new FormControl()
      }
    );

    signUp(e: Event) {
      e.preventDefault();
      
      const { email, username, password1, password2 } = this.signUpForm.value;

      if (!String(email).toLowerCase().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        alert("El email no es válido.");
      }
      else if (!String(username).match(/^[a-zA-Z0-9]+$/)) {
        alert("El nombre de usuario no es válido.");
      }
      else if (password1 !== password2) {
        alert("Las contraseñas no coinciden.");
      }
      else {
        this.http.post(`http://localhost:3000/signup?email=${email}&username=${username}&password=${password1}`, null)
          .subscribe(() => {
            this.toggleModal();
        });
      }
    }   
  }