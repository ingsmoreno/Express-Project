const crypto = require('crypto')
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
        select: false
    }, 
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm the password'],
        validate: {
            validator: function(value){
                return value === this.password;
            }, 
            message: "The passwordConfirm must be equal to password",
        },
        select: false
    }, 
    role: {
        type: String, 
        enum: ['admin', 'guide', 'user', 'lead-guide'],
        default: 'user'
    }, 
    passwordChangedAt: Date,
    passwordResetToken: String, 
    passwordResetExpires: Date,
});

userSchema.pre('save', async function(next){

    //Only run this function if password was actually modified
    if(!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    //Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next()
})

userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimeStamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimeStamp < changedTimeStamp;
    }

    return false;
   
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto
        .randomBytes(32)
        .toString('hex');
    
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;

}

const User = mongoose.model('User', userSchema);

module.exports = User;