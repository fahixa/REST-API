// filename : model.js

// import mongoose dan inisiasi schema
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// import bcrypt and setup bcrypt_round
const bcrypt = require('bcrypt'),
    bcrypt_round = 5;
// import validator
const validator = require('validator');

// data user
const user_schema = new Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
    password: {
        type: String,
        required: true,
    },
    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        validate: {
            validator: function(str){
                return validator.isEmail(str);
            },
            message: "Email is not valid"
        },
    },
    data_joined : {
        type: Date,
        default: Date.now(),
    },
});

// encrypt password before saving
user_schema.pre("save", function(next){
    const user = this;
    if(user.isModified("password")){
        bcrypt.genSalt(bcrypt_round, function(err, salt){
            if(err){
                return next(err);
            }
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err){
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else return next();
});

// encrypt password before updating
user_schema.pre("findOneAndUpdate", async function(next){
    try {
        if(this._update.password){
            const hashed = await bcrypt.hash(this._update.password, bcrypt_round);
            this._update.password = hashed;
        }
        next();
    } catch(err){
        return next(err);
    }
});

// check password with bcrypt compare
user_schema.method.isPassMatch = function(pass, callback){
    bcrypt.compare(pass, this.password, function(err, isMatch){
        if(err){
            return callback(err);
        }
        callback(null, isMatch);
    });
}

module.exports = mongoose.model("User", user_schema);