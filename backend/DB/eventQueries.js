import { Event, Exam } from "./sequelize.js";

export const getEvents = async (user_id) => {
    let mainDataEvents, dataEvent;
    let events = [];

    try {
        mainDataEvents = await Event.findAll
        (
            { where: 
                { 
                    user_id: user_id
                } 
            }
        );

        for (let i = 0; i < mainDataEvents.length; i++) {
            let mainDataEvent = mainDataEvents[i]["dataValues"];

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
                    dataEvent = [];
                    break;
            }

            if (dataEvent !== null) {
                events[i] = {...mainDataEvent, ...dataEvent['dataValues']};
            } else {
                return {"error": "No existen eventos para ese usuario."};
            }
        }

        return events;

    } catch (err) {
        return {"error": "No existen eventos para ese usuario."};
    }
}

export const getEvent = async (user_id, startDate, startTime, endDate, endTime, short_desc) => {
    let mainDataEvent, dataEvent;

    try {
        const arrStartDate = startDate.split("-");
        const arrStartTime = startTime.split(":");
        const arrEndDate = endDate.split("-");
        const arrEndTime = endTime.split(":");

        mainDataEvent = await Event.findOne
        (
            { where: 
                { 
                    startDate: new Date(arrStartDate[0], arrStartDate[1]-1, arrStartDate[2]),
                    startTime: `${arrStartTime[0]}:${arrStartTime[1]}`,
                    endDate: new Date(arrEndDate[0], arrEndDate[1]-1, arrEndDate[2]),
                    endTime: `${arrEndTime[0]}:${arrEndTime[1]}`,
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
                    dataEvent = [];
                    break;
            }

            if (dataEvent !== null) {
                return {...mainDataEvent['dataValues'], ...dataEvent['dataValues']};
            } else {
                return {"error": "No existe ninguna tarea en esa fecha y con esa descripción corta de ese usuario."}; 
            }
        }
        else {  
            return {"error": "No existe ninguna tarea en esa fecha y con esa descripción corta de ese usuario."}; 
        }

    } catch (err) {
        return {"error": "No se ha encontrado ese evento para ese usuario"};
    }
}

export const createEvent = async (user_id, startDate, startTime, endDate, endTime, short_desc, desc, url_img, tag, url_doc, url_attachment) => {
    let mainDataEvent, dataEvent;

    try {
        const arrStartDate = startDate.split("-");
        const arrStartTime = startTime.split(":");
        const arrEndDate = endDate.split("-");
        const arrEndTime = endTime.split(":");

        mainDataEvent = await Event.create
        (
            { 
                startDate: new Date(arrStartDate[0], arrStartDate[1]-1, arrStartDate[2]),
                startTime: `${arrStartTime[0]}:${arrStartTime[1]}`,
                endDate: new Date(arrEndDate[0], arrEndDate[1]-1, arrEndDate[2]),
                endTime: `${arrEndTime[0]}:${arrEndTime[1]}`,
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
                    startDate: new Date(arrStartDate[0], arrStartDate[1]-1, arrStartDate[2]),
                    startTime: `${arrStartTime[0]}:${arrStartTime[1]}`,
                    endDate: new Date(arrEndDate[0], arrEndDate[1]-1, arrEndDate[2]),
                    endTime: `${arrEndTime[0]}:${arrEndTime[1]}`,
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
                    break;
            }

            if (dataEvent !== null) { return {"exito": "Se ha creado con éxito."}; } 
            else { return {"error": "No se ha podido crear con éxito."}; }
        } else {
            return {"error": "No se ha podido crear con éxito."};
        }
    } catch (err) {
        return {"error": "No se han enviado los parámetros necesarios."};
    }
}

export const setEvent = async (user_id, event_id, startDate, startTime, endDate, endTime, short_desc, desc, url_img, tag, url_doc, url_attachment) => {
    let mainDataEvent, dataEvent;

    try {
        const arrStartDate = startDate.split("-");
        const arrStartTime = startTime.split(":");
        const arrEndDate = endDate.split("-");
        const arrEndTime = endTime.split(":");

        mainDataEvent = await Event.update
        (
            { 
                startDate: new Date(arrStartDate[0], arrStartDate[1]-1, arrStartDate[2]),
                startTime: `${arrStartTime[0]}:${arrStartTime[1]}`,
                endDate: new Date(arrEndDate[0], arrEndDate[1]-1, arrEndDate[2]),
                endTime: `${arrEndTime[0]}:${arrEndTime[1]}`,
                short_desc: short_desc,
                desc: desc,
                url_img: url_img,
                tag: tag,
                user_id: user_id
            },
            { where: 
                {
                    id: event_id
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
                                event_id: event_id
                            }
                        }
                    );
                    break;
            
                default:
                    break;
            }

            if (dataEvent !== null) { return {"exito": "Se ha actualizado con éxito"}; } 
            else { return {"error": "No se ha podido actualizar con éxito."}; }
        } else {
            return {"error": "No se ha podido actualizar con éxito."};
        }
    } catch (err) {
        return {"error": "No se han enviado los parámetros."};
    }
}

export const dropEvent = async (user_id, event_id, tag) => {
    let mainDataEvent, dataEvent;

    try {
        mainDataEvent = await Event.destroy
        (
            { where: 
                {
                    id: event_id,
                    user_id: user_id
                }
            }
        );

        if (mainDataEvent !== null) {
            switch (tag) {
                case "exam":
                    dataEvent = await Exam.destroy
                    (
                        { where: 
                            {
                                event_id: event_id
                            }
                        }
                    );
                    break;
            
                default:
                    break;
            }

            if (dataEvent !== null) { return {"exito": "Se ha borrado con éxito"}; } 
            else { return {"error": "No se ha podido borrar con éxito."}; }
        } else {
            return {"error": "No se ha podido borrar con éxito."};
        }
    } catch (err) {
        return {"error": "No se han enviado los parámetros."};
    }
}

