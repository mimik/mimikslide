/* 
Mimikslide - a simple ul li slideshow plugin for jQuery
Version: 1.0
2011-05-23

Author: Kim Gunnarsson
E-mail:	hello@kimgunnarsson.com 
URL:	http://kimgunnarsson.com

==== DESC ====

A simple container with an ul, some li, and 2 buttons is all you need to start sliding!
uses jQuery Easing 1.3 http://gsgd.co.uk/sandbox/jquery/easing/
minimal css for easy customization.


==== INSTALLATION ====

1. 	add jQuery
2. 	add the plugi
3. 	call mimikslide(); on your container like this:
	$('.container').mimikslide();

4. use default settings or use custom settings like this:

	$('.container').mimikslide({
		buttonleft: 	$('a.left'),
		buttonright: 	$('a.right'),
		randomize: 		false,
		slidespeed: 	500,
		easingtype: 	'easeInOutSine',
		autoslide: 		false,
		direction:		'right',
		pause: 			1000
	});

5. see bellow for markup and settings, basiclly just give your li a width and height

==== SETTINGS ====
This is the default settings
	buttonleft: 	$('a.left'),		// define the button-left
	buttonright: 	$('a.right'),		// define the button-right
	randomize: 		false,				// true or false, if you want to randomize your li order
	slidespeed: 	500, 				//set the speed of the slideanimation in milliseconds
	easingtype: 	'easeInOutSine', 	//select easing http://gsgd.co.uk/sandbox/jquery/easing/
	autoslide: 		false, 				// true or false, if you want it to autoslide
	direction:		'right', 			// left or right, select slide direction if autoslide is true
	pause: 			1000,				// pause between slides in milliseconds if autoslide is true


/*====	HTML MARKUP ====
	<div class="container">
		<ul>
			<li>1</li>
			<li>2</li>
			<li>3</li>
			<li>4</li>
			<li>5</li>
			<li>6</li>
			<li>7</li>
		</ul>
		<a class="right" href="#">→</a>
		<a class="left" href="#">←</a>
	</div>

	
==== CSS EXAMPLE====
	.container{
		overflow:hidden;
		width: 1000px; //same as li
		height: 250px; //same as li
	}
	
	.container ul{
		list-style: none;
	}
	.container ul li {
		float: left;
		width: 1000px;
		height: 250px; 
	}

*/


//==== PLEASE DONT EDIT====
(function($){
   $.fn.mimikslide = function(options) {
      options = $.extend({
		container: 		$(this),			// Define container for slider
		buttonleft: 	$('a.left'),		// define the button-left
		buttonright: 	$('a.right'),		// define the button-right
		randomize: 		false,				// true or false, if you want to randomize your li order
		slidespeed: 	500, 				//set the speed of the slideanimation in milliseconds
		easingtype: 	'easeInOutSine', 	//select easing http://gsgd.co.uk/sandbox/jquery/easing/
		autoslide: 		false, 				// true or false, if you want it to autoslide
		direction:		'right', 			// left or right, select slide direction if autoslide is true
		pause: 			1000,				// pause between slides in milliseconds if autoslide is true
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
		
		// slide to the right!
		function slideright() {
			var siffra = $(slideul).css("margin-left").replace("px", "");
			if (siffra == -maxslide) {
				$(buttonright).unbind('click');
				slideul.children('li:first').before(slideul.children('li:last'));
				$(slideul).css( "marginLeft","0" );
				$(slideul).animate({marginLeft:'-='+liwidth}, slidespeed, easingtype, function() {
					$(buttonright).bind('click', slideright);
				});
			}
			else{ 
				$(buttonright).unbind('click');
				$(slideul).animate({marginLeft:'-='+liwidth}, slidespeed, easingtype, function() {
					$(buttonright).bind('click', slideright);
				});
			}
			return false;
		}
		
		// slide to the left!
		function sliderleft() {
			var siffra = $(slideul).css("margin-left").replace("px", "");
			if (siffra == 0 ) {
				$(buttonleft).unbind('click');
				slideul.children('li:last').after(slideul.children('li:first'));
				$(slideul).css( "marginLeft",-maxslide+'px' );
				$(slideul).animate({marginLeft:'+='+liwidth}, slidespeed, easingtype, function() {
					$(buttonleft).bind('click', sliderleft);
				});
			}
			else{
				$(buttonleft).unbind('click');
				$(slideul).animate({marginLeft:'+='+liwidth}, slidespeed, easingtype, function() {
					$(buttonleft).bind('click', sliderleft);
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
			
      });
   };
})(jQuery);

//jQuery Easing 1.3 http://gsgd.co.uk/sandbox/jquery/easing/
jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});