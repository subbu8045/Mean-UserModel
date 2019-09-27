var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 40],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
    }),
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z.]{3,20})+[ ]+([a-zA-Z.]{3,20})+)+$/,
        message: "Invalid name,  No special characters or nummbers. Must have space between first and last name."
    })
]
var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [8, 20],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters',
    }),
    validate({
        validator: 'matches',
        arguments: /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
        message: "Username must be alphanumeric and no special characters(./_ is allowed)"
    })
]
var passwordValidator = [
    validate({
        validator: 'isLength',
        arguments: [8, 30],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters',
    }),
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,30}$/,
        message: "Password must be between 8 to 30 Characters. Password must contain at least one lower case, one uppercase, one number and one special character"
    
    })
]
var Schema = mongoose.Schema;

var User = new Schema({

    name: {
        type: String,
        required: true,
        validate: nameValidator
    },
    username: {
        type: String,
        required: true,
        unique: true,
        validate: usernameValidator
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate: passwordValidator
    },
    permission: {
        type: String,
        required: true,
        default: 'user'
    },

    data: {
        type: String
    }

});

//hashing a password before saving it to the database
User.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

//Password verification
User.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);

}

//Title Case first and last name
User.plugin(titlize, {
    paths: ['name'],

});


//Custom validation for email
    User.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

module.exports = mongoose.model('User', User);
