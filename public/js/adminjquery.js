        var socket = io.connect('http://localhost');
        $(document).ready(function() {
                var addstr = '<img src="users/' + localStorage['id'] + '/profilepic.png" style="width:100px;height:100px;border-radius:50px;';
		addstr += 'background:#ddd"/>';
		addstr += ' ' +localStorage['isim'] + ' ' + localStorage['soyisim'];
        	$('#namesurname').html(addstr);
		$("#newrecord").hide();
                $("#profilesettings").hide();
		$("#overviewbutton").click(function(){
			$("#newrecord").hide();
			$("#profilesettings").hide();
	  		$("#overview").show();
		});
		$("#newrecordbutton").click(function(){
	  		$("#newrecord").show();
			$("#profilesettings").hide();
	  		$("#overview").hide();
		});
		$("#profilesettingsbutton").click(function(){
	  		$("#profilesettings").show();
	  		$("#overview").hide();
			$("#newrecord").hide();
		});
                var str = "url(/users/" + localStorage['id'] + '/profilepic.png)';
                $("#profilephoto").css('background-image',str);
  	        $("#namefield").attr('placeholder',localStorage['isim']);
      		$("#surnamefield").attr('placeholder',localStorage['soyisim']);
      		$("#nicknamefield").attr('placeholder',localStorage['nickname']);
      		$("#emailfield").attr('placeholder',localStorage['mail']);
		socket.emit('socket-getlisting', {index : 0});
	});
	socket.on('socket-sendlisting', function(data){
		alert(JSON.stringify(data));
	});

	function socketgonder(comment,title,price,area,bed,bath,streetn,apartmentn,street,city,state,zipcode)
	{
		if(cnt == "Empty")
			socket.emit('socket-insertestate', {
			userID : localStorage['id'],
			image : "" ,
			text : comment,
	 		name : title,
			price : price,
			area : area,
			bed : bed,
			bath : bath,
			streetNum : streetn,
			apartmentNum : apartmentn,
			streetName : street,
			city : city,
			state : state,
			zipcode : zipcode});
		else
			socket.emit('socket-insertestate', {
			userID : localStorage['id'],
			image : cnt ,
			text : comment,
	 		name : title,
			price : price,
			area : area,
			bed : bed,
			bath : bath,
			streetNum : streetn,
			apartmentNum : apartmentn,
			streetName : street,
			city : city,
			state : state,
			zipcode : zipcode});
		alert("Saved successfuly.")
	}

        
