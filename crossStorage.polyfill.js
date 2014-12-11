/**
 * If I'm going on another website, I should clean the window.name to avoid stealing data.
 *
 **/
// window.addEventListener('unload', function (e) {
//     var isNextUrlOutsideMyDomain = function(){
//         ...
//         return true;
//     }
//     if( isNextUrlOutsideMyDomain ) crossStorage.clear();
// });


/**
 * This is the main function, respecting the sessionStorage API.
 *
 **/
window.crossStorage = (function (defaultSessionStorage) {

    var publicMethods = {
        setItem: function (key, value) {
            return getValidStorage().setItem(key, value);
        },
        getItem: function (key) {
            return getValidStorage().getItem(key);
        },
        removeItem: function (key) {
            return getValidStorage().removeItem(key);
        },
        key: function (index) {
            return getValidStorage().key(key);
        },
        clear: function () {
            return getValidStorage().clear();
        }
    }

    var getValidStorage = function () {
        var testKey = 'test';
        try {
            defaultSessionStorage.setItem(testKey, '1');
            defaultSessionStorage.removeItem(testKey);

            return defaultSessionStorage;
        }
        catch (error) {
            return fallbackSessionStorage;
        }
    };

    var fallbackSessionStorage = (function () {

        var _data = {};

        var _save = function () {
            var _encode = function (obj) {
                return JSON.stringify(obj);
            };

            window.name = _encode(_data);
        };

        if (window.name) {
            var _load = (function () {
                var _decode = function (str) {
                    return JSON.parse(str);
                };

                _data = _decode(window.name);
            })();
        }

        return {
            setItem: function (key, value) {
                _data[key] = value;
                _save();
            },
            getItem: function (key) {
                return _data[key];
            },
            removeItem: function (key) {
                delete _data[key];
            },
            key: function (index) {
                return _data[index] || null;
            },
            clear: function () {
                _data = {};
                _save();
            }
        };

    })();

    return publicMethods;

})(window.sessionStorage);
