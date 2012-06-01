// ------------------------------------------
// TABBAR
// ------------------------------------------

WebAppLoader.addModule({ name: 'tabbar', plugins: ['helper'], hasEvents: true }, function () {
    var tabbar          = {},
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        helper          = this.getPlugin('helper'),
        tabbarId        = '',
        buttons         = [],
        buttonIndices   = {},
        visible         = true;

    function hide() {
        // $(tabbarId).hide();
        output.log('tabbar.hide()');
        $(tabbarId).css({ opacity: 0 });
        visible = false;
    }

    function show() {
        // $(tabbarId).show();
        // $(tabbarId).css({ transition: 'visibility 1s ease-in-out' }); //show();
        $(tabbarId).css({ opacity: 1 });
        visible = true;
        output.log('tabbar.show()');
    }

    function getButton(index) {
        if (typeof index == 'string') {
            index = buttonIndices[index];
        }

        return buttons[index];
    }

    function create(config) {
        var buttonPrefix = config.buttonPrefix || 'tabbar_btn',
                badgePrefix = 'tabbar_badge',
                that = this;

        tabbarId = config.tabbarId || 'nav#tabbar';
        visible = (typeof config.visible == 'boolean')
                ? config.visible
                : true;

        $.each(config.items, function (i, val) {
            var id = helper.capitaliseFirstLetter(val.id),
                    itemsCount = config.items.length || 1,
                    buttonWidth = 100 / itemsCount;

            buttonIndices[val.id] = i;
            buttons[i] = {
                id: val.id,
                linkId: buttonPrefix + id,
                badgeId: badgePrefix + id,
                title: val.title,
                class: val.class,
                eventHandler: 'on' + id + 'Tap',
                isDisabled: false,
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

            $(tabbarId + ' ul').append(
                    $('<li>').css('width', buttonWidth + '%').append(
                        $('<a>').attr('id', buttons[i].linkId).append(
                            $('<small>').attr({
                                id: buttons[i].badgeId,
                                class: 'badge right',
                                style: 'display: none;'
                            })).append(
                            $('<strong>').append(buttons[i].title)).append(
                            $('<div>').attr('class', buttons[i].class)
                        )));
        });

        $(tabbarId + ' ul li a').each(function (i) {
            $(this).on('click', function () {
                if (visible) {
                    if (!buttons[i].isDisabled) {
                        output.log(buttons[i].title + ' was tapped');
                        eventManager.raiseEvent(buttons[i].eventHandler);
                    } else {
                        output.log(buttons[i].title + ' is disabled');
                    }
                }
            });
        });

        if (!visible) {
            // $(tabbarId).hide();
            $(tabbarId).css({ opacity: 0 });
        } else {
            // $(tabbarId).show();
            $(tabbarId).css({ opacity: 1 });
        }
    }

    tabbar.create = create;
    tabbar.hide = hide;
    tabbar.show = show;
    tabbar.buttons = buttons;
    tabbar.getButton = getButton;

    return tabbar;
});