        var socket = io.connect('http://localhost');
	var indexnumber = 0;
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
                $("#profilephoto").css('background-image',str );
		$("#profilephoto").css('background-size' ,'cover');
		$("#profilephoto").css('background-position' ,'center center');
		$("#profilephoto").css('border-radius' ,'6px');
  	        $("#namefield").attr('placeholder',localStorage['isim']);
      		$("#surnamefield").attr('placeholder',localStorage['soyisim']);
      		$("#nicknamefield").attr('placeholder',localStorage['nickname']);
      		$("#emailfield").attr('placeholder',localStorage['mail']);
		socket.emit('socket-getlisting', {index : indexnumber});
		indexnumber++;
		socket.emit('socket-getlisting', {index : indexnumber});
	});
	socket.on('socket-sendlisting', function(data){
		var addstr = "";
		for(i=0;i<data.result.length;i++)
		{
			addstr += "<tr>";
			addstr += "<td>" + data.result[i].name + "</td>";
			addstr += "<td>" + data.result[i].area + "</td>";
			addstr += "<td>" + data.result[i].street_name + "</td>";
			addstr += "<td>" + data.result[i].city + "</td>";
			addstr += "<td>" + data.result[i].price + "</td>";
			addstr += '<td onclick="javascript:deleteobject(this)" id="' + data.result[i].id + '"><a href="#"><span style="color:#f00">Delete</span></a></td>';
			addstr += "</tr>";
		}
		$("#estatetable").append(addstr);
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
	
	function deletejquery(id)
	{
		socket.emit('socket-delete' , {id : id});
		$('#' + id).parent().hide('slow');
	}
	
	function saveprofile(name,surname,bio)
	{
		socket.emit('socket-settingschange' , {firstname : name , lastname : surname , bio: bio});
	}





        
