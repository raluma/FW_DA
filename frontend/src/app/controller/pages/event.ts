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

  // Variables para añadir //

  strStartDate: string = "";
  strStartTime: string = "";
  strEndDate: string = "";
  strEndTime: string = "";
  tag: string = "";

  // Variables para añadir //

  event_id: Number = 0; // Variables para editar //

  event : Exam | Work | Leisure | Appointment = {
    event_id: 0,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    short_desc: "",
    desc: "",
    url_img: "",
    user_id: 0,
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
          } else {
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

            if (startDatetime instanceof Date && endDatetime instanceof Date) {
              this.strStartDate = strStartDate;
              this.strStartTime = strStartTime;
              this.strEndDate = strEndDate;
              this.strEndTime = strEndTime;
            } else {
              window.location.href = "/";
            }
          }
        }
        else {
          if (params['event_id'] === undefined) {
            window.location.href = "/";
          } else {
            this.event_id = params['event_id'];
          }
        }   
      } else {
        window.location.href = "/";
      }
    });
  }

  @ViewChild("tagColor") tagColor: ElementRef | undefined;
  @ViewChild("tagNameSP") tagNameSP: ElementRef | undefined;
  @ViewChild("short_desc") short_desc: ElementRef | undefined;
  @ViewChild("desc") desc: ElementRef | undefined;
  @ViewChild("startDatetime") startDatetime: ElementRef | undefined;
  @ViewChild("endDatetime") endDatetime: ElementRef | undefined;
  @ViewChild("bin") bin: ElementRef | undefined;

  ngOnInit() {    
    if (this.action === "edit") {
      this.http.post(`http://localhost:3000/getEvent?login=${this.authUser}&password=${this.password}&event_id=${this.event_id}`, null)
      .subscribe((eventObj : any) => {
        if (eventObj instanceof Object && eventObj['error'] === undefined) {
          this.event = eventObj;
          this.renderer.setProperty(this.short_desc?.nativeElement, "value", this.event.short_desc);
          this.renderer.setProperty(this.desc?.nativeElement, "value", this.event.desc);
          this.renderer.setProperty(this.startDatetime?.nativeElement, "value", `${this.event.startDate}T${this.event.startTime}`);
          this.renderer.setProperty(this.endDatetime?.nativeElement, "value", `${this.event.endDate}T${this.event.endTime}`);
          this.tag = eventObj['tag'];

          this.http.get(`http://localhost:3000/getTag?tagName=${eventObj['tag']}`)
          .subscribe((tagObject : any) => {
            if (tagObject instanceof Object && tagObject['error'] === undefined) {
              this.renderer.setProperty(this.tagNameSP?.nativeElement, "textContent", tagObject['tagNameSP']);
              this.renderer.setStyle(this.tagColor?.nativeElement, "background-color", tagObject['color']);
            } else {
              alert(tagObject)
            }
          });

          // Action Borrado del Evento //

          this.renderer.listen(this.bin?.nativeElement, "click", () => {
            this.http.post(`http://localhost:3000/dropEvent?login=${this.authUser}&password=${this.password}&event_id=${this.event.event_id}&tag=${this.tag}`, null)
            .subscribe((obj : any) => {
              if (obj instanceof Object && obj['error'] === undefined) {
                alert(obj['exito']);
              } else {
                alert(obj['error']);
              }

              window.location.href = "/";
            });
          });

          // Action Borrado del Evento //

        } else {
          alert(eventObj['error']);
        }
      });
    } else {

      // Para esperar a que cargue el DOM //

      setTimeout(() => {
        this.renderer.setProperty(this.startDatetime?.nativeElement, "value", `${this.strStartDate}T${this.strStartTime}`);
        this.renderer.setProperty(this.endDatetime?.nativeElement, "value", `${this.strEndDate}T${this.strEndTime}`);

        this.http.get(`http://localhost:3000/getTag?tagName=${this.tag}`)
        .subscribe((tagObject : any) => {
          this.renderer.setProperty(this.tagNameSP?.nativeElement, "textContent", tagObject['tagNameSP']);
          this.renderer.setStyle(this.tagColor?.nativeElement, "background-color", tagObject['color']);
        });
      }, 100);

      // Para esperar a que cargue el DOM //  

    }
  }

  eventForm = new FormGroup(
    {
      newStartDatetime: new FormControl(),
      newEndDatetime: new FormControl(),
      newShort_desc: new FormControl(),
      newDesc: new FormControl()
    }
  )

  createEvent(e: Event) {
    e.preventDefault();

    let { newStartDatetime, newEndDatetime, newShort_desc, newDesc } = this.eventForm.value; 
    let newStartDate, newStartTime, newEndDate, newEndTime;

    if (newStartDatetime === "" || newEndDatetime === "" || newShort_desc === "") {
      alert("El evento debe tener como mínimo una fecha de comienzo, una fecha de final y una descripción corta");
      window.location.reload();
    } 
    else if (newStartDatetime !== null || newEndDatetime !== null || newShort_desc !== null || newDesc !== null) {

      if (newStartDatetime === null) {
        newStartDate = this.strStartDate;
        newStartTime = this.strStartTime;
      }

      if (newEndDatetime === null) {
        newEndDate = this.strEndDate;
        newEndTime = this.strEndTime;
      }

      switch (this.tag) {
        case "exam":
          this.http.post(`http://localhost:3000/createExamEvent?login=${this.authUser}&password=${this.password}&see_all=${true}&startDate=${newStartDate}&startTime=${newStartTime}&endDate=${newEndDate}&endTime=${newEndTime}&short_desc=${newShort_desc}&desc=${newDesc}&url_img=&url_doc=&url_exam=`, null)
          .subscribe((obj : any) => {
            if (obj instanceof Object && obj['error'] === undefined) {
              alert(obj['exito']);
              window.location.href = "/";
            } else {
              alert(obj['error']);
            }
          });
          break;
        case "work":
          this.http.post(`http://localhost:3000/createWorkEvent?login=${this.authUser}&password=${this.password}&see_all=${true}&startDate=${newStartDate}&startTime=${newStartTime}&endDate=${newEndDate}&endTime=${newEndTime}&short_desc=${newShort_desc}&desc=${newDesc}&url_img=&team=&url_doc=&url_work=`, null)
          .subscribe((obj : any) => {
            if (obj instanceof Object && obj['error'] === undefined) {
              alert(obj['exito']);
              window.location.href = "/";
            } else {
              alert(obj['error']);
            }
          });
          break;
        case "leisure":
          this.http.post(`http://localhost:3000/createLeisureEvent?login=${this.authUser}&password=${this.password}&startDate=${newStartDate}&startTime=${newStartTime}&endDate=${newEndDate}&endTime=${newEndTime}&short_desc=${newShort_desc}&desc=${newDesc}&url_img=&url_ticket=`, null)
          .subscribe((obj : any) => {
            if (obj instanceof Object && obj['error'] === undefined) {
              alert(obj['exito']);
              window.location.href = "/";
            } else {
              alert(obj['error']);
            }
          });
          break;
        case "appointment":
          this.http.post(`http://localhost:3000/createAppointmentEvent?login=${this.authUser}&password=${this.password}&startDate=${newStartDate}&startTime=${newStartTime}&endDate=${newEndDate}&endTime=${newEndTime}&short_desc=${newShort_desc}&desc=${newDesc}&url_img=&url_ticket=&url_req=`, null)
          .subscribe((obj : any) => {
            if (obj instanceof Object && obj['error'] === undefined) {
              alert(obj['exito']);
              window.location.href = "/";
            } else {
              alert(obj['error']);
            }
          });
          break;
      
      } 
    } else {
      alert("El evento debe tener como mínimo una fecha de comienzo, una fecha de final y una descripción corta");
      window.location.reload();
    }
  }


  updateEvent(e: Event) {
    e.preventDefault();

    let { newStartDatetime, newEndDatetime, newShort_desc, newDesc } = this.eventForm.value; 
    let newStartDate, newStartTime, newEndDate, newEndTime;

    if (newStartDatetime === "" || newEndDatetime === "" || newShort_desc === "") {
      alert("El evento debe tener como mínimo una fecha de comienzo, una fecha de final y una descripción corta");
      window.location.reload();
    }
    else if (newStartDatetime !== null || newEndDatetime !== null || newShort_desc !== null || newDesc !== null) {

      if (newStartDatetime !== null) {
        newStartDate = newStartDatetime.split("T")[0];
        newStartTime = newStartDatetime.split("T")[1];
      } else {
        newStartDate = this.event.startDate;
        newStartTime = this.event.startTime;
      }

      if (newEndDatetime !== null) {
        newEndDate = newEndDatetime.split("T")[0];
        newEndTime = newEndDatetime.split("T")[1];
      } else {
        newEndDate = this.event.endDate;
        newEndTime = this.event.endTime;
      }

      if (newShort_desc === null) newShort_desc = this.event.short_desc;
      if (newDesc === null) newDesc = this.event.desc;

      switch (this.tag) {
        case "exam":
          this.http.post(`http://localhost:3000/setExamEvent?login=${this.authUser}&password=${this.password}&see_all=${true}&event_id=${this.event.event_id}&startDate=${newStartDate}&startTime=${newStartTime}&endDate=${newEndDate}&endTime=${newEndTime}&short_desc=${newShort_desc}&desc=${newDesc}&url_img=&url_doc=&url_exam=`, null)
        .subscribe((obj : any) => {
          if (obj instanceof Object && obj['error'] === undefined) {
            alert(obj['exito']);
            window.location.href = "/";
          } else {
            alert(obj['error']);
          }
        });
          break;
        case "work":
          this.http.post(`http://localhost:3000/setWorkEvent?login=${this.authUser}&password=${this.password}&see_all=${true}&event_id=${this.event.event_id}&startDate=${newStartDate}&startTime=${newStartTime}&endDate=${newEndDate}&endTime=${newEndTime}&short_desc=${newShort_desc}&desc=${newDesc}&url_img=&team=&url_doc=&url_work=`, null)
          .subscribe((obj : any) => {
            if (obj instanceof Object && obj['error'] === undefined) {
              alert(obj['exito']);
              window.location.href = "/";
            } else {
              alert(obj['error']);
            }
          });
          break;
        case "leisure":
          this.http.post(`http://localhost:3000/setLeisureEvent?login=${this.authUser}&password=${this.password}&event_id=${this.event.event_id}&startDate=${newStartDate}&startTime=${newStartTime}&endDate=${newEndDate}&endTime=${newEndTime}&short_desc=${newShort_desc}&desc=${newDesc}&url_img=&url_ticket=`, null)
          .subscribe((obj : any) => {
            if (obj instanceof Object && obj['error'] === undefined) {
              alert(obj['exito']);
              window.location.href = "/";
            } else {
              alert(obj['error']);
            }
          });
          break;
        case "appointment":
          this.http.post(`http://localhost:3000/setAppointmentEvent?login=${this.authUser}&password=${this.password}&event_id=${this.event.event_id}&startDate=${newStartDate}&startTime=${newStartTime}&endDate=${newEndDate}&endTime=${newEndTime}&short_desc=${newShort_desc}&desc=${newDesc}&url_img=&url_ticket=&url_req=`, null)
          .subscribe((obj : any) => {
            if (obj instanceof Object && obj['error'] === undefined) {
              alert(obj['exito']);
              window.location.href = "/";
            } else {
              alert(obj['error']);
            }
          });
          break;
      
      }
    } else {
      alert("Debe cambiar algún dato para actualizar el evento.");
    }
  }
}


 