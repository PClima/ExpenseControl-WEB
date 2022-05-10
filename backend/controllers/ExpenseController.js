const bcrypt = require('bcrypt')
const Expenses = require('../models/Expenses')
const jwt = require('jsonwebtoken')

const getToken = require('../helpers/getToken')
const getUserByToken = require('../helpers/getUserByToken')
const deleteImage = require('../helpers/delete-upload')

module.exports = class UserController {
    static async registerExpense(req, res){
        const token = getToken(req)
        const user = await getUserByToken(token)
        const UserId = user.id

        const { title, description, value, isPaid, dueDate} = req.body

        //Validation
        if(!title) {
            res.status(422).json({message: "Title required!"})
            return
        }
        if(!description) {
            res.status(422).json({message: "Description required!"})
            return
        }
        if(!value) {
            //Need to validate the email
            res.status(422).json({message: "Value required!"})
            return
        }
        if(!dueDate) {
            res.status(422).json({message: "Due Date required!"})
            return
        }
    
        let billet
        let receipt

        if(req.files['receipt'][0]) {
            receipt = req.files['receipt'][0].filename
        }
        if(req.files['billet']) {
            billet = req.files['billet'][0].filename
        }

        //check if expense exists
        const expenseExists = await Expenses.findOne({raw: true, where : {title : title, description: description, value : value, dueDate : dueDate, UserId : UserId}})

        if(expenseExists){
            res.status(422).json({message: "Expense already registered!"})
            return
        }

        const expense = {
            title,
            description,
            value,
            isPaid,
            dueDate,
            billet,
            receipt,
            UserId
        }

        Expenses.create(expense)
        .then(() => {
            res.status(201).json({
                message: "Expense registered!"
            })
        })
        .catch((err)=>{
            res.status(500).json({message: err})
        })
    }

    static async getExpenseById(req, res){
        const token = getToken(req)
        const user = await getUserByToken(token)
        const UserId = user.id

        const id = req.params.id

        const expense = await Expenses.findOne({raw: true, where : {id : id, UserId : UserId}})

        if(!expense){
            res.status(422).json({message: "Expense Not Found!"})
            return
        }

        res.status(200).json({ expense })
    }

    static async editExpense(req, res){
        const token = getToken(req)
        const user = await getUserByToken(token)
        const UserId = user.id
        const id = req.params.id

        const expense = await Expenses.findOne({raw: true, where : {id : id, UserId : UserId}})

        const { title, description, value, isPaid, dueDate} = req.body

        //Validation
        if(!title) {
            res.status(422).json({message: "Title required!"})
            return
        }
        expense.title = title
        if(!description) {
            res.status(422).json({message: "Description required!"})
            return
        }
        expense.title = title
        if(!value) {
            //Need to validate the email
            res.status(422).json({message: "Value required!"})
            return
        }
        expense.title = title
        if(!dueDate) {
            res.status(422).json({message: "Due Date required!"})
            return
        }
        expense.title = title

        let billet
        let receipt

        if(req.files['receipt'][0]) {
            expense.receipt = req.files['receipt'][0].filename
        }
        if(req.files['billet']) {
            expense.billet = req.files['billet'][0].filename
        }
        
        const expenseUpdated = {
            title,
            description,
            value,
            isPaid,
            dueDate,
            
            UserId
        }


        try {
            // returns user updated data
            await Expenses.update(expenseUpdated, {where: {id: id, UserId: UserId}})

            res.status(200).json({message: "Expense updated successfully!"})
            
        } catch (err) {
            res.status(500).json({message: err})
            return
        }
    }

    static async getAllExpenses(req, res){
        const token = getToken(req)
        const user = await getUserByToken(token)
        const UserId = user.id

        const expenses = await Expenses.findAll({raw: true, where : {UserId : UserId}, order: ['dueDate']})

        if(!expenses){
            res.status(422).json({message: "No one expenses registered!"})
            return
        }

        res.status(200).json({ expenses })
    }

    static async deleteExpenseById(req, res){
        const token = getToken(req)
        const user = await getUserByToken(token)
        const UserId = user.id
        const id = req.params.id
        const filePath = await Expenses.findOne({where : {id:id, UserId : UserId}})

        deleteImage("../backend/public/images/expenses/"+filePath.billet)
        deleteImage("../backend/public/images/expenses/"+filePath.receipt)

        const expenses = await Expenses.destroy({where : {id:id, UserId : UserId}})

        if(!expenses){
            res.status(422).json({message: "No one expenses to be deleted!"})
            return
        }

        res.status(200).json({ message: "Expense deleted!" })
    }
}