import { Event, Exam } from "./sequelize.js";

export const getEvents = async () => {
    let mainDataEvent, dataEvent;

    try {
        mainDataEvent = await Event.findAll();

        if (mainDataEvent !== null) {
            const tag = mainDataEvent['tag'];

            switch (tag) {
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
            return {"error": "No existe ninguna tarea."}; 
        }

    } catch (err) {
        return {"error": "No se han enviado los parámetros"};
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
            const tag = mainDataEvent['tag'];

            switch (tag) {
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
        return {"error": "No se han enviado los parámetros"};
    }
}