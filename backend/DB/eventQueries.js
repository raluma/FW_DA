import { Event, Tag, Exam, Work, Leisure, Appointment } from "./sequelize.js";
import { Op } from "sequelize";

const eventType = (tag) => {
    switch (tag) {
        case "exam": return Exam;
        case "work": return Work;
        case "leisure": return Leisure;
        case "appointment": return Appointment;  
    }
};

export const getEvents = async (user_id) => {
    let mainDataEvents, dataEvent;
    let events = [];

    try {
        mainDataEvents = await Event.findAll
        (
            { where: 
                { [Op.or]:  [{ user_id: user_id }, { see_all: true }] }
            }
        );

        for (let i = 0; i < mainDataEvents.length; i++) {
            let mainDataEvent = mainDataEvents[i]["dataValues"];

            dataEvent = await eventType(mainDataEvent['tag']).findOne
            (
                { where: 
                    { 
                        event_id: mainDataEvent['id']
                    } 
                }
            );
                    
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

export const getEvent = async (startDate, startTime, endDate, endTime, short_desc) => {
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
                    short_desc: short_desc
                } 
            }
        );

        if (mainDataEvent !== null) {
            
            dataEvent = await eventType(mainDataEvent['tag']).findOne
            (
                { where: 
                    { 
                        event_id: mainDataEvent['id']
                    } 
                }
            );
                   
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

export const getTags = async () => {
    try {
     return await Tag.findAll({
        order: [['id', 'ASC']]
     });
    } catch(err) {
        return {"error": "Ha ocurrido un error inesperado."};
    }
}

export const getTag = async (tagName) => {
    let tag;

    try {
        tag = await Tag.findOne
        (
            { where: 
                { 
                    tagName: tagName,
                } 
            }
        );

        if (tag !== null) return tag;
        else return {"error": "Los datos no son válidos. No exise esta etiqueta."}; 

    } catch (err) {
        return {"error": "Los parámetros no son válidos o suficientes."};
    }
}

export const createTag = async (tagName, color, tagNameSP) => {
    let tag;

    try {
        tag = await Tag.create
        (
            { 
                tagName: tagName,
                color: color,
                tagNameSP: tagNameSP
            } 
        );

        if (tag !== null) { return {"exito": "La etiqueta se ha creado con éxito."}; } 
        else { return {"error": "La etiqueta no se ha podido crear con éxito."}; }
    } catch (err) {
        return {"error": "Los parámetros no son válidos o suficientes."};
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
           
            dataEvent = await eventType(tag).destroy
            (
                { where: 
                    {
                        event_id: event_id
                    }
                }
            );
                 
            if (dataEvent !== null) { return {"exito": "Se ha borrado con éxito"}; } 
            else { return {"error": "No se ha podido borrar con éxito."}; }
        } else {
            return {"error": "No se ha podido borrar con éxito."};
        }
    } catch (err) {
        return {"error": "Los parámetros no son válidos o suficientes."};
    }
}

export const setDateEvent = async (event_id, startDate, startTime, endDate, endTime) => {
    let mainDataEvent

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
            },
            { where: 
                {
                    id: event_id
                }
            }
        );

        if (mainDataEvent !== null) { return {"exito": "Se ha actualizado la fecha con éxito"}; } 
        else { return {"error": "No se ha podido actualizar la fecha con éxito."}; }
    } catch (err) {
        return {"error": "Los parámetros no son válidos o suficientes."};
    }
}

// Create and Update events by Events Type

export const createExamEvent = async (user_id, startDate, startTime, endDate, endTime, short_desc, desc, url_img, url_doc, url_exam) => {
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
                tag: "exam",
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

                dataEvent = await Exam.create
                (
                    { 
                        url_doc: url_doc,
                        url_exam: url_exam,
                        event_id: mainDataEvent['id']
                    } 
                );        

            if (dataEvent !== null) { return {"exito": "Se ha creado con éxito."}; } 
            else { return {"error": "No se ha podido crear con éxito."}; }
        } else {
            return {"error": "No se ha podido crear con éxito."};
        }
    } catch (err) {
        return {"error": "Los parámetros no son válidos o suficientes."};
    }
}

export const setExamEvent = async (event_id, startDate, startTime, endDate, endTime, short_desc, desc, url_img, url_doc, url_exam) => {
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
                url_img: url_img
            },
            { where: 
                {
                    id: event_id
                }
            }
        );

        if (mainDataEvent !== null) {

            dataEvent = await Exam.update
            (
                { 
                    url_doc: url_doc,
                    url_exam: url_exam
                },
                { where: 
                    {
                        event_id: event_id
                    }
                }
            );        

            if (dataEvent !== null) { return {"exito": "Se ha actualizado con éxito"}; } 
            else { return {"error": "No se ha podido actualizar con éxito."}; }
        } else {
            return {"error": "No se ha podido actualizar con éxito."};
        }
    } catch (err) {
        return {"error": "Los parámetros no son válidos o suficientes."};
    }
}

export const createWorkEvent = async (user_id, startDate, startTime, endDate, endTime, short_desc, desc, url_img, team, url_doc, url_work) => {
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
                tag: "work",
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

                dataEvent = await Work.create
                (
                    { 
                        team: team,
                        url_doc: url_doc,
                        url_work: url_work,
                        event_id: mainDataEvent['id']
                    } 
                );        

            if (dataEvent !== null) { return {"exito": "Se ha creado con éxito."}; } 
            else { return {"error": "No se ha podido crear con éxito."}; }
        } else {
            return {"error": "No se ha podido crear con éxito."};
        }
    } catch (err) {
        return {"error": "Los parámetros no son válidos o suficientes."};
    }
}

export const setWorkEvent = async (event_id, startDate, startTime, endDate, endTime, short_desc, desc, url_img, team, url_doc, url_work) => {
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
                url_img: url_img
            },
            { where: 
                {
                    id: event_id
                }
            }
        );

        if (mainDataEvent !== null) {

            dataEvent = await Work.update
            (
                { 
                    team: team,
                    url_doc: url_doc,
                    url_work: url_work
                },
                { where: 
                    {
                        event_id: event_id
                    }
                }
            );        

            if (dataEvent !== null) { return {"exito": "Se ha actualizado con éxito"}; } 
            else { return {"error": "No se ha podido actualizar con éxito."}; }
        } else {
            return {"error": "No se ha podido actualizar con éxito."};
        }
    } catch (err) {
        return {"error": "Los parámetros no son válidos o suficientes."};
    }
}

export const createLeisureEvent = async (user_id, startDate, startTime, endDate, endTime, short_desc, desc, url_img, url_ticket) => {
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
                tag: "leisure",
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

                dataEvent = await Leisure.create
                (
                    { 
                        url_ticket: url_ticket,
                        event_id: mainDataEvent['id']
                    } 
                );        

            if (dataEvent !== null) { return {"exito": "Se ha creado con éxito."}; } 
            else { return {"error": "No se ha podido crear con éxito."}; }
        } else {
            return {"error": "No se ha podido crear con éxito."};
        }
    } catch (err) {
        return {"error": "Los parámetros no son válidos o suficientes."};
    }
}

export const setLeisureEvent = async (event_id, startDate, startTime, endDate, endTime, short_desc, desc, url_img, url_ticket) => {
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
                url_img: url_img
            },
            { where: 
                {
                    id: event_id
                }
            }
        );

        if (mainDataEvent !== null) {

            dataEvent = await Work.update
            (
                { 
                    url_ticket
                },
                { where: 
                    {
                        event_id: event_id
                    }
                }
            );        

            if (dataEvent !== null) { return {"exito": "Se ha actualizado con éxito"}; } 
            else { return {"error": "No se ha podido actualizar con éxito."}; }
        } else {
            return {"error": "No se ha podido actualizar con éxito."};
        }
    } catch (err) {
        return {"error": "Los parámetros no son válidos o suficientes."};
    }
}

export const createAppointmentEvent = async (user_id, startDate, startTime, endDate, endTime, short_desc, desc, url_img, url_ticket, url_req) => {
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
                tag: "appointment",
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

                dataEvent = await Appointment.create
                (
                    { 
                        url_ticket: url_ticket,
                        url_req: url_req,
                        event_id: mainDataEvent['id']
                    } 
                );        

            if (dataEvent !== null) { return {"exito": "Se ha creado con éxito."}; } 
            else { return {"error": "No se ha podido crear con éxito."}; }
        } else {
            return {"error": "No se ha podido crear con éxito."};
        }
    } catch (err) {
        return {"error": "Los parámetros no son válidos o suficientes."};
    }
}

export const setAppointmentEvent = async (event_id, startDate, startTime, endDate, endTime, short_desc, desc, url_img, url_ticket, url_req) => {
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
                url_img: url_img
            },
            { where: 
                {
                    id: event_id
                }
            }
        );

        if (mainDataEvent !== null) {

            dataEvent = await Work.update
            (
                { 
                    url_ticket: url_ticket,
                    url_req: url_req
                },
                { where: 
                    {
                        event_id: event_id
                    }
                }
            );        

            if (dataEvent !== null) { return {"exito": "Se ha actualizado con éxito"}; } 
            else { return {"error": "No se ha podido actualizar con éxito."}; }
        } else {
            return {"error": "No se ha podido actualizar con éxito."};
        }
    } catch (err) {
        return {"error": "Los parámetros no son válidos o suficientes."};
    }
}
