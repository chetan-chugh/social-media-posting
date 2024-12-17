const path = require('path')
const cookieParser = require('cookie-parser')
const express = require('express');
const dotenv = require('dotenv')
dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

const {connectToDB} = require('./src/config/db.js');
const router = require('./src/routers/user.routers.js');
const { name } = require('ejs');

app.set("view engine","ejs");
app.set('views',path.resolve('./src/views'))

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/',router);


app.get('/', (req, res) => {
    res.render("index")
})

app.get('/login', (req, res) => {
    res.render("login")
    
//  res.redirect("/profile")
})

app.get('/logout', (req, res) => {
    res.render("login")
})

app.get('/profile', (req, res) => {
    res.render("profile")
})

// app.post('/post', (req, res) => {
//     res.render("profile")
// })
app.listen(port, () => console.log(`Server started at port ${port}`));
connectToDB();