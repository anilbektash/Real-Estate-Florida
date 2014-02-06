function login()
      {
      alert("geldim");
      var var1 = document.getElementById('email').value;
      var var2 = document.getElementById('password').value;
      gonder(var1,var2);
      }
var socket = io.connect('http://localhost');
      function gonder(var1,var2)
      {
      socket.emit('socket-login' , {email:var1,password:var2});
      }
      socket.on('socket-validate',function(data){
      if(data.value == "true")
      {
      localStorage['isim'] = data.first_name;
      localStorage['soyisim'] = data.last_name;
      localStorage['mail'] = data.email;
      localStorage['id']=data.id;
      document.location.href = "admin";
      }
      else
      {
      alert(data.message);
      }
      });
