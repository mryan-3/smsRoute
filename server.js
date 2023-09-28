const express = require('express')
const app = express()
app.use(express.json())
const smsRoute =  require('./route')

app.use('/', smsRoute )
const port = 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})