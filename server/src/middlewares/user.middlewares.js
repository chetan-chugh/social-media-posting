const jwt = require("jsonwebtoken");
const User = require("../models/User")

exports.isLoggedIn = async (req, res, next) => {
    if(!req.cookies.token){
        return res.json({
            message:"Must be Logged In"
        });
    }
    const jwtToken = req.cookies.token
    console.log("Token form auth middleware", jwtToken);

    try {
        const isVerified = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
        const userData = await User.findOne( {name:isVerified.name} ,{"password":0});
        console.log(userData)

        req.user = userData;
        // res.render("profile")

    } catch (error) {
        return res.json({
            message:console.log(`${error}`) || error
        });        
    }
    next();
};
