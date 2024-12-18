const path = require('path')
const cookieParser = require('cookie-parser')
const express = require('express');
const User = require('./src/models/User.js');
const Post = require('./src/models/Post.js');
const {isLoggedIn}  = require('./src/middlewares/user.middlewares.js')
const dotenv = require('dotenv')
dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

const {connectToDB} = require('./src/config/db.js');
const router = require('./src/routers/user.routers.js');
const { name } = require('ejs');

app.set("view engine","ejs");
app.set('views',path.resolve('./src/views'))
app.use(express.static(path.join(__dirname,'public')));

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
    res.clearCookie("token");
    res.render("login")
})

app.get('/profile',isLoggedIn, async (req, res) => {
    const name = await User.findOne({ username: req.user.username }).populate("posts")
    res.render("profile",{ name })
})

app.get('/changePassword', (req, res) => {
    res.render("changePassword")
})

app.post('/post', (req, res) => {
    res.render("profile")
})

app.get('/like/:id', async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id }).populate("user")

    if(post.likes.indexOf(req.user) === -1){
        post.likes.push(req.user)
    } else{
        post.likes.splice(post.likes.indexOf(req.user), 1);
    }
    
    await post.save()
    res.redirect("/profile");
})

app.get('/edit/:id', isLoggedIn, async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id }).populate("user")

    res.render("edit")
})

app.listen(port, () => console.log(`Server started at port ${port}`));
connectToDB();