/**
 * Module dependencies.
 */

/*------------------------------------------------*/
var express     = require('express');
var http        = require('http');
var path        = require('path');
var socketio    = require('socket.io');
var check       = require('validator');
var sanitize    = require('validator').sanitize;
var mkdirp      = require('mkdirp');
var fs          = require('fs-extra');
var stochator   = require('stochasm');
/*-----------------Database Functions-------------------------------*/
var update    = require('./query/update');
var select    = require('./query/select');
var insert    = require('./query/insert');
var remove    = require('./query/remove');
/*-----------------Route Handlers-------------------------------*/
var index       = require('./routes/index');
var signin      = require('./routes/signin');
var contact     = require('./routes/contact');
var admin    = require('./routes/admin');
var config      = require('./config.js');
var listing = require('./routes/listing');
var propertySingle = require('./routes/property-single');
var blog = require('./routes/blog');
//express application
var app         = express();
var date        = new Date();
// all environments
app.set('port', config.server.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./public'));
app.use(express.static('./public/images'));
app.use(express.static('./public/javascripts'));
app.use(express.static('./public/scroll'));
app.use(express.static('./public/bootstrap'));
app.use(express.static('./public/stylesheets'));
app.use(express.static('./public/users'));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

/*------------------FUNCTIONS------------------------------*/
var antiFloodAttack = function(req, string){
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if(string.length > 1e6)
        {
            req.connection.destroy;
        }
};
/*------------------------------------------------*/
app.get('/signin', signin.signinFunction);
app.get('/contact', contact.contactFunction);
app.get('/admin', admin.adminFunction);
app.get('/', index.indexFunction);
app.get('/index', index.indexFunction);
app.get('/listing', listing.listingFunction);
app.get('/property-single', propertySingle.propertysingleFunction);
app.get('/blog', blog.blogFunction);

/*---------------------The server itself and the socket---------------------------*/
var server = http.createServer(app);

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
var socket = socketio.listen(server, {log:false});
/*------------------Critical Exception Handling------------------------------*/

//Default kill signal
process.on('SIGTERM', function() {
    server.close();
    console.log('Terminated at ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
    process.exit();
});
//CTRL-c
process.on('SIGINT', function() {
    //close the server
    console.log('Terminated from console at ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
    process.exit();
});
/*-------------------SOCKET PART/Listen Client for Input Changes-----------------------------*/
socket.sockets.on('connection', function (socket){
    var isExist = undefined;
    socket.on('socket-login', function (data) {
        console.log("User mail or nick (to be checked):" + data.email);
        console.log("User pass  (to be checked):" + data.password);
        if(check.isEmail(data.email) == true){
            try{
                select.email_ExistsFunc(data.email, function ifexists(isExist){
                    if(isExist == true){
                        select.passWithEmail(data.email, data.password, function enter(isOkay){
                            if(isOkay == true){
                                select.selectWithEmail(data.email, function getResults(result){
                                    console.log("Results: " + result);
                                    if(result !== undefined && result.length !== 0){
                                        socket.emit("socket-validate", {id: result[0].id, first_name: result[0].name, last_name: result[0].surname,  email: result[0].email, value: "true"});
                                    }
                                });
                            }
                            else if(isOkay == false){
                                socket.emit("socket-validate", {message:"Check your password", value: "false"});
                            }
                        });
                    }
                    else if(isExist == false){
                        socket.emit("socket-validate", {message: "You are not registered", value: "false"});
                    }
                });
            }
            catch(err)
            {
                console.log(err);
            }
        }
        else{
            socket.emit("socket-validate", {message: "Please check your email", value: "false"});
        }
    });
    //lists estates 10 of them, according to index*10 as starting index
    socket.on('socket-getlisting', function(data){
        select.select10Estate(data.index, function callback(results){
            if(results !== undefined){
                socket.emit("socket-sendlisting", {result:results});
            }
        });
    });
    //deletes estate
    socket.on('socket-delete', function(data){
        remove.deleteEstate(data.id, function callback(results){
            if(results !== undefined){
            }
        });
    });
    //inserts estate
    socket.on('socket-insertestate', function(data){
        console.log("Inserting...");
        insert.insertEstate(data.userID, data.name, data.price, data.area, data.bed, data.bath,  function callback(results){
            if(results !== undefined && results !== false){
                var estateID = results;
                console.log("Estate id: " + estateID);
                insert.insertLocation(estateID, data.streetNum, data.streetName, data.aptNum, data.city, data.area, data.state, data.zip, function location(isDone){
                    if(isDone !== undefined && isDone == true){
                        insert.insertText(estateID, data.text, function location(isText){
                            if(isText !== undefined && isText == true){
                                if(data.image != "") {
                                    var saveDirectory = "./public/users/" + data.userID + "/posts/" + estateID;
                                    console.log("Image save dir: " + saveDirectory);
                                    fs.writeFile(saveDirectory, data.image.replace(/^data:image\/jpeg;base64,/,'').replace(/^data:image\/png;base64,/,'') , 'base64',function(err){});
                                    console.log("Image saved to the file system successfully");
                                }
                            }
                        });
                    }
                });
            }
        });
    });
    //search amid the real estates in the databases with names, street, city etc parameters
    socket.on('socket-search', function(data){
        select.search(data.input, function(done){
            if(done !== undefined){
                socket.emit('socket-searchresults', {});
            }
        });
    });
    socket.on('socket-selectsingle', function(data)){
        select.selectEstate(data.id, function(done){
        });
    }
    socket.on('socket-passwordchange', function(data){
        console.log("In pass change data: " + JSON.stringify(data));
        if(data.password && data.password.length > 0){
            update.Update_User_Password(data.id, data.old, data.password, function(done){
                if(done===false) {
                    socket.emit("socket-passwordalert", {data: "Please enter your current password correctly"});
                }
            });
        }
    });
    //revoked in user settings page when a user changes his or her profile settings
    socket.on('socket-settingschange', function(data){
        console.log("In settings change data: ");
        console.log("In settings change data: " + JSON.stringify(data));
        var counter = 0;
        if(data.firstname && data.firstname.length > 0){
            counter++;
            update.Update_User_FirstName(data.id, data.firstname, function(done){
                if(done===false) {
                    socket.emit("socket-alert", {data: "Name couldn't updated"});
                }
            });
        }
        if(data.profilepic && data.profilepic.length > 0){
            var saveDirectory = "./public/users/" + data.id + "/profilepic.png";
            console.log("Image save dir: " + saveDirectory);
            fs.writeFile(saveDirectory, data.profilepic.replace(/^data:image\/jpeg;base64,/,'').replace(/^data:image\/png;base64,/,'') , 'base64',function(err){});
            console.log("Image saved to the file system successfully");
        }
        if(data.lastname && data.lastname.length > 0){
            counter++;
            update.Update_User_LastName(data.id, data.lastname, function(done){
                if(done===false) {
                    socket.emit("socket-alert", {data: "Surname couldn't updated"});
                }
            });
        }
        if(data.bio && data.bio.length > 0){
            counter++;
            update.updateBio(data.id, data.bio, function(done){
            });
        }
        if(data.email && data.email.length > 0){
            counter++;
            update.Update_User_email(data.id, data.email, function(done){
                if(done===false) {
                    socket.emit("socket-alert", {data: "Email couldn't updated"});
                }
            });
        }
        if(counter == data.length){
            socket.emit('socket-alert', {data: "Settings changes successfully"});
        }
    });
    //revoked in user settings page when a user changes his or her profile settings
    socket.on('socket-estateupdate', function(data){
        var counter = 0;
        if(data.streetnum && data.streetnum.length > 0){
            counter++;
            update.updateEstateStreetNum(data.id, data.streetnum, function(done){});
        }
        if(data.streetname && data.streetname.length > 0){
            counter++;
            update.updateEstateStreetName(data.id, data.streetname, function(done){
            });
        }
        if(data.aptnum && data.aptnum.length > 0){
            counter++;
            update.updateEstateAptNum(data.id, data.aptnum, function(done){
            });
        }
        if(data.city && data.city.length > 0){
            counter++;
            update.updateEstateCity(data.id, data.city, function(done){
            });
        }
        if(data.state && data.state.length > 0){
            counter++;
            update.updateEstateState(data.id, data.state, function(done){
            });
        }
        if(data.zipcode && data.zipcode.length > 0){
            counter++;
            update.updateEstateZipcode(data.id, data.zipcode, function(done){
            });
        }
        if(data.text && data.text.length > 0){
            counter++;
            update.updateEstateText(data.id, data.text, function(done){
            });
        }
        if(data.name && data.name.length > 0){
            counter++;
            update.updateEstateName(data.id, data.name, function(done){
            });
        }
        if(data.price && data.price.length > 0){
            counter++;
            update.updateEstatePrice(data.id, data.price, function(done){
            });
        }
        if(data.area && data.area.length > 0){
            counter++;
            update.updateEstateArea(data.id, data.area, function(done){
            });
        }
        if(data.bed && data.bed.length > 0){
            counter++;
            update.updateEstateBed(data.id, data.bed, function(done){
            });
        }
        if(data.bath && data.bath.length > 0){
            counter++;
            update.updateEstateBath(data.id, data.bath, function(done){
            });
        }
        if(counter == data.length){
            socket.emit('socket-alert', {data: "Estate information updated successfully"});
        }
    });
});
