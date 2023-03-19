import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

@Component({
  selector: 'home',
  templateUrl: '../../view/pages/home.html'
})
export class Home {
  http = inject(HttpClient);
  calendarVisible = false;

  currentEvents: EventApi[] = [];

  events: EventInput[] = [];

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
    events: this.events,

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
    this.http.post("http://localhost:3000/getEvents?user_id=1", null)
    .subscribe(data => {
      let arrDate, arrTime;

      for (const [i, event] of Object.entries(data)) {
        arrDate = event['date'].split("-");
        arrTime = event['time'].split(":");

        this.events.push
        (
          {
            id: event['event_id'],
            title: event['short_desc'],
            desc: event['desc'],
            start: new Date(arrDate[0], arrDate[1]-1, arrDate[2], arrTime[0], arrTime[1]),
            url_img: event['url_img'],
            tag: event['tag'],
            user_id: event['user_id'],
            url_doc: event['url_doc'],
            url_attachment: event['url_attachment'],
            allDay: false
          }
        )
      }

      this.calendarVisible = true;
    });
  }

  constructor(private changeDetector: ChangeDetectorRef) {}

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: "1",
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.changeDetector.detectChanges();
    
    events.forEach(event => {
      if (event.start?.getMonth !== undefined) {
        let date = `${event.start.getFullYear()}-${event.start.getMonth()+1}-${event.start.getDate()}`;
        let time = `${event.start?.getHours()}:${event.start?.getMinutes()}`;

        this.http.post(`http://localhost:3000/setEvent?event_id=${event.id}&date=${date}&time=${time}&short_desc=${event.title}&desc=${event.extendedProps['desc']}&url_img=${event.extendedProps['url_img']}&tag=${event.extendedProps['tag']}&user_id=${event.extendedProps['user_id']}&url_doc=${event.extendedProps['url_doc']}&url_attachment=${event.extendedProps['url_attachment']}`, null)
          .subscribe(data => {
            console.log(data);
        });
      }
    }) 

    
  }
}



 