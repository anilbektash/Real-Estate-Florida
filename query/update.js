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
exports.Update_User_Password = function (id, oldPassword, newPassword, callback) {
    connection.query(
        "select 1 from user where id = ? and password = ?", [id, oldPassword], function(err, result, fields){
            if(result !== undefined && result.length > 0){
                connection.query(
                    "UPDATE users SET password = '"+newPassword+"' WHERE id = '"+id+"' ", function(error,results,fields)
                    {
                        if(error){
                            console.log(error);
                            console.log("could not update password"+"\r\n");
                        }
                    }
                );
            }
        }
    );
    callback(undefined);
};

exports.Update_User_FirstName = function (id,newFirstName, callback) {
	connection.query
	(
		"SELECT 1 from users WHERE id = '"+id+"' ",function (error, results, fields)
		{
			if (error) {
				console.log(error);
			}
            if(results.length > 0){
				connection.query(
				"UPDATE users SET name = '"+newFirstName+"' WHERE id = '"+id+"' ", function(error,results,fields)
                {
					if(error){
						console.log(error);
						console.log("could not update first name"+"\r\n");
						}
					}
				);
                callback(true);
            }
            else{
                callback(false);
            }
        }
    );
    callback(undefined);
};

exports.Update_User_LastName = function (id, newLastName, callback) {
	connection.query
	(
		"SELECT 1 from users WHERE id = '"+id+"' ",function (error, results, fields)
		{
			if (error) {
				console.log(error);
			}
            if(results.length > 0){
				connection.query(
				"UPDATE users SET surname = '"+newLastName+"' WHERE id = '"+id+"' ", function(error,results,fields)
                {
					if(error){
						console.log(error);
						console.log("could not update Last name"+"\r\n");
						}
                }
				);
                callback(true);
            }
            else{
                callback(false);
            }
        }
    );
    callback(undefined);
};
exports.Update_User_email = function (id,newEmail, callback) {
	connection.query
	(
		"SELECT 1 from users WHERE id = '"+id+"' ",function (error, results, fields)
		{
			if (error) {
				console.log(error);
			}
            console.log("databaseFuncs.js:Update_User_email " + id);
            console.log(results.length);
            if(results.length > 0){
				connection.query
				(	"SELECT 1 FROM users WHERE email = ? ORDER BY email LIMIT 1", [newEmail], function (error, results, fields)
					{
						if (error)
						{
							console.log(error);

						}
                        if(undefined !== results && results.length  > 0)
						{
							console.log("this email is already taken"+"\r\n");
						}

						else
						{
                            console.log("databaseFuncs.js:Update_User_email " + id);
							connection.query
								(
								"UPDATE users SET email = '"+newEmail+"' WHERE id = '"+id+"' ", function(error,results,fields)
								{
									if(error)
									{
										console.log(error);
										console.log("could not update email"+"\r\n");
										}
									}
								);
						}
					}
				);
                callback(true);
            }
            else{
                callback(false);
            }
        }
    );
    callback(undefined);
};
exports.updateEstateStreetNum = function(id, change, callback){
    connection.query
    (
        "update location set street_num=? where id = ?", [change, id], function(err, result, field){
        }
    );
};
exports.updateEstateStreetName = function(id, change, callback){
    connection.query
    (
        "update location set street_name=? where id = ?", [change, id], function(err, result, field){
        }
    );
};
exports.updateEstateAptNum = function(id, change, callback){
    connection.query
    (
        "update location set apt_num=? where id = ?", [change, id], function(err, result, field){
        }
    );
};
exports.updateEstateCity = function(id, change, callback){
    connection.query
    (
        "update location set city=? where id = ?", [change, id], function(err, result, field){
        }
    );
};
exports.updateEstateState = function(id, change, callback){
    connection.query
    (
        "update location set state=? where id = ?", [change, id], function(err, result, field){
        }
    );
};
exports.updateEstateZipcode = function(id, change, callback){
    connection.query
    (
        "update location set zipcode=? where id = ?", [change, id], function(err, result, field){
        }
    );
};
exports.updateEstateText = function(id, change, callback){
    connection.query
    (
        "update text set content=? where id = ?", [change, id], function(err, result, field){
        }
    );
};
exports.updateEstateName = function(id, change, callback){
    connection.query
    (
        "update estate set name=?, date = now(), cur_time = current_time  where id = ?", [change, id], function(err, result, field){
        }
    );
};
exports.updateEstatePrice = function(id, change, callback){
    connection.query
    (
        "update estate set price=?, date = now(), cur_time = current_time  where id = ?", [change, id], function(err, result, field){
        }
    );
};
exports.updateArea = function(id, change, callback){
    connection.query
    (
        "update estate set area=?, date = now(), cur_time = current_time  where id = ?", [change, id], function(err, result, field){
        }
    );
};
exports.updateBed = function(id, change, callback){
    connection.query
    (
        "update estate set bed=?, date = now(), cur_time = current_time  where id = ?", [change, id], function(err, result, field){
        }
    );
};
exports.updateBath = function(id, change, callback){
    connection.query
    (
        "update estate set bath=?, date = now(), cur_time = current_time where id = ?", [change, id], function(err, result, field){
        }
    );
};
