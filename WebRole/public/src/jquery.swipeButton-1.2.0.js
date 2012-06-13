/*! jquery.swipeButton.js - v1.2.0 - 2012-05-31
* http://andymatthews.net/code/swipebutton/
* Copyright (c) 2012 andy matthews; Licensed MIT, GPL */

(function($){

	$.fn.swipeDelete = function(o){

		o = $.extend( {}, $.fn.swipeDelete.defaults, o );

        return $('[data-swipe]', this).each(function(i, el){
			var $e = $(el);
			var $parent = $(el).parent('ul');

			$e.on(o.direction, function ( e ) {

				// reference the current item
				var $li = $(this).parent(),
				    cnt = $('.ui-btn', $li).length,
                    hasClassArrow = $li.hasClass('arrow'),
                    btnClass = (o.btnClass === 'redButton') 
                        ? o.btnClass
                        : 'redButton';

                if (hasClassArrow) {
                    $li.removeClass('arrow');
                }

				// remove all currently displayed buttons
				$('div.ui-btn > .' + btnClass).animate({ width: '0px' }, 100, 'ease-in', function(e) {
					$(this).parent().remove();
                    $li.addClass('arrow');
                    $('a', $li).data('link', $li.data('link'));
				});

				// if there's an existing button we simply delete it, then stop
				if (!cnt) {
					// create button
					var $swipeBtn = $('<a>' + o.btnLabel + '</a>').attr({'class': btnClass + ' aSwipeBtn'})
                                    .on('click', o.click); // 'click tap'
                                    
					// slide insert button into list item
					$swipeBtn.prependTo($li).wrap('<div class="ui-btn"></div>');
					$li.find('.ui-btn > .' + btnClass).animate({ width: '45px' }, 100);

                    $li.data('link', $('a[data-link]', $li).data('link'));
                    $('a[data-link]', $li).data('link', '');

					// override row click
					$($li).on('tap', function(e){
						e.stopPropagation();
						e.preventDefault();
                        return false;
					});

				}
			});
		});
	};

	$.fn.swipeDelete.defaults = {
		direction: 'swipeRight',
		btnLabel: 'Delete',
        btnClass: 'redButton',
		click: function(e){
			e.preventDefault();
			$(this).parents('li').slideUp();
		}
	};

}($));