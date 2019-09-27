var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Data = new Schema({ 
    name: {
        type: String,
    },
});

module.exports = mongoose.model('Data', Data);
