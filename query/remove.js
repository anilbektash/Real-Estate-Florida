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
exports.deleteEstate = function (id, callback) {
    connection.query(
        "delete from estate where id = ?", [id], function(err, rows, fields)
        {
            if(err){
                console.log(err);
            }
        }
    );
    connection.query
    (
        "delete from location where id = ?", [id], function(err, rows, fields){
            if(err){
                console.log(err);
            }
        }
    );
    connection.query
    (
        "delete from text where id = ?", [id], function(err, rows, fields){
            if(err){
                console.log(err);
            }
        }
    );
    callback(undefined);
};
