/**
 * Module dependencies.
 */

/*------------------------------------------------*/
var express     = require('express');
var http        = require('http');
var path        = require('path');
var socketio    = require('socket.io');
var check       = require('validator').check;
var sanitize    = require('validator').sanitize;
var mkdirp      = require('mkdirp');
var fs          = require('fs-extra');
var stochator   = require('stochasm');
/*-----------------Database Functions-------------------------------*/
var update    = require('./query/update');
var select    = require('./query/select');
var insert    = require('./query/insert');
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
        try{
            check(data.email).len(6, 64).isEmail();
            try{
                database.email_ExistsFunc(data.email, function ifexists(isExist){
                    if(isExist == true){
                        database.passWithEmail(data.email, data.password, function enter(isOkay){
                            if(isOkay == true){
                                database.selectWithEmail(data.email, function getResults(result){
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
        catch(error){
            socket.emit("socket-validate", {message: "Please check your email", value: "false"});
        }
    });
    //returns only user id, name and surname
    socket.on('socket-getusername', function(data){
        database.selectNameSurname(data.id, function callback(situation){
            if(situation !== false && situation !== undefined){
                socket.emit('socket-usernamesurname', {usernamesurname: situation});
            }
        });
    });
    socket.on('socket-post', function(data){
        /*
         *
         * data.id: post sender's id
         * data.videos: videos array
         * data.images: images array
         * data.types:  types of the post content, 0 for image, 1 for video
         */
            var i;
            database.insertEstate(data.userID, data.name, data.price, data.area, data.bed, data.bath,  function callback(results){
                if(results !== undefined && results !== false){
                    var postID = results;
                    database.insertLink(postID, data.videos[i], function callback(isDone){
                        console.log("Video added to database successfully");
                    });
                    for(i=0;i<data.images.length;i++)
                    {
                    var saveDirectory = "./public/users/" + data.id + "/posts/" + postID + "_" + i;
                    fs.writeFile(saveDirectory, data.images[i].replace(/^data:image\/jpeg;base64,/,'').replace(/^data:image\/png;base64,/,'') , 'base64',function(err){});
                    console.log("Image saved to the file system successfully");
                    }
                }
            });
    });
    //revoked in user settings page when a user changes his or her profile pic
    socket.on('socket-profile', function(data){
        if(data.image){
        var directory = './public/users/' + data.id + '/profilepic.png';
        fs.writeFile(directory, data.image.replace(/^data:image\/jpeg;base64,/,'').replace(/^data:image\/png;base64,/,'') , 'base64',function(err){});
        }
    });
    //revoked in user settings page when a user changes his or her profile settings
    socket.on('socket-settingschange', function(data){
        var counter = 0;
        if(data.firstname && data.firstname.length > 0){
        counter++;
        update.Update_User_FirstName(data.id, data.firstname, function(done){
            if(done===false) {
            socket.emit("socket-alert", {data: "Name couldn't updated"});
            }
            });
        }
        if(data.lastname && data.lastname.length > 0){
        counter++;
        update.Update_User_LastName(data.id, data.lastname, function(done){
            console.log(data);
            if(done===false) {
            socket.emit("socket-alert", {data: "Surname couldn't updated"});
            }
            });
        }
        if(data.password && data.password.length > 0){
        counter++;
        update.Update_User_Password(data.id, data.password, function(done){
                if(done===false) {
                socket.emit("socket-alert", {data: "Password couldn't updated"});
                }
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
});
