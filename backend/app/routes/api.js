
var User = require('../model/user');
var jwt = require('jsonwebtoken');
var secret = 'usermodel';




module.exports = function (router) {
    //Register New User
    router.post('/add', function (req, res) {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password

        if (req.body.name == null || req.body.name == '' || req.body.username == null || req.body.username == '' || req.body.email == null || req.body.email == '' || req.body.password == null || req.body.password == '') {
            res.json({ success: false, message: 'Fill all the fields' });
        } else {
            user.save(function (err) {
                if (err) {
                    if (err.errors != null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message });
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message });
                        }
                        else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message });
                        }
                        else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                        } else {
                            res.json({ success: false, message: err });
                        }
                    } else if (err) {
                        if (err.code == 11000) {
                            if (err.errmsg[62] == "u") {
                                res.json({ success: false, message: 'Username already taken' });
                            } else if (err.errmsg[62] == "e") {
                                res.json({ success: false, message: 'Email already registered' });
                            }
                        } else {
                            res.json({ success: false, message: err });
                        }
                    }
                } else {
                    res.json({ success: true, message: 'User Created...!' });
                }
            });
        }
    });

    // CheckUsername
    router.post('/username', function (req, res) {
        User.findOne({ username: req.body.username }).select('username').exec(function (err, user) {
            if (err) throw err;
            if (user) {
                res.json({ success: false, message: 'Username is already taken.' });
            } else {
                res.json({ success: true, message: 'Valid username' });
            }
        });
    });
    // CheckEmail
    router.post('/email', function (req, res) {
        User.findOne({ email: req.body.email }).select('email').exec(function (err, user) {
            if (err) throw err;
            if (user) {
                res.json({ success: false, message: 'E-mail is already registered.' });
            } else {
                res.json({ success: true, message: 'Valid email' });
            }
        });

    });
    // Authenticate
    router.post('/authenticate', function (req, res) {
        User.findOne({ username: req.body.username }).select('email username password').exec(function (err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'Authentication Failed' });
            } else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                } else {
                    res.json({ success: false, message: 'No Password provided' });
                } if (!validPassword) {
                    res.json({ success: false, message: 'Password not matched' });
                } else {
                    var token = jwt.sign({ username: user.username, email: user.email, permission: user.permission }, secret, { expiresIn: '1h' });
                    res.json({ success: true, message: 'User Authenticated', token: token });
                }

            }
        });

    });

    // router.use(function (req, res, next) {

    //     var token = req.body.token || req.body.query || req.headers['x-access-token'];
    //     if (token) {
    //         jwt.verify(token, secret, function (err, decoded) {
    //             if (err) {
    //                 res.json({ success: false, message: 'Token Invalid' });
    //             } else {
    //                 req.decoded = decoded;
    //                 next();
    //             }
    //         });
    //     } else {
    //         res.json({ success: false, message: 'No token passed' });
    //     }
    // });
    // router.post('/user', function (req, res) { 
    //      res.send(req.decoded);
    // });

    //Get User Permission
    router.post('/permission', function (req, res) {
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'No user was found' });
            } else {
                res.json({ success: true, permission: user.permission });
            }
        });
    });

    //get All users to Admin
    router.get('/users', function (req, res) {
        User.find({}, function (err, users) {
            if (err) throw err;

            if (!users) {
                res.json({ success: false, message: 'User not found' });
            } else {
                res.json({ success: true, users: users, permission: users.permission });
            }
        });
    });
    //get user to Admin
    router.get('/user/:id', function (req, res) {
        User.findById( req.params.id, function (err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'User not found' });
            } else {
                res.json({ success: true, user: user});
            }
        });
    });
    //Delete User
    router.route('/delete/:id').get((req, res) => {
        User.findByIdAndRemove(req.params.id , (err, user) => {
            if (err)
                console.log(err);
            else
                res.json('Remove Successfully');
        });
    });

    
   
   // Update User by Admin
    router.patch('/update/:id', function (req, res) {
        User.findById(req.params.id, function (err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'User not found' });
            } else {
                var newname = { name: req.body.name } 
                var newusername =  { username : req.body.username}
                var newusername = { permission: req.body.permission } 

                User.updateMany(newname, newusername, newusername, function (err, user) {
                    if (err) throw err;
                    else if (user){
                        res.json({ success: true, message: 'User details have been updated' });
                    }
                    
                });
            }
        });
    });

    //add value to specific user only
    router.post('/data/:id', function (req, res) {
        User.findById(req.params.id, function (err, user) {
            var userdata = { data: req.body.data};
            user.updateOne(userdata, function (err, user) {
                if (err) throw err;
               res.json({ success: true, message: 'User details have been updated', user });
         });
        });
    });

    return router;
}