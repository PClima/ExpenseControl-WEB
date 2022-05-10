const express = require('express')
const cors = require('cors')

const conn = require('./db/conn')

const app = express()

// Config JSON response
app.use(express.json())

// Solve CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

// Public folder for images
app.use(express.static('public'))

//Routes
const UserRoutes = require('./routes/UserRoutes')
app.use('/users', UserRoutes)

const ExpenseRoutes = require('./routes/ExpenseRoutes')
app.use('/expense', ExpenseRoutes)

conn
    //.sync({force: true})
    .sync()
    .then(() => app.listen(5000))
    .catch((err)=>console.log(err))