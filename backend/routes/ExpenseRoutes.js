const router = require('express').Router()

const ExpenseController = require('../controllers/ExpenseController')

//Middlewares
const verifyToken = require('../helpers/verifyToken')
const { imageUpload } = require('../helpers/image-upload')

router.post('/register', verifyToken, imageUpload.fields([{name: "receipt"},{name: "billet"}]), ExpenseController.registerExpense)
router.get('/:id', verifyToken, ExpenseController.getExpenseById)
router.get('/delete/:id', verifyToken, ExpenseController.deleteExpenseById)
router.patch('/edit/:id', verifyToken, imageUpload.fields([{name: "billet", maxCount: 1}, {name: "receipt", maxCount: 1}]), ExpenseController.editExpense)
router.get('/', verifyToken, ExpenseController.getAllExpenses)

module.exports = router