var mysql   = require('mysql');
var stochator   = require('stochasm');

var connection = mysql.createConnection({
	host : 'localhost', user : 'root', database : 'florida', password : 'root', port: process.env.PORT, debug : false,
});

connection.connect(function(err){
    if(!err){
        console.log("Connected to florida DB");
    }
    console.log(err);
});
exports.deleteEstate = function (id, userID) {
    connection.query(
        "delete from estate where id = ? and userID = ?", [id, userID], function(err, rows, fields)
        {
            if(err){
                console.log(err);
            }
            if(rows !== undefined){
                connection.query
                (
                    "delete from location where id = ?", [id], function(err, rows, fields){
                        if(rows !== undefined){
                            connection.query
                            (
                                "delete from text where id = ?", [id], function(err, rows, fields){
                                    if(rows !== undefined){
                                        callback(true);
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
    callback(undefined);
};
