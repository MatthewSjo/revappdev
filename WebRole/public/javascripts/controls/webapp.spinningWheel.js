// ------------------------------------------
// SPINNING WHEEL SLOT
// ------------------------------------------

WebAppLoader.addModule({ name: 'spinningWheel', plugins: ['helper'], hasEvents: true }, function () {
    var spinningWheel   = {},
        slots           = [],
        slotIndices     = {},
        eventManager    = this.getEventManager(),
        helper          = this.getPlugin('helper');

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
                onDoneHandler: 'on' + id + 'Done', // TODO: Localize 'Done' and 'Cancel'
                onCancelHandler: 'on' + id + 'Cancel',
                onSlotCancel: function () {
                    SpinningWheel.close();
                    eventManager.raiseEvent(slots[i].onCancelHandler);
                },
                onSlotDone: function () {
                    var key, value, results;

                    results = SpinningWheel.getSelectedValues();
                    key = results.keys[0] || '';
                    value = results.values[0] || '';

                    slots[i].lastItemSelected = key;
                    SpinningWheel.close();
                    eventManager.raiseEvent(slots[i].onDoneHandler, key, value);
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