import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { ActivatedRoute } from '@angular/router';
import { faCalendar, faEdit } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'event',
  templateUrl: '../../view/pages/event.html'
})
export class Event extends AppComponent { 
  faCalendar = faCalendar;
  faEdit = faEdit;

  action = "";

  constructor(public route: ActivatedRoute) {
    super();

    this.route.params.subscribe(params => {
      this.action = params['action'];
    });
  }
}


 