const User = require('../models/User.js');
const Post = require('../models/Post.js');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')
const dotenv = require('dotenv');
dotenv.config();

//User Create 
exports.newUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if(email === await User.findOne({email},{"email":1, "_id":0})){
        return res.json({
            message:"User are already exist"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUserData = await User.create({
        name,
        email,
        password:hashedPassword
    });

    const checkUser = await User.findOne({name},{"name":1,"password":1,"_id":0});
    const {accessToken} = await generateAccessTokens(checkUser); 

    res.cookie("token",accessToken)
    console.log("a:",savedUserData)
    res.json(savedUserData);
} catch (error) {
    return res.json({
        message:`Error:${error}`
    });
}
};

const generateAccessTokens = async (name) => {
  try {
    const user = await User.findOne(name)

    const payloadAccessToken = {
      name:user.name
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
        const {name, password} = req.body;
        if(!name && !password){
            return res.json({
                message:"Please enter username and password for login"
            });
        }
    
        const checkUser = await User.findOne({name},{"username":1,"password":1,"_id":0});
    
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

exports.changePassword = async (req, res) => {
    try {
      const {oldPassword, newPassword} = req.body;
      if(!oldPassword || !newPassword){
        res.json({
          message:"Please enter old password and new password"
        });
      }
      const user = await User.findOne(req.user._id)
  
      const checkPassword = await bcrypt.compare(oldPassword, user.password);
      if (!checkPassword) {
        return res.json({
          success: false,
          message: "password is invalid",
        });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword;
  
      await user.save({validateBeforeSve: false})
  
      return res.json({
        message:"Password change successfully"
      });
  
    } catch (error) {
      data:error
    }
};

global.otpStore = ""

exports.forgotPassword = async (req, res) => {
  try {
    const otp = otpGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
      const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: false,
          auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
          },
      });
      
      const receiver = await transporter.sendMail({
          from: process.env.SMTP_MAIL,
          to: process.env.TO_MAIL,
          subject: "Otp",
          text: `Your OTP is ${otp}`,
      }); 

      global.otpStore = otp;

      return res.json({
          data:receiver,
          message:"Mail is send successfully"
      });
  } catch (error) {
      data:error
  }
};

exports.verifyOTP = async (req, res) => {
  const otpByUser = req.body.otp;
  const otpInMail = global.otpStore;
  if(!otpByUser){
    return res.json({
      message:"Please enter otp"
    });
  }

  if(otpByUser == otpInMail){
    return res.json({
      message:'OTP is valid'
    });
  }

  return res.json({
    message:'OTP is not correct'
  });
};

exports.newPassword = async (req, res) => {
  try {
    const {email, newPassword, confirmPassword} = req.body;
    if(!email || !newPassword || !confirmPassword){
      return res.json({
        message:'Enter email, new password and confirm password'
      });
    }

    if(newPassword !== confirmPassword){
      return res.json({
        message:"Confirm password is not match to confirm password"
      });
    }

    const emailCheck = await User.findOne({email},{"email":1,"_id":0});

    if(!emailCheck){
      return res.json({
        message:"Email is not matched"
      });
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    const savedNewPassword = await User.findOneAndUpdate(emailCheck,{$set:{password:hashedPassword}});
  
    return res.json({
      message:'Password change successfully',
      data:savedNewPassword
    });
  } catch (error) {
    message:error
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