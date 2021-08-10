const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10

const userSchema = mongoose.Schema({
    name:{
        type:String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true,
        required:true
    },
    password:{
        type:String,
        minlength:5
    },
    token:{
        type:String,
    },
    image:{
        type:String
    },
    role:{
        type:Number,
        default:0
    }
})

userSchema.pre('save', function(next) {
    const user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            });
        });
    }else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}


userSchema.methods.generateToken = function(cb) {
    const user = this;
    var token = jwt.sign(user._id.toHexString(),'secret');
    user.token = token
    user.save((err,user) => {
        if(err) return cb(err)
        cb(null,user)
    })
}

userSchema.statics.findByToken = function(token, cb){
    const user = this;
    jwt.verify(token, 'secret', function(err, decoded) {
        user.findOne({_id:decoded, token:token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    });
}

const User = mongoose.model('User', userSchema)
module.exports = {User}