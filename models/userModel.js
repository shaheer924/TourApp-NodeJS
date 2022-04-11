const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Name is missing'],
        unique: true
    },
    email: {
        type: String,
        require: [true, 'Email is missing'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please Provide valid email']
    },
    photo: {
        type: String,
        require: [true, 'Photo is missing'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'Password is missing'],
        minlength: 8
    },
    passConfirm: {
        type: String,
        require: [true, 'Password is missing'],
        minlenght: 8,
        validate: function(pass){
            return pass === this.password
        },
        message: 'Passwords are not same'
    }
});

userSchema.pre('save', async function(next){
    if( !this.isModified('password')){
        return next();
    }

    this.password =  await bcrypt.hash(this.password,12);
    this.passConfirm = undefined;
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;