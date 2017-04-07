$(function() {
	var gameStarted = false;
	var inAir = false;
	var mouthOpened = false;
	var forceJump = true;
	var win = $(window);
	var windowWidth = win.width();
	var initialWidthSize = 10000 / win.width();
	var initialHeightSize = 10000 / win.height();
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

		if (typeof callback == 'function') {
			callback();
		}
	};

	function enableBubbleJump() {
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
			forceJump = false;
		}

		$(document).on('keypress.jump', function(e) {
			key = e.which || e.keyCode || e.charCode;

			jump();
		});
	};

	function releaseCake() {
		var rightDistance = bubbleHolder.offset().left;
		var topPosition = bubbleHolder.offset().top;
		var bubbleSize = bubbleWrap.width();
		var cakeSize = bubbleSize / 2.5;

		var style = {
			'z-index': 3,
			'margin-top': topPosition + 'px',
			'margin-right': -cakeSize,
			'top' : (currentHeightSize / 25) + '%',
			'right': 0,
			'width': cakeSize,
			'height': cakeSize,
			'transform': 'translate(-' + rightDistance + 'px, 0px)'
		};

		cake.addClass('transition').css(style).on(transitionEnd, function() {
			cake.off(transitionEnd);

			if (mouthOpened) {
				var translateValue = (rightDistance + (bubbleSize / 2) ) + 'px, -' + (bubbleSize / 7);
				var style = {
					'opacity': 0,
					'transform': 'translate(-' + translateValue + 'px) scale(0.01)'
				};

				cake.removeClass('transition').addClass('cake_eated').css(style).on(transitionEnd, function() {
					cake.off(transitionEnd).removeClass('cake_eated').css({'right': -cakeSize, 'transform': 'translate(0px) scale(1)', 'opacity': 1});

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
				var style = {
					'z-index': 0,
					'transform': 'translate(-' + (windowWidth + cakeSize) + 'px, 0px)'
				};

				cake.css(style).on(transitionEnd, function() {
					cake.off(transitionEnd).removeClass('transition').css({'right': -cakeSize, 'transform': 'translate(0px) scale(1)', 'opacity': 1});

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

	enableBubbleJump();
});
