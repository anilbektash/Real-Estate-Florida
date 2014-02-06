// JavaScript Document
jQuery(document).ready(function(){
	
	//Selec box options in advance search
	$('body .search-select').not('body.ie7 .search-select').selectbox();
	
	//this function attached focus and blur events with input elements
	var addFocusAndBlur = function($input, $val){
		
		$input.focus(function(){
			if (this.value == $val) {this.value = '';}
		});
		
		$input.blur(function(){
			if (this.value == '') {this.value = $val;}
		});
	}
	
	//face effect for images
	$("img").hover(function() {
      $(this).stop().animate({opacity: "0.6"}, 'slow');
    },
    function() {
      $(this).stop().animate({opacity: "1"}, 'slow');
    });


	// example code to attach the events
	addFocusAndBlur(jQuery('#s'),'Search....');
	addFocusAndBlur(jQuery('#subs-bar'),'E-mail address');
	
	//equal heights
	$(".table-cols li").equalHeights();
	
	// slideshow at property single page
	
	$('#slideshow').cycle({ 
	    fx:     'scrollHorz', 
	    speed:  'slow', 
	    timeout: 3000,
		easing: 'linear', 
	    pager:  '#nav',      
		pagerAnchorBuilder: function(idx, slide) { 
			return '<li><a href="#"><img src="' + slide.src + '" width="85" height="60" /></a></li>'; 
		}
  	});
	
	//thumb slider Home
	$('#thumb-slideshow').cycle({ 
	    fx:     'fade', 
	    speed:  2000,
		timeout: 1000,
		easing: 'linear',  
	    pager:  '#thumb-nav',      
		pagerAnchorBuilder: function(idx, slide) { 
			return '<li><a href="#"><img src="' + slide.src + '" width="80" height="55" /></a></li>'; 
		}
  	});
	
	// slider at home
	$('.slides').cycle({
		fx: 'scrollHorz',
		pause: 'true',
		speed: '1000',
		prev: '.next',
		next: '.prev'	
	});
	
	// side testimonials slider
	$('#testimonials-slider').cycle({
		fx: 'scrollHorz',
		pause: 'true',
		speed: '1000' 		
	});
	
	$('.accordian li p').slideUp(100);
	$('.accordian li.active p').slideDown(100);
	$('.accordian li h5').click(function(){
		if(!$(this).parent('li').hasClass('active')){
			$('.accordian li.active p').slideUp(500);
			$('.accordian li.active').removeClass('active');
			$(this).siblings('p').slideDown(500);
			$(this).parent('li').addClass('active');	
		}
	});
	
	// Quick Connect Form AJAX validation and submition
	// Validation Plugin : http://bassistance.de/jquery-plugins/jquery-plugin-validation/
	// Form Ajax Plugin : http://www.malsup.com/jquery/form/
	var contact_options = { 
       				 	target: '#message-sent',
        				beforeSubmit: function(){
												$('#contact-loader').fadeIn('fast');
												$('#message-sent').fadeOut('fast');
										}, 
       					success: function(){
											$('#contact-loader').fadeOut('fast');
											$('#message-sent').fadeIn('fast');
											$('#contact-form').resetForm();
										}
    	}; 

	$('#contact-form').validate({
		submitHandler: function(form) {
	   		$(form).ajaxSubmit(contact_options);
	   }
	});
	
	// Backgroun Switcher
	
	$('.open-btn').click(function(){

		if($('.open-btn').hasClass('closed')){
			$(this).parent('.bg-switcher').stop().animate({left:195},400);
			$(this).removeClass('closed').addClass('opened');
		} else {
			$(this).parent('.bg-switcher').stop().animate({left:0},400);
			$(this).removeClass('opened').addClass('closed');
		}
	});
	
	
	$('.bg-switcher ul li').click(function(){

		var thisBGcol = $(this).css('background-color');
		var thisBGimg = $(this).css('background-image');
		
		$('body').css('background-image', thisBGimg);
		$('body').css('background-color', thisBGcol);
		
	});
	
								
	$('#cfont').change(function(){
		var fontName = $('#cfont').val();
		if(fontName == 'droid'){
			$('#customFont').attr('href','css/droid.css');
		} else if(fontName == 'magra'){
			$('#customFont').attr('href','css/magra.css');
		} else if(fontName == 'bitter400'){
			$('#customFont').attr('href','css/bitter.css');
		} else if(fontName == 'CreteRound'){
			$('#customFont').attr('href','css/creteround.css');
		} else if(fontName == 'tenorsans400'){
			$('#customFont').attr('href','css/tenorsans.css');
		} else if(fontName == 'alfaslab'){
			$('#customFont').attr('href','css/alfaslab.css');
		} else if(fontName == 'signika'){
			$('#customFont').attr('href','css/signika.css');
		} else if(fontName == 'able'){
			$('#customFont').attr('href','css/able.css');
		} else if(fontName == 'chivo'){
			$('#customFont').attr('href','css/chivo.css');
		} else if(fontName == 'mavin'){
			$('#customFont').attr('href','css/mavin.css');
		} else if(fontName == 'museo400')
			$('#customFont').attr('href','');
		
		
	});

    // Twitter Fetcher Target Code
    twitterFetcher.fetch('353252568291504128', 'twitter_update_list', 1, true, false, true, dateFormatter, false);

});