$(function() {
	var gameStarted = false;
	var inAir = false;
	var mouthOpened = false;
	var initialWidthSize = 10000 / $(window).width();
	var initialHeightSize = 10000 / $(window).height();
	var currentWidthSize = initialWidthSize;
	var currentHeightSize = initialHeightSize;
	var cake = $('.cake');
	var bubbleWrap = $('.bubble_wrap');
	var bubbleHolder = $('.bubble_holder');
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

		bubbleHolder.css({'width': currentWidthSize + '%', 'height': currentHeightSize + '%'});

		console.log(typeof callback);

		if (typeof callback == 'function') {
			callback();
		}
	};

	function enableBubbleJump(forceJump) {
		var key;

		function jump() {
			if (key == 32 && !inAir || forceJump) {
				inAir = true;

				$('.wrap').removeClass('bouncy').addClass('jump');

				setTimeout(function() {
					mouthOpened = true;

					setTimeout(function() {
						mouthOpened = false;
					}, 400);
				}, 50);

				bubbleWrap.on(transitionEnd, function() {
					inAir = false;

					bubbleWrap.off(transitionEnd);
					$('.wrap').removeClass('jump').addClass('bouncy');
				});

				if (!gameStarted && !forceJump) {
					gameStarted = true;

					$('.start').addClass('fade_out');

					setTimeout(function() {
						releaseCake();
					}, 1500);
				}
			}
		};

		if (forceJump) {
			jump();
		}

		$(document).on('keypress.jump', function(e) {
			key = e.which || e.keyCode || e.charCode;

			jump();
		});
	};

	function releaseCake() {
		var rightDistance = 50 - (currentWidthSize / 2);
		var topPosition = bubbleHolder.offset().top;
		var cakeSize = bubbleWrap.width() / 2.5;

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

	$('.restart').on('click', function() {
		location.reload();
	});

	changeBubbleSize(currentWidthSize, currentHeightSize, function() {
		bubbleHolder.on(transitionEnd, function() {
			$('.wrap').addClass('bouncy fade_in');
		});
	});

	enableBubbleJump(true);
});
