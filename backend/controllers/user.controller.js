const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator')
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async(req,res,next)=>{
const errors = validationResult(req);
if(!error.isEmpty()){
    return res.status(400).json({errors:errors.array()});
}


const {fullname,email,password} = req.body;

const isUserAlreadyExist = await userModel.findOne({email});

if(isUserAlreadyExist){
    return res.status(400).json({message:'User already exist'});
}
 const hashedPassword = await userModel.hashPassword(password);   

const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname:fullname.lastname,
    email,
    password:hashedPassword
})
const token = usergenerateAuthToken();

res.status(201).json({token,user});
}

module.exports.loginUser = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    
    const {email,password} = req.body;  // get email and password from request body
    
    const user = await userModel.findOne({email}).select('+password');  // to get password

    if(!user){
        return res.status(401).json({message:'Invalid email or password'}); // if email is wrong
    }


    const isMatch = await user.comparePassword(password); //method from user.model.js
    
    if(!isMatch){
        return res.status(401).json({message:'Invalid email or password'}); // if password is wrong
    }

    const token = user.generateAuthToken(); //method from user.model.js
    res.cookie('token',token); // set token in cookie


    res.status(200).json({token,user}); // send token and user details
}

module.exports.getUserProfile = async(req,res,next)=>{
    res.status(200).json({user:req.user});
}

module.exports.logoutUser = async (req,res,next)=>{
    res.clearCookie('token'); //clear cookie
    const token = req.cookies.token || req.headers.authorization.split('')[1]; //get token from request header
    
    await blacklistTokenModel.create({token}); //add token to blacklist 
    res.status(200).json({message:'Logged out successfully'}); //send response
}