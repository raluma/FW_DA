import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/model/user';

@Component({
  selector: 'profile',
  templateUrl: '../../view/pages/profile.html'
})
export class Profile extends AppComponent { 
  constructor(private renderer: Renderer2) { super(); }

  @ViewChild("userEmail") userEmail: ElementRef | undefined;
  @ViewChild("userName") userName: ElementRef | undefined;
  @ViewChild("userPassword") userPassword: ElementRef | undefined;

  authUser = localStorage.getItem("authUser");
  password = localStorage.getItem("password");

  user : User = {
    username: '',
    password: '',
    email: '',
    role: ''
  };

  ngOnInit(): void {
    this.http.post(`http://localhost:3000/login?login=${this.authUser}&password=${this.password}`, null)
    .subscribe((obj : any) => {
      if (obj instanceof Object && obj['error'] !== undefined) {
        alert(obj['error']);
        window.location.href = "/";
      } else {
        this.user = obj;
        this.renderer.setProperty(this.userEmail?.nativeElement, "value", this.user.email);
        this.renderer.setProperty(this.userName?.nativeElement, "value", this.user.username);
        this.renderer.setProperty(this.userPassword?.nativeElement, "value", this.user.password);
      }
    });
  }

  updateUserForm = new FormGroup(
    {
        email: new FormControl(),
        username: new FormControl(),
        password: new FormControl()
    }
  )

  updateUser(e: Event) {
    e.preventDefault();

    const { email, username, password } = this.updateUserForm.value;

    if (email !== null || username !== null || password !== null) {
      console.log(email, username, password);
    }
  }
}


 