// ------------------------------------------
// TOOLBAR
// ------------------------------------------

WebAppLoader.addModule({ name: 'toolbar', plugins: ['helper'], sharedModules: ['pageElements'], hasEvents: true }, function () {
    var toolbar          = {},
        output           = this.getConsole(),
        eventManager     = this.getEventManager(),
        settings         = this.getSharedModule('settings'),
        el               = this.getSharedModule('pageElements'),
        helper           = this.getPlugin('helper'),
        toolbarId        = '',
        buttons          = [],
        buttonIndices    = {},
        visible          = true,
        buttonWidth      = 30,
        buttonPadding    = 5,
        buttonsCount     = 0;

    $(el.toolbar).click(function () {
        eventManager.raiseEvent('onTap');
        output.log('toolbar tapped!');
    });
    
    // Enlarge and center the title to prevet ellispsis.
    $('#jqt .toolbar > h1').width(300).css('margin', '1px 0 0 -150px');

    function getButton(index) {
        if (typeof index == 'string') {
            index = buttonIndices[index];
        }

        return buttons[index];
    }

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
                buttonId: buttonPrefix + id,
                // linkId: buttonPrefix + id,
                // badgeId: badgePrefix + id,
                title: val.title,
                btnClass: val.btnClass,
                eventHandler: 'on' + id + 'Tap',
                isDisabled: false,
                isSelected: false,
                select: function () {
                    var button     = $('#' + buttons[i].buttonId),
                        classOn    = buttons[i].btnClass + '_on',
                        classOff   = buttons[i].btnClass + '_off';
                    
                    button.removeClass(classOff);
                    button.addClass(classOn);
                    this.isSelected = true;
                },
                deselect: function () {
                    var button     = $('#' + buttons[i].buttonId),
                        classOn    = buttons[i].btnClass + '_on',
                        classOff   = buttons[i].btnClass + '_off';
                    
                    button.removeClass(classOn);
                    button.addClass(classOff);
                    this.isSelected = false;
                }
//                setDisabled: function (disabled) {
//                    var opacity = (disabled) ? 0.20 : 1,
//                            badgeBackColor = (disabled) ? '#333' : '#f00';

//                    this.isDisabled = disabled;
//                    $('#' + this.linkId).css({ opacity: opacity });
//                    $('#' + this.badgeId).css({ backgroundColor: badgeBackColor });

//                },
//                setBadgeText: function (text) {
//                    var badge = $('#' + this.badgeId),
//                            displayBadge = true;

//                    if (text) {
//                        badge.html(text);
//                        badge.show();
//                    } else {
//                        badge.hide();
//                    }
//                }
            };

            $(toolbarId).append(
                $('<div>')
                    .addClass('toolbar_button ' + buttons[i].btnClass + '_off')
                    .attr({ 
                        id: buttons[i].buttonId,
                        style: 'right: ' + (buttonsCount * buttonWidth + buttonPadding) + 'px;'
                    })
                    .on('click', function(event){
                        var isSelected = buttons[i].isSelected,
                            classOn    = buttons[i].btnClass + '_on',
                            classOff   = buttons[i].btnClass + '_off';
                        
                        output.log('toolbar button tapped!');
                        
                        if (isSelected) {
                            isSelected = false;
                            $(this).removeClass(classOn);
                            $(this).addClass(classOff);
                        } else {
                            isSelected = true;
                            $(this).removeClass(classOff);
                            $(this).addClass(classOn);
                        }
                        
                        buttons[i].isSelected = isSelected;
                        eventManager.raiseEvent(buttons[i].eventHandler, isSelected);
                        event.stopPropagation();
                    })
            );

            buttonsCount += 1;
        });
    }

    toolbar.create = create;
    toolbar.getButton = getButton;

    return toolbar;
});