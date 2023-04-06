import { DataTypes } from 'sequelize';

export const user = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    }
}

export const event = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    startDate: {
        type: DataTypes.DATEONLY, 
        allowNull: false,
        unique: false
    },
    startTime: {
        type: DataTypes.STRING, 
        allowNull: false,
        unique: false
    },
    endDate: {
        type: DataTypes.DATEONLY, 
        allowNull: false,
        unique: false
    },
    endTime: {
        type: DataTypes.STRING, 
        allowNull: false,
        unique: false
    },
    short_desc: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    url_img: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    }
}

export const exam = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    url_doc: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    url_exam: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
}

export const work = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    team: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    url_doc: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    url_work: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
}

export const leisure = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    url_ticket: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
}

export const appointment = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    url_ticket: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    url_req: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
}

