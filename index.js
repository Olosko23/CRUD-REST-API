const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product')


const app = express();
const Port = 3000;

//middlewares
mongoose.set("strictQuery", false);
app.use(express.json());
app.use(express.urlencoded({extended: false}));


//database connection
mongoose.connect('mongodb+srv://olosko:olosko@rest2.etodvum.mongodb.net/?retryWrites=true&w=majority')
.then(() =>{
    console.log('MongoDB Connected')
})
.catch((error) =>{
    console.log(error)
})


//test routes
app.get("/", (req,res) =>{
    res.json("Hello There Welcome to the API");
});


//actual routes-----Create a Product
app.post('/products', async(req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json(product);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

//GET all products
app.get('/products', async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//GET one product
app.get('/products/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


//Update a product
app.patch('/products/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        // we cannot find any product in database
        if(!product){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        const updatedProduct = await Product.findById(id);
        res.status(201).json(updatedProduct);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// delete a product

app.delete('/products/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        res.status(201).json(product);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//port listening
app.listen(Port, () =>{
    console.log(`Server Running on Port ${Port}...`)
})
