/* <script type="text/javascript" src="https://www.microstrategy.com/cmstemplates/microstrategy/bower_components/slick-carousel/slick/slick.min.js"></script> */
/* <script type="text/javascript"> */
jQuery(document).ready(function($) {
	$('.logo-slider').slick({
		autoplay: true,
		autoplaySpeed: 3500,
		cssEase: 'ease-out',
		slidesToShow: 6,
		slidesToScroll: 6,
		draggable: true,
		swipe: true,
		touchMove: true,
		pauseOnFocus: true,
		pauseOnHover: true,
		arrows: true,
		prevArrow: '<button type="button" class="slick-prev"></button>',
		nextArrow: '<button type="button" class="slick-next"></button>',
		responsive: [
			{
				breakpoint: 1440,
				settings: {
					slidesToShow: 6,
					slidesToScroll: 6
				}
			},
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 5,
					slidesToScroll: 5
				}
			},
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 4
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3
				}
			},
			{
				breakpoint: 400,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
			}
		]
	})

	// $('.sessions-slider').slick({
	// 	autoplay: true,
	// 	autoplaySpeed: 5000,
	// 	cssEase: 'ease-out',
	// 	slidesToShow: 2,
	// 	slidesToScroll: 1,
	// 	draggable: true,
	// 	swipe: true,
	// 	touchMove: true,
	// 	arrows: true,
	// 	infinite: true,
	// 	prevArrow: '<button type="button" class="slick-prev"></button>',
	// 	nextArrow: '<button type="button" class="slick-next"></button>',
	// 	responsive: [
	// 		{
	// 			breakpoint: 1200,
	// 			settings: {
	// 				slidesToShow: 2,
	// 			}
	// 		},
	// 		{
	// 			breakpoint: 980,
	// 			settings: {
	// 				slidesToShow: 1,
	// 			}
	// 		}
	// 	]
	// });

	// $('#speaker-slider').slick({
	// 	autoplay: true,
	// 	autoplaySpeed: 3500,
	// 	cssEase: 'ease-out',
	// 	slidesToShow: 4,
	// 	slidesToScroll: 1,
	// 	draggable: true,
	// 	swipe: true,
	// 	touchMove: true,
	// 	pauseOnFocus: true,
	// 	pauseOnHover: true,
	// 	arrows: true,
	// 	prevArrow: '<button type="button" class="slick-prev"></button>',
	// 	nextArrow: '<button type="button" class="slick-next"></button>',
	// 	responsive: [
	// 		{
	// 			breakpoint: 1200,
	// 			settings: {
	// 				slidesToShow: 4,
	// 			}
	// 		},
	// 		{
	// 			breakpoint: 980,
	// 			settings: {
	// 				slidesToShow: 3,
	// 			}
	// 		},
	// 		{
	// 			breakpoint: 768,
	// 			settings: {
	// 				slidesToShow: 1,
	// 			}
	// 		}
	// 	]
	// });
	// $('.photo-slider').slick({
	// 	autoplay: true,
	// 	autoplaySpeed: 5000,
	// 	dots: false,
	// 	arrows: false,
	// 	infinite: true,
	// 	speed: 500,
	// 	fade: true,
	// 	cssEase: 'linear',
	// });


	// $('.blog-slider').slick({
	// 	cssEase: 'ease-out',
	// 	slidesToShow: 2,
	// 	slidesToScroll: 1,
	// 	draggable: true,
	// 	swipe: true,
	// 	touchMove: true,
	// 	arrows: true,
	// 	infinite: false,
	// 	prevArrow: '<button type="button" class="slick-prev"></button>',
	// 	nextArrow: '<button type="button" class="slick-next"></button>',
	// 	responsive: [
	// 		{
	// 			breakpoint: 1200,
	// 			settings: {
	// 				slidesToShow: 2,
	// 			}
	// 		},
	// 		{
	// 			breakpoint: 980,
	// 			settings: {
	// 				slidesToShow: 2,
	// 			}
	// 		},
	// 		{
	// 			breakpoint: 768,
	// 			settings: {
	// 				slidesToShow: 1,
	// 			}
	// 		}
	// 	]
	// });
});
/* </script> */
