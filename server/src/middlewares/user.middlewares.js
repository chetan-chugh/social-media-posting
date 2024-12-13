const jwt = require("jsonwebtoken");
const User = require("../models/User")

exports.isLoggedIn = async (req, res, next) => {
    const token = req.header("Authorization");

    if(!token){
        return res.json({
            message:"Must be Logged In"
        });
    }

    const jwtToken = token.replace("Bearer","").trim();
    console.log("Token form auth middleware", jwtToken);

    try {
        const isVerified = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
        const userData = await User.findOne({ username:isVerified.username },{"password":0});
        console.log(userData)

        req.user = userData;
        req.token = token;
        req.userId = userData._id

    } catch (error) {
        return res.json({
            message:"unAuthorized. Invalid token"
        });        
    }
    next();
};
