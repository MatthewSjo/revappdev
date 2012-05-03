// ------------------------------------------
// SPINNING WHEEL SLOT
// ------------------------------------------

WebAppLoader.addModule({ name: 'spinningWheel', hasEvents: true }, function () {
    var spinningWheel = {},
            slots = [],
            slotIndices = {},
            eventManager = this.plugins.eventManager || {};

    function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getSlot(index) {
        if (typeof index == 'string') {
            index = slotIndices[index];
        }

        return slots[index];
    }

    function create(config) {
        $.each(config.items, function (i, val) {
            var id = capitaliseFirstLetter(val.id);

            slotIndices[val.id] = i;
            slots[i] = {
                id: val.id,
                repository: val.repository,
                lastItemSelected: '', // TODO: Get a value from the config.
                onDoneHandler: 'on' + id + 'Done',
                onCancelHandler: 'on' + id + 'Cancel',
                onSlotCancel: function () {
                    SpinningWheel.close();
                    eventManager.raiseEvent(slots[i].onCancelHandler);
                },
                onSlotDone: function () {
                    var key, results;

                    results = SpinningWheel.getSelectedValues();
                    key = results.keys[0] || '';

                    slots[i].lastItemSelected = key;
                    SpinningWheel.close();
                    eventManager.raiseEvent(slots[i].onDoneHandler, key);
                },
                show: function (defaultItem) {
                    function initSlot(slotItems) {
                        SpinningWheel.addSlot(slotItems, '', defaultItem || slots[i].lastItemSelected);
                        SpinningWheel.setCancelAction(slots[i].onSlotCancel);
                        SpinningWheel.setDoneAction(slots[i].onSlotDone);
                        SpinningWheel.open();
                    }

                    this.repository.getData(initSlot);
                }
            };
        });
    }

    spinningWheel.create = create;
    spinningWheel.getSlot = getSlot;

    return spinningWheel;
});