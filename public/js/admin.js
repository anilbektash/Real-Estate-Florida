	function save()
	{
	comment = document.getElementById('commentfield').value;
	title = document.getElementById('titlefield').value;
	price = document.getElementById('pricefield').value;
	area = document.getElementById('areafield').value;
	bed = document.getElementById('bedfield').value;
	bath = document.getElementById('bathfield').value;
	streetn = document.getElementById('streetnumberfield').value;
	apartmentn = document.getElementById('apartmentfield').value;
	street = document.getElementById('streetfield').value;
	city = document.getElementById('cityfield').value;
	state = document.getElementById('statefield').value;
	zipcode = document.getElementById('zipcodefield').value;
	socketgonder(comment,title,price,area,bed,bath,streetn,apartmentn,street,city,state,zipcode);
	}
	function saveprofile()
	{
	pname = document.getElementById('namefield').value;
	psurname = document.getElementById('surnamefield').value;
	pbio = document.getElementById('biofield').value;
	saveprofilesocket(pname,psurname,pbio);
	}

	//socket-selectsingle id

	var cnt = "Empty";
	var cntprofilephoto = "";
	function newestatephoto()
	{
		var filesSelected = document.getElementById('estatephoto').files;
		if (filesSelected.length > 0)
		{
			var fileToLoad = filesSelected[0];
			if (fileToLoad.type.match("image.*"))
			{
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent)
				{
				var div = document.getElementById('newestatephoto');
				div.style.backgroundImage = "url(" + fileLoadedEvent.target.result + ")";
				div.style.backgroundSize = "cover";
				cnt = fileLoadedEvent.target.result;
				};
				fileReader.readAsDataURL(fileToLoad);
			}
		}
	} 
	function newphoto()
	{
		var filesSelected = document.getElementById('newprofilephoto').files;
		if (filesSelected.length > 0)
		{
			var fileToLoad = filesSelected[0];
			if (fileToLoad.type.match("image.*"))
			{
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent)
				{
				var div = document.getElementById('profilephoto');
				div.style.backgroundImage = "url(" + fileLoadedEvent.target.result + ")";
				div.style.backgroundSize = "cover";
				cntprofilephoto = fileLoadedEvent.target.result;
				};
				fileReader.readAsDataURL(fileToLoad);
			}
		}
	}

	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() == $(document).height())
		{
		       	indexnumber++;
		       	socket.emit('socket-getlisting', {index : indexnumber});
		}
	});

	function deleteobject(e)
	{
		deletejquery(e.getAttribute("id"));
	}
	function checkPass()
	{
		var pass1 = document.getElementById('newpassword1');
		var pass2 = document.getElementById('newpassword2');
		var message = document.getElementById('confirmMessage');
		var goodColor = "#44dd44";
		var badColor = "#ff6666";
		if(pass1.value == pass2.value)
		{
			pass2.style.backgroundColor = goodColor;
			message.style.color = goodColor;
			message.innerHTML = "Passwords Match!"
		}
		else
		{
			pass2.style.backgroundColor = badColor;
			message.style.color = badColor;
			message.innerHTML = "Passwords Do Not Match!"
		}
	}

	function changepassword()
	{
		var pass1 = document.getElementById('newpassword1').value;
		var pass2 = document.getElementById('newpassword2').value;
		var oldpass = document.getElementById('oldpassword').value;
		if(pass1.value == pass2.value)
		{
			passwordsocket(oldpass,pass1,pass2);
		}
		else
		{
			alert("Password don't match.");
		}
	}








