// ------------------------------------------
// TOOLBAR
// ------------------------------------------

WebAppLoader.addModule({ name: 'toolbar', plugins: ['helper'], sharedModules: ['pageElements', 'localizationManager'], hasEvents: true }, function () {
    var toolbar         = {},
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        settings        = this.getSharedModule('settings'),
        el              = this.getSharedModule('pageElements'),
        manager         = this.getSharedModule('localizationManager'),
        helper          = this.getPlugin('helper'),
        toolbarId        = '',
        buttons         = [],
        buttonIndices   = {},
        visible         = true;
        buttonWidth     = 30,
        buttonPadding   = 5,
        buttonsCount    = 0;

    $(el.toolbar).click(function () {
        eventManager.raiseEvent('onTap');
        output.log('toolbar tapped!');
    });
    
    // Enlarge and center the title to prevet ellispsis.
    $('#jqt .toolbar > h1').width(300).css('margin', '1px 0 0 -150px');

    function create(config) {
        var buttonPrefix = config.buttonPrefix || 'toolbar_btn',
                that = this;

        toolbarId = config.toolbarId || '.toolbar';
        visible = helper.getValueAs(config.visible, 'boolean');

        $.each(config.items, function (i, val) {
            var id = helper.capitaliseFirstLetter(val.id),
                    itemsCount = config.items.length || 1;

            buttonIndices[val.id] = i;
            buttons[i] = {
                id: val.id,
                linkId: buttonPrefix + id,
                // badgeId: badgePrefix + id,
                title: val.title,
                class: val.class,
                eventHandler: 'on' + id + 'Tap',
                isDisabled: false,
                isSelected: false,
                setDisabled: function (disabled) {
                    var opacity = (disabled) ? 0.20 : 1,
                            badgeBackColor = (disabled) ? '#333' : '#f00';

                    this.isDisabled = disabled;
                    $('#' + this.linkId).css({ opacity: opacity });
                    $('#' + this.badgeId).css({ backgroundColor: badgeBackColor });

                },
                setBadgeText: function (text) {
                    var badge = $('#' + this.badgeId),
                            displayBadge = true;

                    if (text) {
                        badge.html(text);
                        badge.show();
                    } else {
                        badge.hide();
                    }
                }
            };

            $(toolbarId).append(
                $('<div>')
                    .addClass('toolbar_button ' + buttons[i].class + '_off')
                    .attr({ style: 'right: ' + (buttonsCount * buttonWidth + buttonPadding) + 'px;'})
                    .on('click', function(event){
                        var isSelected = buttons[i].isSelected,
                            classOn    = buttons[i].class + '_on',
                            classOff   = buttons[i].class + '_off';
                        
                        output.log('toolbar button tapped!');
                        
                        if (isSelected) {
                            isSelected = false;
                            $(this).removeClass(classOn);
                            $(this).addClass(classOff)
                        } else {
                            isSelected = true;
                            $(this).removeClass(classOff);
                            $(this).addClass(classOn)
                        }
                        
                        buttons[i].isSelected = isSelected;
                        eventManager.raiseEvent(buttons[i].eventHandler, isSelected);
                        event.stopPropagation();
                    })
            );

            buttonsCount += 1;

//                    $('<li>').css('width', buttonWidth + '%').append(
//                        $('<a>').attr('id', buttons[i].linkId).append(
//                            $('<small>').attr({
//                                id: buttons[i].badgeId,
//                                class: 'badge right',
//                                style: 'display: none;'
//                            })).append(
//                            $('<strong>').append(buttons[i].title)).append(
//                            $('<div>').attr('class', buttons[i].class)
//                        )));
        });
    }

//        $(toolbarId + ' ul li a').each(function (i) {
//            $(this).on('click', function () {
//                if (!buttons[i].isDisabled) {
//                    output.log(buttons[i].title + ' was tapped');
//                    eventManager.raiseEvent(buttons[i].eventHandler);
//                } else {
//                    output.log(buttons[i].title + ' is disabled');
//                }
//            });
//        });

    toolbar.create = create;
    return toolbar;
});