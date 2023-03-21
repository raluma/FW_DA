import { Component } from '@angular/core';
import { ModalAccess } from './modalAccess';

@Component({
    selector: 'login',
    templateUrl: '../../view/components/loginForm.html'
  })
  export class LoginForm extends ModalAccess { }