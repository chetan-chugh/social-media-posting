const express = require('express');
const router = express.Router();

const {newUser, userLogin, logOut, profile, post} = require('../controllers/user.controllers');

const {isLoggedIn}  = require('../middlewares/user.middlewares')

router.post('/newUser',newUser);

router.post('/userLogin',userLogin);

router.post('/logOut', logOut);

router.get('/profile', profile);

router.post('/post',isLoggedIn, post);

module.exports = router;