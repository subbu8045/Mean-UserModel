var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

var User = require('./app/model/user');
var mongoose = require('mongoose');
var morgan = require('morgan');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);



app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use('/api', appRoutes);
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

mongoose.connect('mongodb://localhost:27017/usermodel');

var conn = mongoose.connection;
//handle mongo error
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function () {
    console.log('Connected to MongoDB')
});



app.listen(4000, function () {
    console.log('Running the server on 4000')
});
