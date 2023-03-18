import { Event, Exam } from "./sequelize.js";

export const getEvents = async (id) => {
    let mainDataEvents, dataEvent;
    let events = [];

    try {
        mainDataEvents = await Event.findAll
        (
            { where: 
                { 
                    user_id: id
                } 
            }
        );

        for (let i = 0; i < mainDataEvents.length; i++) {

            switch (mainDataEvents[i]['tag']) {
                case "exam":
                    dataEvent = await Exam.findOne
                    (
                        { where: 
                            { 
                                event_id: mainDataEvents[i]['id']
                            } 
                        }
                    );
                    break;
            
                default:
                    dataEvent = await Exam.findOne
                    (
                        { where: 
                            { 
                                event_id: mainDataEvents[i]['id']
                            } 
                        }
                    );
                    break;
            }

            events[i] = {...mainDataEvents[i]['dataValues'], ...dataEvent['dataValues']};
        }

        return events;

    } catch (err) {
        return {"error": "No existen eventos para ese usuario."};
    }
}

export const getEvent = async (date, time, short_desc, user_id) => {
    let mainDataEvent, dataEvent;

    const arrDate = date.split("-");
    const arrTime = time.split(":");

    date = new Date(arrDate[2], arrDate[1]-1, arrDate[0]);

    try {
        mainDataEvent = await Event.findOne
        (
            { where: 
                { 
                    date: date,
                    time: `${arrTime[0]}:${arrTime[1]}`,
                    short_desc: short_desc,
                    user_id: user_id
                } 
            }
        );

        if (mainDataEvent !== null) {
            switch (mainDataEvent['tag']) {
                case "exam":
                    dataEvent = await Exam.findOne
                    (
                        { where: 
                            { 
                                event_id: mainDataEvent['id']
                            } 
                        }
                    );
                    break;
            
                default:
                    dataEvent = await Exam.findOne
                    (
                        { where: 
                            { 
                                event_id: mainDataEvent['id']
                            } 
                        }
                    );
                    break;
            }

            return {...mainDataEvent['dataValues'], ...dataEvent['dataValues']};
        }
        else {  
            return {"error": "No existe ninguna tarea en esa fecha y con esa descripción corta de ese usuario."}; 
        }

    } catch (err) {
        return {"error": "No existe ese evento para ese usuario"};
    }
}

export const createEvent = async (date, time, short_desc, desc, url_img, tag, user_id, url_doc, url_attachment) => {
    let mainDataEvent, dataEvent;

    const arrDate = date.split("-");
    const arrTime = time.split(":");

    date = new Date(arrDate[2], arrDate[1]-1, arrDate[0]);

    try {
        mainDataEvent = await Event.create
        (
            { 
                date: date,
                time: `${arrTime[0]}:${arrTime[1]}`,
                short_desc: short_desc,
                desc: desc,
                url_img: url_img,
                tag: tag,
                user_id: user_id
            } 
        );

        mainDataEvent = await Event.findOne
        (
            { where: 
                { 
                    date: date,
                    time: `${arrTime[0]}:${arrTime[1]}`,
                    short_desc: short_desc,
                    user_id: user_id
                } 
            }
        );

        if (mainDataEvent !== null) {
            switch (mainDataEvent['tag']) {
                case "exam":
                    dataEvent = await Exam.create
                    (
                        { 
                            url_doc: url_doc,
                            url_attachment: url_attachment,
                            event_id: mainDataEvent['id']
                        } 
                    );
                    break;
            
                default:
                    dataEvent = await Exam.create
                    (
                        { 
                            url_doc: url_doc,
                            url_attachment: url_attachment,
                            event_id: mainDataEvent['id']
                        } 
                    );
                    break;
            }

            if (dataEvent !== null) { return {"exito": "Se ha registrado con éxito."}; } 
        } else {
            return {"error": "No se ha podido registrar con éxito."};
        }
    } catch (err) {
        return {"error": "No se han enviado los parámetros."};
    }
}

export const setEvent = async (id, date, time, short_desc, desc, url_img, tag, user_id, url_doc, url_attachment) => {
    let mainDataEvent, dataEvent;

    const arrDate = date.split("-");
    const arrTime = time.split(":");

    date = new Date(arrDate[2], arrDate[1]-1, arrDate[0]);

    try {
        mainDataEvent = await Event.update
        (
            { 
                date: date,
                time: `${arrTime[0]}:${arrTime[1]}`,
                short_desc: short_desc,
                desc: desc,
                url_img: url_img,
                tag: tag,
                user_id: user_id
            },
            { where: 
                {
                    id: id
                }
            }
        );

        if (mainDataEvent !== null) {
            switch (tag) {
                case "exam":
                    dataEvent = await Exam.update
                    (
                        { 
                            url_doc: url_doc,
                            url_attachment: url_attachment
                        },
                        { where: 
                            {
                                event_id: id
                            }
                        }
                    );
                    break;
            
                default:
                    dataEvent = await Exam.update
                    (
                        { 
                            url_doc: url_doc,
                            url_attachment: url_attachment
                        },
                        { where: 
                            {
                                event_id: id
                            }
                        }
                    );
                    break;
            }

            if (dataEvent !== null) { return {"exito": "Se ha actualizado con éxito"}; } 
        } else {
            return {"error": "No se ha podido actualizar con éxito."};
        }
    } catch (err) {
        return {"error": "No se han enviado los parámetros."};
    }
}