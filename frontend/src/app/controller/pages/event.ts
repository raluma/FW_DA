import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'event',
  templateUrl: '../../view/pages/event.html'
})
export class Event extends AppComponent { 
  constructor(public route: ActivatedRoute) {
    super();
    this.route.params.subscribe(params => console.log(params));
  }
}


 