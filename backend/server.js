const express = require('express')
const colors = require('colors');
//rest object
const app = express();
app.get('/', (req, res) =>{
    res.send('<h1>Welcome to Ecommerce app</h1>')
})

//PORT
const PORT = 8080

//run listen
app.listen(PORT, () => {
    console.log(`Server Running on PORT:${PORT}`.yellow)
})