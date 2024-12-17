const User = require('../models/User.js');
const Post = require('../models/post');
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
        // return res.json({
        //     message:"User data are save successfully in Database",
        //     data:savedUserData
        // });
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
  
    //   const payloadRefreshToken = {
    //     username:user.username
    //   }
  
      const accessToken = jwt.sign(payloadAccessToken,process.env.ACCESS_TOKEN_SECRET,{expiresIn: process.env.ACCESS_TOKEN_EXPIRY})
      console.log("accessToken",accessToken)
  
    //   const refreshToken = jwt.sign(payloadRefreshToken,process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
  
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
        
        // res.json({
        //     success: true,
        //     message: "user logged In",
        //     accessToken
        // });
    }

    catch (error) {
        return res.json({
            message:`Error:${error}`
        });
    }
};

exports.logOut = async (req, res) => {
    try {
        // await User.findOneAndUpdate(req.user,{$set:{"accesstoken":""}})
        res.cookie("token","")
        return res.json({
            message:"User Logout"
        });
    } catch (error) {
        return res.json({
            message:`Error:${error}`
        });
    }
}

exports.profile = async (req, res) => {
    try {
        const name = await User.findOne({ username: req.user.username });
        res.render("profile", { name });
        // name.populate("posts");
        // return res.json({
        //     data:name
        // });
    } catch (error) {
        return res.json({
            message:`Error:${error}`
        });
    }
};

exports.post = async (req, res) => {
    try {
        let user = await User.findOne({username:req.user.username});
        // let userData = await User.findOne({username:user.username})
        console.log("a:",user)
        // console.log("b:",userData)
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