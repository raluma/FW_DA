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

  user : User = {
    username: '',
    password: '',
    email: '',
    role: ''
  };

  ngOnInit(): void {
    const authUser = localStorage.getItem("authUser");
    const password = localStorage.getItem("password");

    this.http.post(`http://localhost:3000/login?login=${authUser}&password=${password}`, null)
    .subscribe((obj : any) => {
      if (obj instanceof Object && obj['error'] === undefined) {
        this.user = obj;
        this.renderer.setProperty(this.userEmail?.nativeElement, "value", this.user.email);
        this.renderer.setProperty(this.userName?.nativeElement, "value", this.user.username);
        this.renderer.setProperty(this.userPassword?.nativeElement, "value", this.user.password);
      }
    });
  }

  updateUserForm = new FormGroup(
    {
        newUsername: new FormControl(),
        newEmail: new FormControl(),
        newPassword: new FormControl()
    }
  )

  updateUser(e: Event) {
    e.preventDefault();

    const authUser = localStorage.getItem("authUser");
    const password = localStorage.getItem("password");

    let { newUsername, newEmail, newPassword } = this.updateUserForm.value;

    if (newUsername === null) newUsername = this.user.username;
    if (newEmail === null) newEmail = this.user.email;
    if (newPassword === null) newPassword = this.user.password;

    if (newEmail !== null || newUsername !== null || newPassword !== null) {
      this.http.post(`http://localhost:3000/setUser?login=${authUser}&password=${password}&username=${newUsername}&email=${newEmail}&newPassword=${newPassword}`, null)
        .subscribe((obj : any) => {
          if (obj instanceof Object && obj['error'] !== undefined) {
            alert(obj['error']);
          } else {
            localStorage.setItem("authUser", newUsername);
            localStorage.setItem("password", newPassword);
            alert(obj["exito"]);
          }
      });
    }
  }
}


 