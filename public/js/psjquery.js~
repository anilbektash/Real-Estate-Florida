	var socket = io.connect('http://localhost');
	
	$(document).ready(function() {
		var str = "/users/" + userid + '/posts/' + id;
                $("#estatephoto").attr('src', str );
		str = "/users/" + userid + '/profilepic.png';
		alert(str);
                $("#adminphoto").attr('src',str );
		socket.emit('socket-selectsingle',{id:id,userID:userid});
	});
	
	socket.on('socket-getsingle',function(data){
		alert(data.result.name);
	});
