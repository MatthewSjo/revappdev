// ------------------------------------------
// SPINNING WHEEL SLOT
// ------------------------------------------

WebAppLoader.addModule({ name: 'spinningWheel', plugins: ['helper'], sharedModules: ['localizationManager'], hasEvents: true }, function () {
    var spinningWheel   = {},
        slots           = [],
        slotIndices     = {},
        eventManager    = this.getEventManager(),
        helper          = this.getPlugin('helper'),
        lang            = this.getSharedModule('localizationManager').getLanguage() || {};

    function getSlot(index) {
        if (typeof index == 'string') {
            index = slotIndices[index];
        }

        return slots[index];
    }

    function create(config) {
        $.each(config.items, function (i, val) {
            var id = helper.capitaliseFirstLetter(val.id);

            slotIndices[val.id] = i;
            slots[i] = {
                id: val.id,
                repository: val.repository,
                lastItemSelected: '', // TODO: Get a value from the config.
                isShown: false,
                onDoneHandler: 'on' + id + 'Done',
                onCancelHandler: 'on' + id + 'Cancel',
                onSlotCancel: function () {
                    SpinningWheel.close();
                    slots[i].isShown = false;
                    eventManager.raiseEvent(slots[i].onCancelHandler);
                },
                onSlotDone: function () {
                    var key, value, results;

                    results = SpinningWheel.getSelectedValues();
                    key = results.keys[0] || '';
                    value = results.values[0] || '';

                    slots[i].lastItemSelected = key;
                    SpinningWheel.close();
                    slots[i].isShown = false;
                    eventManager.raiseEvent(slots[i].onDoneHandler, key, value);
                },
                show: function (defaultItem) {
                    function initSlot(slotItems) {
                        SpinningWheel.addSlot(slotItems, '', defaultItem || slots[i].lastItemSelected);
                        SpinningWheel.setCancelAction(slots[i].onSlotCancel);
                        SpinningWheel.setDoneAction(slots[i].onSlotDone);
                        SpinningWheel.open();
                        
                        // Add localization to spinning wheel object.
                        $('#sw-done').html(lang.spinningWheel.done);
                        $('#sw-cancel').html(lang.spinningWheel.cancel);
                    }
                    if (!slots[i].isShown) {
                        slots[i].isShown = true;
                        this.repository.getData(initSlot);
                    }
                    
                }
            };
        });
    }

    spinningWheel.create = create;
    spinningWheel.getSlot = getSlot;

    return spinningWheel;
});