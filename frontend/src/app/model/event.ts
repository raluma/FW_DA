export interface Exam {
    event_id: Number;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    short_desc: string;
    desc: string;
    url_img: string;
    user_id: Number;
    see_all: Boolean;
    url_doc: string;
    url_exam: string;
}

export interface Work {
    event_id: Number;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    short_desc: string;
    desc: string;
    url_img: string;
    user_id: Number;
    see_all: Boolean;
    team: string;
    url_doc: string;
    url_work: string;
}

export interface Leisure {
    event_id: Number;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    short_desc: string;
    desc: string;
    url_img: string;
    user_id: Number;
    see_all: Boolean;
    url_ticket: string;
}

export interface Appointment {
    event_id: Number,
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    short_desc: string;
    desc: string;
    url_img: string;
    user_id: Number;
    see_all: Boolean;
    url_ticket: string;
    url_req: string;
}