const jwt = require('jsonwebtoken')

const User = require('../models/Users')

const getUserByToken = async(token) =>{
    if(!token){
        return res.status(401).json({message : "Access Denied!"})
    }

    const decoded = jwt.verify(token, "FKLASGjkhfgasjhgasiudyga29381KJHDG*&¨%#@!KLSHGFDAJ")

    const userId = decoded.id

    const user = await User.findOne({raw: true, where: {id: userId}})
    //console.log(user.name)
    return user
}

module.exports = getUserByToken