const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blacklistToken.model');


module.exports.authUser = async(req,res,next)=>{
    //get token from request header
    const token = req.cookies.token || req.headers.authorization?.split('')[1];
    if(!token){ //if token is not provided
        return res.status(401).json({message:'Unauthorized access'});
    }

const isBlacklisted = await userModel.findOne({token:token}); //check if token is blacklisted    

if(isBlacklisted){
    return res.status(401).json({message:'Unauthorized access'});
}
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //verify token
        const user = await userModel.findById(decoded._id); //find user by id

        req.user = user; //set user in request object

        return next(); // move to next middleware
    } catch (err) {
        return res.status(401).json({message:'Unauthorized access'});
        
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id)
        req.captain = captain;
        
        return next()
    } catch (err) {
        console.log(err);

        res.status(401).json({ message: 'Unauthorized' });
    }
}