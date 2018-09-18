<script type="text/javascript">

	//FORCE RESPONSIVE LAYOUT
	var meta1 = document.createElement('meta');
	meta1.httpEquiv = "X-UA-Compatible";
	meta1.content = "IE=edge";
	document.getElementsByTagName('head')[0].appendChild(meta1);
	var meta2 = document.createElement('meta');
	meta2.name = "viewport";
	meta2.content = "width=device-width, initial-scale=1";
	document.getElementsByTagName('head')[0].appendChild(meta2);


	jQuery(document).ready(function ($) {

		//ADD LOGO TO NAV DIV
		$('.top .navigation').prepend('<div class="logo-zone"><a class="logo-lockup" href="http://events.microstrategy.com/world2019"><img class="logo-img" src="https://www.microstrategy.com/Strategy/media/external-assets/events-support/world-2019/world2019-logo.svg" /></a></div>');

		//MENU OPEN AND CLOSE TOGGLE FOR MOBILE
		$('#menu').click(function () {
			$(this).toggleClass('menu-opened');
		});

		//ACCORDION TOGGLE
		$('.accordion-content').hide();
	    $('.accordion .toggle').click(function () {
	        if ($(this).parent('.accordion').hasClass('expanded')) {
	            $(this).parent('.accordion').find('.accordion-content').slideUp();
	            $(this).parent('.accordion').removeClass('expanded');
	        }
	        else {
	            //$('.accordion .accordion-content').slideUp();
				//$('.accordion .accordion-content').removeClass('expanded');
	            $(this).parent('.accordion').find('.accordion-content').slideDown();
	            $(this).parent('.accordion').addClass('expanded');
	        }
	    });

		//clear empty elements that just have spaces in them
		$('p:contains(    )').html('');

		$(function() {

			// grab the initial top offset of the navigation
			var sticky_navigation_offset_top = $('.top').offset().top;

			// our function that decides weather the navigation bar should have "fixed" css position or not.
			var sticky_navigation = function(){
				var scroll_top = $(window).scrollTop(); // our current vertical position from the top

				// if we've scrolled more than the navigation, change its position to fixed to stick to top,
				// otherwise change it back to relative
				if (scroll_top > sticky_navigation_offset_top) {
					$('.top').addClass( 'sticky' );
					$('.content').addClass( 'scrolled' );
				} else {
					$('.top').removeClass( 'sticky' );
					$('.content').removeClass( 'scrolled' );
				}
			};
			// run our function on load
			sticky_navigation();

			// and run it again every time you scroll
			$(window).scroll(function() {
				 sticky_navigation();
			});
		});//end sticky nav
	}); // end document.ready
</script>
