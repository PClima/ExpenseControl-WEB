const bcrypt = require('bcrypt')
const Users = require('../models/Users')
const Expenses = require('../models/Expenses')
const jwt = require('jsonwebtoken')

const createUserToken = require('../helpers/createUserToken')
const getToken = require('../helpers/getToken')
const getUserByToken = require('../helpers/getUserByToken')
const deleteImage = require('../helpers/delete-upload')

module.exports = class UserController {

    static async register(req, res){
        const { name, email, password, confirmPassword, phoneNumber, image} = req.body

        //Validation
        if(!name) {
            res.status(422).json({message: "Name required!"})
            return
        }
        if(!email) {
            //Need to validate the email
            res.status(422).json({message: "Email required!"})
            return
        }
        if(!phoneNumber) {
            //Need to validate the phone
            res.status(422).json({message: "Phone Number required!"})
            return
        }
        if(!password) {
            res.status(422).json({message: "Password required!"})
            return
        }
        if(!confirmPassword) {
            res.status(422).json({message: "Password Confirmation required!"})
            return
        }

        if(password !== confirmPassword){
            res.status(422).json({message: "Password and Password Confirmation must be equals!"})
            return
        }

        //check if user exists
        const userExists = await Users.findOne({raw: true, where : {email : email}})

        if(userExists){
            res.status(422).json({message: "Email already registered!"})
            return
        }


        //Create Password Encrypt
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //Create User
        const User = {
            name: name,
            email: email,
            password: passwordHash,
            phoneNumber: phoneNumber,
            image: image
        }

        Users.create(User)
        .then(async (User) => {
            res.status(201).json({
                message: "User registered!",
                User
            })
        })
        .catch((err)=>{
            res.status(500).json({message: err})
        })
    }

    static async login(req, res){
        const {email, password} = req.body

        if(!email) {
            //Need to validate the email
            res.status(422).json({message: "Email required!"})
            return
        }
        if(!password) {
            res.status(422).json({message: "Password required!"})
            return
        }

        const user = await Users.findOne({raw: true, where : {email : email}})

        if(!user){
            res.status(422).json({message: "User Not Found!"})
            return
        }

        //Check password 
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            res.status(422).json({message: "Invalid Password!"})
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req, res){

        let currentUser

        if(req.headers.authorization){

            const token = getToken(req)
            const decoded = jwt.verify(token, "FKLASGjkhfgasjhgasiudyga29381KJHDG*&¨%#@!KLSHGFDAJ")

            currentUser = await Users.findOne({raw: true, where: {id: decoded.id}})
            currentUser.password = undefined

        }else{
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res){
        const id = req.params.id

        const user = await Users.findOne({raw: true, attributes: {exclude: ['password']}, where : {id : id}})

        if(!user){
            res.status(422).json({message: "User Not Found!"})
            return
        }

        res.status(200).json({ user })
    }

    static async editUser(req, res){
        const token = getToken(req)
        const user = await getUserByToken(token)

        const {name, email, phoneNumber, password, confirmPassword} = req.body

        if(req.file) {
            user.image = req.file.filename
        }

        //validations
        if(!name) {
            res.status(422).json({message: "Name required!"})
            return
        }
        user.name = name

        if(!email) {
            //Need to validate the email
            res.status(422).json({message: "Email required!"})
            return
        }
        //Check if email has already taken
        const userExists = await Users.findOne({raw: true, where: {email: email}})
        if(user.email !== email && userExists){
            res.status(422).json({message: "Email already used!"})
            return
        }
        user.email = email

        if(!phoneNumber) {
            //Need to validate the phone
            res.status(422).json({message: "Phone Number required!"})
            return
        }
        user.phoneNumber = phoneNumber

        if(password !== confirmPassword){
            res.status(422).json({message: "Password and Password Confirmation must be equals!"})
            return
        }else if(password === confirmPassword && password != null){

            //Creating password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash

        }

        try {
            // returns user updated data
            await Users.update(user, {where: {id: user.id}})

            res.status(200).json({message: "User updated successfully!"})
            
        } catch (err) {
            res.status(500).json({message: err})
            return
        }
    }

    static async deleteUser(req, res){
        const token = getToken(req)
        const user = await getUserByToken(token)
        const UserId = user.id
        const id = req.params.id
        const filePath = await Expenses.findAll({where : {UserId : UserId}})

        let expenseIds = []

        filePath.map((item) => {
            expenseIds.push(item.id)
        })

        filePath.map((item) => {
            deleteImage("../backend/public/images/expenses/"+item.billet)
        })
        filePath.map((item) => {
            deleteImage("../backend/public/images/expenses/"+item.receipt)
        })
        
        const users = await Users.destroy({where : {id:id}})

        if(!users){
            res.status(422).json({message: "Fail to delete user!"})
            return
        }
        
        await Expenses.destroy({where : {UserId : UserId}, force: true})

        res.status(200).json({ message: "User deleted!" })
    }
}