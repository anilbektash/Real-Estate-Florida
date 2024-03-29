var mysql   = require('mysql');
var stochator   = require('stochasm');
var config = require('../config.js');
var connection = mysql.createConnection({
	host : config.server.host, user : config.database.user, database : config.database.name, password : config.database.password, port: process.env.PORT, debug : false,
});

connection.connect(function(err){
    if(!err){
        console.log("Connected to florida DB");
    }
    console.log(err);
});
exports.insertEstate = function (userID, name, price, area, bed, bath, callback) {
    var die = new stochator({
        kind: "integer",
        min: 1,
        max: 9999999
    });
    var randomID = die.next();
    connection.query(
        "insert into estate(`id`, `userID`, `name`,`price`, `area`,`bed`, `bath`, `date`, `cur_time`) VALUES(?, ?, ?,  ?, ?, ?, ?, NOW(), CURRENT_TIME());", [randomID, userID, name, price, area, bed, bath], function(err, rows, fields)
        {
            if(err){
                console.log(err);
                callback(false);
            }
            else
            {
                callback(randomID);
            }
        }
    );
    callback(undefined);
};
//id: post id
exports.insertLocation = function (id, streetNum, streetName, aptNum, city, area, state, zip, callback) {
    if(!streetNum.length){
        streetNum = "";
    }
    connection.query(
        "insert into location(`id`, `street_num`, `street_name`, `apt_num`, `city`,  `state`, `zipcode`) VALUES(?, ?, ?,  ?, ?, ?, ?);", [id, streetNum, streetName, aptNum, city, area, state, zip], function(err, rows, fields)
        {
            if(err){
                console.log(err);
                callback(false);
            }
            else{
                callback(true);
            }
        }
    );
    callback(undefined);
};
//id: post id
exports.insertText = function (id, text, callback) {
    connection.query(
        "insert text(`id`, `content`) VALUES(?, ?);", [id, text], function(err, rows, fields)
        {
            if(err){
                console.log(err);
                callback(false);
            }
            else{
                callback(true);
            }
        }
    );
    callback(undefined);
};
