const express = require('express')
const app = express();
const cors = require("cors");
const colors = require('colors');
const dotenv = require("dotenv");
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const userRoutes =require('./routes/userRoutes')
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

//configure env
dotenv.config();

//connect to database
connectDB();

//middlewares
app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent with requests
  })
);
// app.use(morgan('dev'))


//routes
app.use('/api/user', userRoutes)
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

//rest api
app.get('/', (req, res) =>{
    res.send('<h1>Welcome to Ecommerce app</h1>')
})



//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
    console.log(`Server Running on mode ${process.env.DEV_MODE} on PORT:${PORT}`.bgCyan.white);
})