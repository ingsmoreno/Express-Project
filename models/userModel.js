const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userShema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The User must have a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'The User must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid Email']
    }, 
    photo: String,
    password: {
        type: String,
        minLength: [8, 'The password must have more than 8 characters'],
        required: [true, 'The User must have a password'],
    }, 
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm the password'],
        validate: {
            validator: function(value){
                return value === this.password;
            }, 
            message: "The passwordConfirm must be equal to password",
        }
    }, 
});

userShema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next()
})

const User = mongoose.model('User', userShema);

module.exports = User;