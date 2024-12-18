const express = require('express');
const router = express.Router();

const {newUser, userLogin, logOut, profile, post, changePassword} = require('../controllers/user.controllers');

const {isLoggedIn}  = require('../middlewares/user.middlewares')

router.post('/newUser',newUser);

router.post('/userLogin',userLogin);

router.get('/logOut',isLoggedIn, logOut);

router.get('/profile',isLoggedIn, profile);

router.post('/post',isLoggedIn, post);

router.post('/post',changePassword)

module.exports = router;