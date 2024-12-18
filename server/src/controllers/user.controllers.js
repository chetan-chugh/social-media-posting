const User = require('../models/User.js');
const Post = require('../models/Post.js');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

//User Create 
exports.newUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
    
        if(!username || !email || !password){
            return res.json({
                message:'Please enter username, email and password'
            });
        }
    
        if(email === await User.findOne({email},{"email":1, "_id":0})){
            return res.json({
                message:"User are already exist"
            });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const savedUserData = await User.create({
            username,
            email,
            password:hashedPassword
        });

        const checkUser = await User.findOne({username},{"username":1,"password":1,"_id":0});
        const {accessToken} = await generateAccessTokens(checkUser); 

        res.cookie("token",accessToken)
        res.redirect("/profile")
    } catch (error) {
        return res.json({
            message:`Error:${error}`
        });
    }
};

const generateAccessTokens = async (username) => {
    try {
      const user = await User.findOne(username)
  
      const payloadAccessToken = {
        username:user.username
      }
  
      const accessToken = jwt.sign(payloadAccessToken,process.env.ACCESS_TOKEN_SECRET,{expiresIn: process.env.ACCESS_TOKEN_EXPIRY})
      console.log("accessToken",accessToken)

      user.accesstoken = accessToken
      await user.save({ validateBeforeSave: false })

      return {accessToken}
  
    } catch (error) {
      message:error
    }
}

exports.userLogin = async (req, res) => {
    try {
        const {username, password} = req.body;
        if(!username && !password){
            return res.json({
                message:"Please enter username and password for login"
            });
        }
    
        const checkUser = await User.findOne({username},{"username":1,"password":1,"_id":0});
    
        if(!checkUser){
            return res.json({
                message:"User is not exist."
            });
        }
    
        const checkPassword = await bcrypt.compare(password, checkUser.password);
        if(!checkPassword){
            return res.json({
                message:"Password is not correct"
            });
        }
    
        const {accessToken} = await generateAccessTokens(checkUser); 

        res.cookie("token",accessToken)
        res.redirect("/profile")
    }

    catch (error) {
        return res.json({
            message:`Error:${error}`
        });
    }
};

exports.logOut = async (req, res) => {
    try {

    } catch (error) {
        return res.json({
            message:`Error:${error}`
        });
    }
}

exports.profile = async (req, res) => {
    try {
        const name = await User.findOne({ username: req.user.username });
        // console.log(name)
        res.render("profile", { name });
    } catch (error) {
        return res.json({
            message:`Error:${error}`
        });
    }
};

exports.post = async (req, res) => {
    try {
        let user = await User.findOne({username:req.user.username});
        let {text} = req.body;
        let post = await Post.create({
            user:user._id,
            text
        });
        
        user.posts.push(post._id);
        await user.save();
        res.redirect("/profile")
    } catch (error) {
        return res.json({
            message:`Error:${error.message || error}`
        });
    }
}