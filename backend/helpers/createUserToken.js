const jwt = require('jsonwebtoken')

const createUserToken = async(user, req, res) => {

    //Create Token
    const token = jwt.sign({
        name: user.name,
        id: user.id
    }, "FKLASGjkhfgasjhgasiudyga29381KJHDG*&¨%#@!KLSHGFDAJ")

    //return Token
    res.status(200).json({
        message: "Authentication Success!",
        token: token,
        userId: user.id
    })
}

module.exports = createUserToken