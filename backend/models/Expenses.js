const { DataTypes } = require("sequelize")

const db = require("../db/conn")

const Users = require("../models/Users")

const Expenses = db.define("Expenses", {
    title: {
        type: DataTypes.STRING,
        require: true,
    },
    value: {
        type: DataTypes.DOUBLE,
        require: true,
    },
    paid: {
        type: DataTypes.BOOLEAN,
        require: true,
    },
    dueDate: {
        type: DataTypes.DATE,
        require: true,
    },
    receipt: {
        type: DataTypes.STRING,
        require: false,
    }
})

Expenses.belongsTo(Users)
Users.hasMany(Expenses)

module.exports = Expenses