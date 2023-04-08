import { ChangeDetectorRef, Component } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { faCalendar, faEdit } from '@fortawesome/free-regular-svg-icons';
import { Home } from '../pages/home';
import { Tag } from '../../model/tag';

@Component({
    selector: 'calendar',
    templateUrl: '../../view/components/calendar.html'
  })
  export class Calendar extends Home {
    calendarVisible = false;
    faCalendar = faCalendar;
    faEdit = faEdit;

    authUser = localStorage.getItem("authUser");
    password = localStorage.getItem("password");

    tags: Tag[] = [];
    initialEvents: EventInput[] = [];
  
    calendarOptions: CalendarOptions = {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
      ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
  
      initialView: 'dayGridMonth',
      initialEvents: this.initialEvents,
  
      weekends: true,
      editable: true,
      droppable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
  
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this)
    };

    getEvents(events: EventInput[]) {
      this.http.post(`http://localhost:3000/getEvents?login=${this.authUser}&password=${this.password}`, null)
      .subscribe(data => {
        let arrStartDate, arrStartTime, arrEndDate, arrEndTime, allDay;
  
        for (const [i, event] of Object.entries(data)) {

          this.http.get(`http://localhost:3000/getTag?tagName=${event['tag']}`)
          .subscribe((data : any) => {
            arrStartDate = event['startDate'].split("-");
            arrStartTime = event['startTime'].split(":");
            arrEndDate = event['endDate'].split("-");
            arrEndTime = event['endTime'].split(":"); 
            let { color } = data;   
            allDay = false;  

            if (arrStartDate[0] === arrEndDate[0] && arrStartDate[1] === arrEndDate[1]
              && Number(arrStartDate[2]) + 1 === Number(arrEndDate[2]) 
              && arrStartTime[0] === arrEndTime[0]) {
                allDay = true
            }

            events.push
            (
              {
                id: event['event_id'],
                title: event['short_desc'],
                desc: event['desc'],
                start: new Date(arrStartDate[0], arrStartDate[1]-1, arrStartDate[2], arrStartTime[0], arrStartTime[1]),
                end: new Date(arrEndDate[0], arrEndDate[1]-1, arrEndDate[2], arrEndTime[0], arrEndTime[1]),
                url_img: event['url_img'],
                tag: event['tag'],
                user_id: event['user_id'],
                url_doc: event['url_doc'],
                url_attachment: event['url_attachment'],
                allDay: allDay,
                color: color
              }
            );
          });
        }
      });
    }
  
    ngOnInit(): void {
      this.http.get<Tag[]>(`http://localhost:3000/getTags`)
      .subscribe((data) => {
        this.tags = data;
      });

      this.getEvents(this.initialEvents);

      // Para esperar a tener los datos para representarlos //

      setTimeout(() => {
        this.calendarVisible = true;
      }, 100);

      // Para esperar a tener los datos para representarlos //
    }

    formatForEvent(str: string) {
      return str[0].toUpperCase() + str.slice(1, str.length);
    }
  
    constructor(private changeDetector: ChangeDetectorRef) { super(); }
  
    handleEvents(events: EventApi[]) {
      this.changeDetector.detectChanges();
      let dbEvents: EventInput[] = []
      
      this.getEvents(dbEvents);

      // Para esperar a tener los datos para comparlos y actualizar el evento que ha cambiado //

      setTimeout(() => {
        let dbEvent, event, startDate, startTime, endDate, endTime;

        for (let i = 0; i < dbEvents.length; i++) {
          dbEvent = dbEvents[i];
          event = events[i];

          if ((event.start !== null && event.end !== null) && (dbEvent.start?.toString() !== event.start?.toString() 
              || dbEvent.end?.toString() !== event.end?.toString())) {
              startDate = `${event.start.getFullYear()}-${event.start.getMonth() + 1}-${event.start.getDate()}`;
              startTime = `${event.start.getHours()}:${event.start.getMinutes()}`;
              endDate = `${event.end.getFullYear()}-${event.end.getMonth()+1}-${event.end.getDate()}`;
              endTime = `${event.end.getHours()}:${event.end.getMinutes()}`;

              this.http.post(`http://localhost:3000/setDateEvent?login=${this.authUser}&password=${this.password}&event_id=${events[i].id}&startDate=${startDate}&startTime=${startTime}&endDate=${endDate}&endTime=${endTime}&tag=${events[i].extendedProps['tag']}`, null)
                .subscribe((obj : any ) => {
                    if (obj instanceof Object && obj['error'] !== undefined) {
                      alert(obj['error']); 
                      window.location.reload();
                    }
                    console.log(obj);     
                });
          }
        }
      }, 100);

      // Para esperar a tener los datos para comparlos y actualizar el evento que ha cambiado //

    }
  
    handleWeekendsToggle() {
      const { calendarOptions } = this;
      calendarOptions.weekends = !calendarOptions.weekends;
    }
  
    handleDateSelect(selectInfo: DateSelectArg) {
      if (confirm(`¿Quieres CREAR un evento nuevo?`)) {
        const startDate = selectInfo.startStr;
        const startTime = selectInfo.start.toTimeString().substring(0, 5);
        const endDate = selectInfo.endStr;
        const endTime = selectInfo.end.toTimeString().substring(0, 5)

        window.location.href = `event/add/${startDate}&${startTime}_${endDate}&${endTime}`;
      }
    }
  
    handleEventClick(clickInfo: EventClickArg) {
      if (confirm(`¿Quieres VER/EDITAR el evento '${clickInfo.event.title}'?`)) {
        if (clickInfo.event.start !== null && clickInfo.event.end !== null) {
          const startDate = clickInfo.event.startStr;
          const startTime = clickInfo.event.start.toTimeString().substring(0, 5);
          const endDate = clickInfo.event.endStr
          const endTime = clickInfo.event.end.toTimeString().substring(0, 5);
        
          window.location.href = 
          `event/edit/${clickInfo.event.title}/${startDate}&${startTime}_${endDate}&${endTime}`;
        }
      }
    }
  }