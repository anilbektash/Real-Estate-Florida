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
      var cnt = "Empty";
      function newestatephoto(e)
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