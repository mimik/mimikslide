/* 
Mimikslide - A simple UL based slideshow plugin
Version: 2.0
2011-06-09

Author: Kim Gunnarsson
E-mail:	hello@kimgunnarsson.com 
URL:	http://kimgunnarsson.com


Use default settings or use custom settings like this:

	$('.container').mimikslide({
		buttonleft: 	$('a.left'),
		buttonright: 	$('a.right'),
		randomize: 		false,
		slidespeed: 	500,
		autoslide: 		false,
		direction:		'right',
		pause: 			1000,
		keysupport:		true,
	});


*/

//==== PLEASE DONT EDIT====
(function($){
   $.fn.mimikslide = function(options) {
      options = $.extend({
		container: 		$(this),		// Define container for slider
		buttonleft: 	$('.left'),		// define the button-left
		buttonright: 	$('.right'),	// define the button-right
		randomize: 		false,			// true or false, if you want to randomize your li order
		slidespeed: 	500, 			//set the speed of the slideanimation in milliseconds
		autoslide: 		false, 			// true or false, if you want it to autoslide
		direction:		'right', 		// left or right, select slide direction if autoslide is true
		pause: 			1000,			// pause between slides in milliseconds if autoslide is true
		keysupport:		true,			// Adds support for keyboard arrows left and right	
      }, options); 

		return this.each(function () {
		var container 	=	options.container
		var buttonleft 	=	options.buttonleft
		var buttonright =	options.buttonright
		var randomize	= 	options.randomize
		var slidespeed 	= 	options.slidespeed
		var easingtype 	=	options.easingtype 
		var autoslide 	= 	options.autoslide
		var direction 	=	options.direction
		var pause 		=  	options.pause
		var keysupport	=	option.keysupport
		
		// find the ul in the container
		var slideul = container.children('ul');
		//get the with of the li
		var liwidth = slideul.children('li').width();
		//get how many li
		var howmany = slideul.children('li').length;
		//set maxslide margins for animation and ul
		var maxslide = (howmany-1)*liwidth;
		//set the ul width
		slideul.css( "width",(howmany)*liwidth+'px');
		// set current slide
		slideul.children('li:first').addClass('current')
		// dynamic height
		var pre = slideul.children('li.current').height();
		container.height(pre);
		// just numbers for back and forth
		var nr = 1; //+1
		var nr2 = 2; //+1  
		
		
		// slide to the right!
		function slideright() {
			var waterfall = slideul.children('li').slice(nr,nr2);
			var siffra = $(slideul).css("margin-left").replace("px", "");
			if (siffra == -maxslide) {
				$(buttonright).unbind('click');
				nr = 2;
				nr2 = 3;
				slideul.children('li:first').before(slideul.children('li:last'));
				$(slideul).css( "marginLeft","0" );
				$(slideul).animate({marginLeft:'-='+liwidth}, slidespeed, function() {
					slideul.children('li').removeClass('current');
					slideul.children('li').eq(1).addClass('current'); 
					siffra = 0;
					var liheight = slideul.children('li.current').height();
					container.animate({height:liheight}, slidespeed, function() {
						$(buttonright).bind('click', slideright);
					});
				});
			}
			else{
				$(buttonright).unbind('click');
				nr++; 
				nr2++;
				slideul.children('li').removeClass('current');
				waterfall.addClass('current');
				$(slideul).animate({marginLeft:'-='+liwidth}, slidespeed, function() {
					var liheight = slideul.children('li.current').height();
					container.animate({height:liheight}, slidespeed, function() {
						$(buttonright).bind('click', slideright);
					});
				});
			} 
			
		}
		 
		// slide to the left!
		function sliderleft() {
			
			var siffra = $(slideul).css("margin-left").replace("px", "");
			if (siffra == 0 ) {
				$(buttonleft).unbind('click');
				nr = howmany;
				nr2 = howmany+1;
				var waterfall = slideul.children('li').slice(nr-1,nr2-1);
				slideul.children('li:last').after(slideul.children('li:first'));
				$(slideul).css( "marginLeft",-maxslide+'px' );
				$(slideul).animate({marginLeft:'+='+liwidth}, slidespeed, function() {
					slideul.children('li').removeClass('current');
					waterfall.addClass('current');
					nr -=1; 
					nr2 -=1;  
					var liheight = slideul.children('li.current').height();
					container.animate({height:liheight}, slidespeed, function() {
						$(buttonleft).bind('click', sliderleft);
					});					
					
				});
			} 
			else{
				$(buttonleft).unbind('click');
				if (nr == 1 || nr < 1){} else {
					nr -=1; 
					nr2 -=1; 
				}			
				var waterfall = slideul.children('li').slice(nr-1,nr2-1);
				
				$(slideul).animate({marginLeft:'+='+liwidth}, slidespeed, function() {
					slideul.children('li').removeClass('current');
					waterfall.addClass('current');
					var liheight = slideul.children('li.current').height();
					container.animate({height:liheight}, slidespeed, function() {
						$(buttonleft).bind('click', sliderleft);
					});	
					
				});
			}
			return false;
		}
		
		// DOM-ready
		$(function(){
			// Bind functions to buttons
			$(buttonright).bind('click', slideright);
			$(buttonleft).bind('click', sliderleft);
			
			if (randomize == true) {
				//Randomize the list
				$(slideul).each(function(){
					var $ul = $(this);
					var $liArr = $ul.children('li');
					$liArr.sort(function(a,b){
						// make wierd math stuff here
						var temp = parseInt( Math.random()*10 );
						var isOddOrEven = temp%2;
						var isPosOrNeg = temp>4 ? 1 : -1;
						return( isOddOrEven*isPosOrNeg );
					})
					.appendTo($ul);            
				});
			}
			// if autoslide is on
			if (autoslide == true) {
				var tid;
				$(function() {
					tid = setTimeout(knapp, pause);
				});
				
				function knapp(event) {
					if (direction == "right"){
					slideright();
				} else if (direction == "left"){
					sliderleft()
				}
				tid = setTimeout(knapp, pause);
				}	
			}
			
		});	//closing DOM actions
		
		
		if (keysupport == true) {
			// Keyboard support
			$(document).keydown(function(e){
				//left
				if (e.keyCode == 37) { 
					$(buttonleft).click();
					return false;
				}
				//right
				if (e.keyCode == 39) { 
					$(buttonright).click();
					return false;
				}
			});
		}	
		
			
      });
   };
})(jQuery);