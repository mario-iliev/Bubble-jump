$(function() {
	var gameStarted = false;
	var inAir = false;
	var mouthOpened = false;
	var initialWidthSize = 10000 / $(window).width();
	var initialHeightSize = 10000 / $(window).height();
	var currentWidthSize = initialWidthSize;
	var currentHeightSize = initialHeightSize;
	var cake = $('.cake');
	var transitionEnd = (function(){
		var i;
		var el = document.createElement('el');
		var animations = {
			'transition'	  : 'transitionend animationend',
			'OTransition'	  : 'oTransitionEnd oAnimationEnd',
			'MozTransition'	  : 'transitionend animationend',
			'WebkitTransition': 'webkitTransitionEnd webkitAnimationEnd'
		};

		for (i in animations){
			if (el.style[i] !== undefined) {
				return animations[i];
			} else {
				return false;
			}
		}
	})();

	function changeBubbleSize(width, height, callback) {
		currentWidthSize = width;
		currentHeightSize = height;

		$('.bubble_holder').css({'width': width + '%', 'height': height + '%'});

		if (typeof callback == 'function') {
			callback();
		}
	};

	function enableBubbleJump() {
		$(document).on('keypress.jump', function(e) {
			var key = e.which || e.keyCode || e.charCode;

			if (!gameStarted) {
				gameStarted = true;

				$('.start').addClass('fade_out');

				setTimeout(function() {
					releaseCake();
				}, 1500);

				return;
			}

			if (key == 32 && !inAir) {
				inAir = true;

				$('.wrap').removeClass('bouncy').addClass('jump');

				setTimeout(function() {
					mouthOpened = true;

					setTimeout(function() {
						mouthOpened = false;
					}, 400);
				}, 50);

				$('.bubble_wrap').on(transitionEnd, function() {
					inAir = false;
					$('.wrap').removeClass('jump').addClass('bouncy');
				});
			}
		});
	};

	function releaseCake() {
		var rightDistance = 50 - (currentWidthSize / 2);
		var topPosition = $('.bubble_holder').offset().top;
		var cakeSize = $('.bubble_wrap').width() / 2.5;

		var style = {
			'margin-top': topPosition + 'px',
			'margin-right': -cakeSize,
			'top' : (currentHeightSize / 25) + '%',
			'right': rightDistance + '%',
			'width': cakeSize,
			'height': cakeSize
		};

		cake.addClass('transition').css(style).on(transitionEnd, function() {
			cake.off(transitionEnd);

			if (mouthOpened) {
				cake.removeClass('transition').addClass('eated').on(transitionEnd, function() {
					cake.off(transitionEnd).removeClass('eated').css({'right': 0 + '%'});
					changeBubbleSize((currentWidthSize * 1.10), (currentHeightSize * 1.10));

					if (currentHeightSize * 1.10 > 79) {
						$('.bubble_happy').addClass('fade_in');
					} else {
						setTimeout(function() {
							releaseCake();
						}, 1500);
					}
				});
			} else {
				cake.css({'right': 110 + '%'}).on(transitionEnd, function() {
					cake.off(transitionEnd).removeClass('transition').css({'right': 0 + '%'});

					setTimeout(function() {
						releaseCake();
					}, 1500);
				});
			}
		});
	};

	$('.wrap').addClass('fade_in');

	$('.restart').on('click', function() {
		location.reload();
	});

	enableBubbleJump();
});
