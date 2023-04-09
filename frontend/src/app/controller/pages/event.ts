import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { faCalendar, faEdit } from '@fortawesome/free-regular-svg-icons';
import { Exam, Work, Leisure, Appointment } from 'src/app/model/event';

@Component({
  selector: 'event',
  templateUrl: '../../view/pages/event.html'
})
export class EventPage extends AppComponent { 
  faCalendar = faCalendar;
  faEdit = faEdit;
  VALID_ACTIONS = ["add", "edit"];
  
  authUser = localStorage.getItem('authUser');
  password = localStorage.getItem('password');

  action: string = "";
  strStartDate: string = "";
  strStartTime: string = "";
  strEndDate: string = "";
  strEndTime: string = "";
  short_desc: string = "";
  tag: string = "";

  event : Exam | Work | Leisure | Appointment = {
    event_id: 0,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    short_desc: "",
    desc: "",
    url_img: "",
    user_id: 1,
    see_all: false,
    url_ticket: ""
  };

  constructor(public route: ActivatedRoute, private renderer: Renderer2) {
    super();

    this.route.params.subscribe(params => {
      if (this.VALID_ACTIONS.includes(params['action'])) {
        this.action = params['action'];
        this.tag = params['tag'];
        const paramsLong = Object.keys(params).length;

        if (this.action === "add") {
          if (params['tag'] === undefined || params['datetime'] === undefined || paramsLong === 4) {
            window.location.href = "/";
          }
        }
        else {
          if (params['tag'] === undefined || params['short_desc'] === undefined || params['datetime'] === undefined) {
            window.location.href = "/";
          }
        } 
        
        const strStartDatetime = params['datetime'].split("_")[0];
        const strEndDatetime = params['datetime'].split("_")[1];
        const strStartDate = strStartDatetime.split("&")[0];
        const strStartTime = strStartDatetime.split("&")[1];
        const strEndDate = strEndDatetime.split("&")[0];
        const strEndTime = strEndDatetime.split("&")[1];


        const arrStartDate = strStartDate.split("-");
        const arrStartTime = strStartTime.split(":");
        const arrEndDate = strEndDate.split("-");
        const arrEndTime = strEndTime.split(":");

        const startDatetime = new Date(arrStartDate[0], Number(arrStartDate[1]) + 1, arrStartDate[2], arrStartTime[0], arrStartTime[1]);
        const endDatetime = new Date(arrEndDate[0], Number(arrEndDate[1]) + 1, arrEndDate[2], arrEndTime[0], arrEndTime[1]);

        if (this.action === "edit") {
          this.short_desc = params['short_desc'];
        }

        if (startDatetime instanceof Date && endDatetime instanceof Date) {
          this.strStartDate = strStartDate;
          this.strStartTime = strStartTime;
          this.strEndDate = strEndDate;
          this.strEndTime = strEndTime;
        } else {
          window.location.href = "/";
        }
      } else {
        window.location.href = "/";
      }
    });
  }

  @ViewChild("short_desc") short_desc_element: ElementRef | undefined;
  @ViewChild("startDatetime") startDatetime: ElementRef | undefined;
  @ViewChild("endDatetime") endDatetime: ElementRef | undefined;
  @ViewChild("bin") bin: ElementRef | undefined;

  ngOnInit() {    
    if (this.action === "edit") {
      this.http.post(`http://localhost:3000/getEvent?login=${this.authUser}&password=${this.password}&startDate=${this.strStartDate}&startTime=${this.strStartTime}&endDate=${this.strEndDate}&endTime=${this.strEndTime}&short_desc=${this.short_desc}&tag=${this.tag}`, null)
      .subscribe((obj : any) => {
        this.event = obj;
        this.renderer.setProperty(this.short_desc_element?.nativeElement, "value", this.event.short_desc);
        this.renderer.setProperty(this.startDatetime?.nativeElement, "value", `${this.event.startDate}T${this.event.startTime}`);
        this.renderer.setProperty(this.endDatetime?.nativeElement, "value", `${this.event.endDate}T${this.event.endTime}`);

        // Action Borrado del Evento //

        // this.renderer.listen(this.bin?.nativeElement, "click", () => {
        //   this.http.post(`http://localhost:3000/dropEvent?login=${this.authUser}&password=${this.password}&event_id=${this.event.event_id}&tag=${this.tag}`, null)
        //   .subscribe((obj : any) => {
        //     if (obj instanceof Object && obj['error'] === undefined) {
        //       alert(obj['exito']);
        //     } else {
        //       alert(obj['error']);
        //     }
        //   });
        // });

        // Action Borrado del Evento //

      });
    } else {

      // Para esperar a que cargue el DOM //

      setTimeout(() => {
        this.renderer.setProperty(this.startDatetime?.nativeElement, "value", `${this.strStartDate}T${this.strStartTime}`);
        this.renderer.setProperty(this.endDatetime?.nativeElement, "value", `${this.strEndDate}T${this.strEndTime}`);
      }, 100);

      // Para esperar a que cargue el DOM //  

    }
  }

  eventForm = new FormGroup(
    {
      newStartDatetime: new FormControl()
    }
  )

  createEvent(e: Event) {
    e.preventDefault();
    
    let { newStartDatetime } = this.eventForm.value;

    console.log(newStartDatetime);

    // this.http.post(`http://localhost:3000/createExamEvent?login=${this.authUser}&password=${this.password}&see_all=${true}&startTime=${this.strStartTime}&endDate=${this.strEndDate}&endTime=${this.strEndTime}&short_desc=${this.short_desc}&desc=${null}&url_img=${null}&url_doc=${null}&url_exam=${null}`, null)
    //   .subscribe((obj : any) => {
    //     alert(obj);
    //   });
  }


  updateEvent(e: Event) {
    e.preventDefault();

    let { newStartDatetime } = this.eventForm.value;

    console.log(newStartDatetime);

    // this.http.post(`http://localhost:3000/setExamEvent?login=${this.authUser}&password=${this.password}&see_all=${true}&startTime=${this.strStartTime}&endDate=${this.strEndDate}&endTime=${this.strEndTime}&short_desc=${this.short_desc}&desc=${null}&url_img=${null}&tag=${this.tag}&url_doc=${null}&url_exam=${null}`, null)
    //   .subscribe((obj : any) => {
    //     alert(obj);
    //   });
  }
}


 