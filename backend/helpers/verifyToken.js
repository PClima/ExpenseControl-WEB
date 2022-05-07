const jwt = require('jsonwebtoken')
const getToken = require('./getToken')

//middleware to validate token
const checkToken = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(401).json({message : "Access Denied!"})
    }
    const token = getToken(req)

    if(!token){
        return res.status(401).json({message : "Access Denied!"})
    }

    try {
        const verified = jwt.verify(token, "FKLASGjkhfgasjhgasiudyga29381KJHDG*&¨%#@!KLSHGFDAJ")

        req.user = verified
        next()
    } catch (err) {
        return res.status(400).json({message: "Token Invalido"})
    }
}

module.exports = checkToken