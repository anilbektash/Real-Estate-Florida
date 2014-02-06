var mysql   = require('mysql');
var stochator   = require('stochasm');

var connection = mysql.createConnection({
	host : 'localhost', user : 'root', database : 'florida', password : 'root', port: process.env.PORT, debug : false,
});

connection.connect(function(err){
    if(!err){
        console.log("Connected to socialtrends DB");
    }
    console.log(err);
});
exports.insertEstate = function (userID, name, price, area, bed, bath) {
    var die = new stochator({
        kind: "integer",
        min: 1,
        max: 9999999
    });
    var randomID = die.next();
    connection.query(
        "INSERT INTO post(`id`, `userID`, `name`,`price`, `area`,`bed`, `bath`, `date`, `cur_time`) VALUES(?, ?, ?,  ?, ?, ?, ?, NOW(), CURRENT_TIME());", [randomID, userID, name, price, area, bed, bath], function(err, rows, fields)
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