// ------------------------------------------
// LOCAL STORAGE MANAGER
// ---------------------    ---------------------

WebAppLoader.addModule({ name: 'localStorageManager', sharedModules: [], plugins: ['helper'], hasEvents: true, isShared: true }, function () {
    var localStorageManager  = {},
        output               = this.getConsole(),
        eventManager         = this.getEventManager(),
        helper               = this.getPlugin('helper'),
        revolutionNamespace  = 'Revolution';

    // Private
    function getNamespacedName(itemName, namespace) {
        var namespacedName = null;

        if (itemName && (typeof itemName === 'string')) {
            namespacedName = (namespace || revolutionNamespace) + helper.capitaliseFirstLetter(itemName);
        }

        return namespacedName;
    }

    // Private
    function setItem(key, value) {
        localStorage.setItem(key, value);
        output.log('Local Storage Manager - setItem:', key, value);
    }

    // Private
    function getItem(key) {
        return localStorage.getItem(key);
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
                    output.log('Local Storage Manager - failed to parse stored item:', key, value);
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
            output.log('Local Storage Manager - cannot save item.', itemName, itemValue);
        }
    }

    // Public
    function remove(itemName, namespace) {
        var name = getNamespacedName(itemName, namespace);

        if (name) {
            localStorage.removeItem(name);
            output.log('Local Storage Manager - removed item.', name);
        }
    }

    // Public
    function count() {
        output.log('count()', localStorage.length);
    }

    // Public
    function clearAll() {
        localStorage.clear();  
        output.log('clearAll()');
    }

    function clearUserSettings(username) {
        for (var key in localStorage) {
            if(helper.startsWith(key, username)) {
                localStorage.removeItem(key);
            }
        }
    }

    localStorageManager.load = load;
    localStorageManager.save = save;
    localStorageManager.remove = remove;
    localStorageManager.count = count;
    localStorageManager.clearAll = clearAll;
    localStorageManager.clearUserSettings = clearUserSettings;

    return localStorageManager;
});