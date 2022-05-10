const { DataTypes } = require("sequelize")

const db = require("../db/conn")

const Users = require("../models/Users")

const Expenses = db.define("Expenses", {
    title: {
        type: DataTypes.STRING,
        require: true,
    },
    description: {
        type: DataTypes.STRING,
        require: true,
    },
    value: {
        type: DataTypes.DOUBLE,
        require: true,
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        require: true,
    },
    dueDate: {
        type: DataTypes.DATE,
        require: true,
    },
    billet: {
        type: DataTypes.STRING,
        require: false,
    },
    receipt: {
        type: DataTypes.STRING,
        require: false,
    }
})

Expenses.belongsTo(Users, {onDelete: 'cascade'})
Users.hasMany(Expenses)

module.exports = Expenses