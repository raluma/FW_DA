import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
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
  VALID_ACTIONS = ["add", "edit"];

  action = "";
  strStartDate: string = "";
  strStartTime: string = "";
  strEndDate: string = "";
  strEndTime: string = "";
  short_desc: string = "";

  convertToDate() {}

  constructor(public route: ActivatedRoute, private renderer: Renderer2) {
    super();

    this.route.params.subscribe(params => {
      if (this.VALID_ACTIONS.includes(params['action'])) {
        this.action = params['action'];
        const paramsLong = Object.keys(params).length;
        
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

        if (this.action === "edit") this.short_desc = params['short_desc'];

        if (startDatetime instanceof Date && endDatetime instanceof Date) {
          this.strStartDate = strStartDate;
          this.strStartTime = strStartTime;
          this.strEndDate = strEndDate;
          this.strEndTime = strEndTime;
        } else {
          window.location.href = "/";
        }
        
        if (this.action === "add") {
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

  @ViewChild("short_desc") short_desc_element: ElementRef | undefined;
  @ViewChild("startDatetime") startDatetime: ElementRef | undefined;
  @ViewChild("endDatetime") endDatetime: ElementRef | undefined;

  ngOnInit() {
    const authUser = localStorage.getItem("authUser");
    const password = localStorage.getItem("password");
    
    if (this.action === "edit") {
      this.http.post(`http://localhost:3000/getEvent?login=${authUser}&password=${password}&startDate=${this.strStartDate}&startTime=${this.strStartTime}&endDate=${this.strEndDate}&endTime=${this.strEndTime}&short_desc=${this.short_desc}`, null)
      .subscribe((obj : any) => {
        console.log(obj)
        this.renderer.setProperty(this.short_desc_element?.nativeElement, "value", obj["short_desc"]);
        this.renderer.setProperty(this.startDatetime?.nativeElement, "value", `${obj["startDate"]}T${obj["startTime"]}`);
        this.renderer.setProperty(this.endDatetime?.nativeElement, "value", `${obj["endDate"]}T${obj["endTime"]}`);
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
}


 