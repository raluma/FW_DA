import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: '../view/app.component.html'
})
export class AppComponent {
  http = inject(HttpClient);

  authUser = "";
  password = "";
  loged = false;
}
