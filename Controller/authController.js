const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES})
}

exports.signup = async (req, res, next)=>{
    const newUser = await User.create(req.body);

    // const token = jwt.sign({id: newUser.id},process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES})
    const token = signToken(newUser.id)
    res.status(200).json({
        status: 'Success',
        tokens: token, 
        user: {newUser}
    });
}

exports.login = async (req, res, next) =>{
    const {email,password} = req.body;
    if(!email || !password){
        const err = new Error('Please provide valid email or password');
        next();
    }
    const user =await  User.findOne({ email}).select('+password');
    console.log(user)
    const correct = await user.correctPassword(password, user.password );

    if(!correct){
        const err = new Error();
        next();
    }

    console.log(correct)
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token: token,
    });
}

exports.protect= async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        next(new Error('Invalid get request'));
    }
    console.log(token)

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); 
    
    console.log(decoded);  
    next();
}