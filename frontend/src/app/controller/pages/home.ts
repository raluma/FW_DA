import { ChangeDetectorRef, Component } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

const INITIAL_EVENTS: EventInput[] = [
  {
    id: "1",
    title: 'All-day event',
    start: new Date(),
    allDay: false,
    color: "orange"
  },
  {
    id: "2",
    title: 'All-day event2',
    start: new Date(),
    allDay: true
  }
]

@Component({
  selector: 'home',
  templateUrl: '../../view/pages/home.html'
})
export class Home {
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
    initialEvents: INITIAL_EVENTS,

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

  calendarVisible = true;
  currentEvents: EventApi[] = [];

  constructor(private changeDetector: ChangeDetectorRef) { }

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
    this.currentEvents = events;
    this.changeDetector.detectChanges();
    console.log(events);
  }
}



 