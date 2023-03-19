import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'home',
  templateUrl: '../../view/pages/home.html'
})
export class Home {
  http = inject(HttpClient);
  calendarVisible = false;
  faCalendar = faCalendar;

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

  showTimes(times : Date) {
    let meridiem = times.getHours() > 12 ? 'pm' : 'am';

    if (times.getMinutes() !== 0) {
      return `${times.getHours()}:${times.getMinutes()}${meridiem}`;
    } else {
      return `${times.getHours()}${meridiem}`;
    }
  }

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
            allDay: event['time'] === "0:0" ? true : false
          }
        )
      }

      this.calendarVisible = true;
    });
  }

  constructor(private changeDetector: ChangeDetectorRef) {}

  handleEvents(events: EventApi[]) {
    this.changeDetector.detectChanges();
    let change = false;

    for (let i = 0; i < this.events.length; i++) {
      if (this.events[i].start?.toString() !== events[i].start?.toString()) change = true;
      if (this.events[i].title !== events[i].title) change = true;
      if (this.events[i]['desc'] !== events[i].extendedProps['desc']) change = true;
      if (this.events[i]['url_img'] !== events[i].extendedProps['url_img']) change = true;
      if (this.events[i]['tag'] !== events[i].extendedProps['tag']) change = true;
      if (this.events[i]['url_doc'] !== events[i].extendedProps['url_doc']) change = true;
      if (this.events[i]['url_attachment'] !== events[i].extendedProps['url_attachment']) change = true;
    }

    console.log(change);

    if (change) {
      events.forEach(event => {
        if (event.start?.getMonth !== undefined) {
          let date = `${event.start.getFullYear()}-${event.start.getMonth()+1}-${event.start.getDate()}`;
          let time = `${event.start?.getHours()}:${event.start?.getMinutes()}`;

          this.http.post(`http://localhost:3000/setEvent?event_id=${event.id}&date=${date}&time=${time}&short_desc=${event.title}&desc=${event.extendedProps['desc']}&url_img=${event.extendedProps['url_img']}&tag=${event.extendedProps['tag']}&user_id=${event.extendedProps['user_id']}&url_doc=${event.extendedProps['url_doc']}&url_attachment=${event.extendedProps['url_attachment']}`, null)
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
}


 