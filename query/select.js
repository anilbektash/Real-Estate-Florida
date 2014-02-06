
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
//TESTED, DO NOT MODIFY!!
exports.email_ExistsFunc = function (emailToCheck, callback) {
    connection.query(
		"SELECT 1 from users WHERE email = '"+emailToCheck+"' ",function (error, results, fields)
		{
			if (error) {
				console.log(error);
			}
            console.log(results.length);
            if(results.length > 0){
                callback(true);
            }
            else{
                callback(false);
            }
        }
    );
    callback(undefined);
};
exports.passWithEmail = function (email, password, callback) {
    connection.query('SELECT * from users WHERE email = ? AND password = ?', [email, password], function(error, results, fields){
        console.log(results);
        if(results.length > 0){
            callback(true);
        }
        else{
            callback(false);
        }
    });
    callback(undefined);
};
exports.selectWithEmail = function (email, callback) {
    connection.query('SELECT * from users WHERE email = ?', [email], function(error, results, fields){
        console.log(results);
        if(results.length > 0){
            callback(results);
        }
    });
    callback(undefined);
};
