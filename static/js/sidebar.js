$(document).ready(function(){
	$('.nav_accordion dt').click(function(event){
		$('.nav_accordion dd').not($(this).next()).slideUp();
		$('.nav_accordion dt').not(this).removeClass('active');
		
		$(this).next().slideToggle();
		$(this).toggleClass('active');
		$('.nav_accordion dt').not($(this).nextAll().filter('dt').eq(0)).removeClass('top_border');
	        $(this).nextAll().filter('dt').eq(0).toggleClass('top_border');
	});
	$('.nav_accordion dd a').click(function(event){
		$('.nav_accordion dd a').removeClass('active');
		$(this).addClass('active');
		
        });
})