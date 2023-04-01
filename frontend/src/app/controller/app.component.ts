import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: '../view/app.component.html'
})
export class AppComponent {
  http = inject(HttpClient);

  isLoged() {
    const authUser = localStorage.getItem('authUser');
    const password = localStorage.getItem('password');
    let loged = false;

    this.http.post(`http://localhost:3000/login?login=${authUser}&password=${password}`, null)
        .subscribe((obj : any) => {
          if (obj['error'] === undefined) loged = true;
    });

    return loged;
  }
}
