const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Users = db.define('Users', {
    name: {
        type: DataTypes.STRING,
        required: true,
    },
    email: {
        type: DataTypes.STRING,
        required: true,
    },
    password: {
        type: DataTypes.STRING,
        required: true,
    },
    phoneNumber: {
        type: DataTypes.BIGINT,
        required: false,
    },
    image: {
        type: DataTypes.STRING,
        required: false,
    }
})

module.exports = Users