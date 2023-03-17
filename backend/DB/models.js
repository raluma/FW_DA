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
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    }
}

export const event = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATEONLY, 
        allowNull: false
    },
    time: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    short_desc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    url_img: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
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
        allowNull: true
    },
    url_attachment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
}

