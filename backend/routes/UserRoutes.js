const router = require('express').Router()

const UserController = require('../controllers/UserController')

//Middlewares
const verifyToken = require('../helpers/verifyToken')
const { imageUpload } = require('../helpers/image-upload')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkUser', UserController.checkUser)
router.get('/:id', UserController.getUserById)
router.get('/delete/:id', verifyToken, UserController.deleteUser)
router.patch(
    '/edit/:id', 
    verifyToken, 
    imageUpload.single("image"), 
    UserController.editUser
)

module.exports = router