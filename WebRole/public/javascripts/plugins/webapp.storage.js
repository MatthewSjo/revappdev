// ------------------------------------------
// LOCAL STORAGE MANAGER
// ---------------------    ---------------------

WebAppLoader.addModule({ name: 'storage', plugins: ['helper'], hasEvents: true, isPlugin: true }, function () {
    var storage  = {},
        output              = this.getConsole(),
        eventManager        = this.getEventManager(),
        helper              = this.getPlugin('helper'),
        revolutionNamespace = 'Revolution';

    // Private
    function getNamespacedName(itemName, namespace) {
        var namespacedName = null;

        if (itemName && (typeof itemName === 'string')) {
            namespacedName = (namespace || revolutionNamespace) + helper.capitaliseFirstLetter(itemName);
        }

        return namespacedName
    }

    // Private
    function setItem(key, value) {
        localStorage.setItem(key, value);
        output.log('Storage - setItem:', key, value);
    }

    // Private
    function getItem(key) {
        return localStorage.getItem(key)
    }

    // Public
    function load(itemName, namespace) {
        var name        = getNamespacedName(itemName, namespace),
            storedItem  = getItem(name),
            value       = null;
        
        // Check if the value exists and try to retrieve it.
        if (storedItem) {
            // Check if the value is a stringified JSON object.
            if (helper.startsWith(storedItem, '{"')) {
                try {
                    value = JSON.parse(storedItem);
                } catch (e) {
                    output.log('Storage - failed to parse stored item:', key, value);
                }
            } else {
                value = storedItem;
            }
        }
        
        return value;    
    }

    // Public
    function save(itemName, itemValue, namespace) {
        var name = getNamespacedName(itemName, namespace),
            value = ''; //stringifiedValue = '';

        if (name && helper.hasValue(itemValue)) {
            value = (typeof itemValue === 'object')
                ? JSON.stringify(itemValue)
                : itemValue;
            
            setItem(name, value);
                        
        } else {
            output.log('Storage - cannot save item.', itemName, itemValue);
        }
    }

    // Public
    function remove(itemName, namespace) {
        var name = getNamespacedName(itemName, namespace);

        if (name) {
            localStorage.removeItem(name);
            output.log('Storage - removed item.', name);
        }
    }

    // Public
    function count() {
        output.log('count()', localStorage.length);
    }

    // Public
    function clearAll() {
        output.log('clearAll()');
    }

    storage.load = load;
    storage.save = save;
    storage.remove = remove;
    storage.count = count;
    storage.clearAll = clearAll;
    
    return storage;
});