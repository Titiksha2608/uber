const userModel = ('../models/user.model');


module.exports.createUser = async({
    firstname,lastname,email,password
})=>{
    if(!firstname||!email ||!password){ //these are required throw error
        throw new Error('All fields are required');
    }
     const user = userModel.create({
        fullname:{
            firstname,lastname
        },
        email,password
     })

     return user;
}