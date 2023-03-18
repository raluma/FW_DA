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
    date: {
        type: DataTypes.DATEONLY, 
        allowNull: false,
        unique: false
    },
    time: {
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
    url_attachment: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    }
}

