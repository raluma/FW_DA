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

  VALID_ACTIONS = ["add", "edit"]
  action = "";

  constructor(public route: ActivatedRoute) {
    super();

    this.route.params.subscribe(params => {
      if (this.VALID_ACTIONS.includes(params['action'])) {
        const paramsLong = Object.keys(params).length;
        this.action = params['action'];
        
        if (params['action'] === "add") {
          if (params['datetime'] === undefined || paramsLong === 3) {
            window.location.href = "/";
          }
        }
        else {
          if (params['short_desc'] === undefined || params['datetime'] === undefined) {
            window.location.href = "/";
          }
        } 
      } else {
        window.location.href = "/";
      }
    });
  }
}


 