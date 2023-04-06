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
  
    ngOnInit(): void {
      this.http.get<Tag[]>(`http://localhost:3000/getTags`)
      .subscribe((data) => {
        this.tags = data;
      });

      this.http.post(`http://localhost:3000/getEvents?login=${this.authUser}&password=${this.password}`, null)
      .subscribe(data => {
        let arrStartDate, arrStartTime, arrEndDate, arrEndTime;
        let allDay = false;
  
        for (const [i, event] of Object.entries(data)) {

          this.http.get(`http://localhost:3000/getTag?tagName=${event['tag']}`)
          .subscribe((data : any) => {
            arrStartDate = event['startDate'].split("-");
            arrStartTime = event['startTime'].split(":");
            arrEndDate = event['endDate'].split("-");
            arrEndTime = event['endTime'].split(":");      

            if (arrStartDate[0] === arrEndDate[0] && arrStartDate[1] === arrEndDate[1]
              && Number(arrStartDate[2]) + 1 === Number(arrEndDate[2]) 
              && arrStartTime[0] === arrEndTime[0]) {
                allDay = true
            }

            this.initialEvents.push
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
                color: data['color']
              }
            );
          });
        }

        // Necesario esperar a tener los datos para representarlos
        setTimeout(() => {
          this.calendarVisible = true;
        }, 100);

        console.log(this.initialEvents)
      });
    }

    formatForEvent(str: string) {
      return str[0].toUpperCase() + str.slice(1, str.length);
    }
  
    constructor(private changeDetector: ChangeDetectorRef) { super(); }
  
    handleEvents(events: EventApi[]) {
      this.changeDetector.detectChanges();
      let change = false;
  
      for (let i = 0; i < this.initialEvents.length; i++) {
        if (this.initialEvents[i].start?.toString() !== events[i].start?.toString()) change = true;
        if (this.initialEvents[i].end?.toString() !== events[i].end?.toString()) change = true;
        if (this.initialEvents[i].title !== events[i].title) change = true;
        if (this.initialEvents[i]['desc'] !== events[i].extendedProps['desc']) change = true;
        if (this.initialEvents[i]['url_img'] !== events[i].extendedProps['url_img']) change = true;
        if (this.initialEvents[i]['tag'] !== events[i].extendedProps['tag']) change = true;
        if (this.initialEvents[i]['url_doc'] !== events[i].extendedProps['url_doc']) change = true;
        if (this.initialEvents[i]['url_attachment'] !== events[i].extendedProps['url_attachment']) change = true;
      }
  
      if (change) {
        events.forEach(event => {
          if (event.start !== null && event.end !== null) {
            let startDate = `${event.start.getFullYear()}-${event.start.getMonth()+1}-${event.start.getDate()}`;
            let startTime = `${event.start.getHours()}:${event.start.getMinutes()}`;
            let endDate = `${event.end.getFullYear()}-${event.end.getMonth()+1}-${event.end.getDate()}`;
            let endTime = `${event.end.getHours()}:${event.end.getMinutes()}`;
  
            this.http.post(`http://localhost:3000/setDateEvent?login=${this.authUser}&password=${this.password}&event_id=${event.id}&startDate=${startDate}&startTime=${startTime}&endDate=${endDate}&endTime=${endTime}`, null)
              .subscribe(data => {
                console.log(data);
            });
          }
        });
      }
    }
  
    handleWeekendsToggle() {
      const { calendarOptions } = this;
      calendarOptions.weekends = !calendarOptions.weekends;
    }
  
    handleDateSelect(selectInfo: DateSelectArg) {
      if (confirm(`¿Quieres crear un evento nuevo?`)) {
        const startDate = `${selectInfo.start.getFullYear()}-${selectInfo.start.getMonth()+1}-${selectInfo.start.getDate()}`;
        const startTime = `${selectInfo.start.getHours()}:${selectInfo.start.getMinutes()}`;
        const endDate = `${selectInfo.end.getFullYear()}-${selectInfo.end.getMonth()+1}-${selectInfo.end.getDate()}`;
        const endTime = `${selectInfo.end.getHours()}:${selectInfo.end.getMinutes()}`;

        window.location.href = `event/add/${startDate}&${startTime}_${endDate}&${endTime}`;
      }
      // const title = prompt('Please enter a new title for your event');
      // const calendarApi = selectInfo.view.calendar;
  
      // calendarApi.unselect(); // clear date selection
  
      // if (title) {
      //   calendarApi.addEvent({
      //     id: "1",
      //     title,
      //     start: selectInfo.startStr,
      //     end: selectInfo.endStr,
      //     allDay: selectInfo.allDay
      //   });
      // }
    }
  
    handleEventClick(clickInfo: EventClickArg) {
      if (confirm(`¿Quieres editar el evento '${clickInfo.event.title}'?`)) {
        if (clickInfo.event.start !== null && clickInfo.event.end !== null) {
          const startDate = `${clickInfo.event.start.getFullYear()}-${clickInfo.event.start.getMonth()+1}-${clickInfo.event.start.getDate()}`;
          const startTime = `${clickInfo.event.start.getHours()}:${clickInfo.event.start.getMinutes()}`;
          const endDate = `${clickInfo.event.end.getFullYear()}-${clickInfo.event.end.getMonth()+1}-${clickInfo.event.end.getDate()}`;
          const endTime = `${clickInfo.event.end.getHours()}:${clickInfo.event.end.getMinutes()}`;
        
          window.location.href = 
          `event/edit/${clickInfo.event.title}/${startDate}&${startTime}_${endDate}&${endTime}`;
        }
      }
      // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      //   clickInfo.event.remove();
      // }
    }
  }