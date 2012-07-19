// ------------------------------------------
// DEVICE
// ---------------------    ---------------------

WebAppLoader.addModule({ name: 'device', plugins: ['helper'], isPlugin: true }, function () {
    var device          = {},
        output          = this.getConsole(),
        helper          = this.getPlugin('helper'),
        nav             = navigator;

    function isIDevice() {
        return (/iphone|ipod|ipad/gi).test(nav.platform);
    }
     
    function isIPad() {
        return (/ipad/gi).test(nav.platform);
    }
          
    function isRetina() {
        return 'devicePixelRatio' in window && window.devicePixelRatio > 1;
    }
         
    function isSafari() {
        return nav.appVersion.match(/Safari/gi);
    }
      
    function hasHomescreen() {
        return 'standalone' in nav && isIDevice;
    }
    
    function isStandalone() {
        return device.hasHomescreen && nav.standalone;
    }
    
    function OSVersion() {
        return nav.appVersion.match(/OS \d+_\d+/g);
    }
    
    function platform() {
        return nav.platform.split(' ')[0];
    }
    
    function language() {
        return nav.language.replace('-', '_');
    }
    
    function maxWidth() {
        var width = 0;

        if (isIDevice) {
            if (isIPad) {
                width = 1024;
            } else {
                /* 480 on old iPhones */
                width = 960;
            }
        }

        return width;
    }

    function minWidth() {
        return maxWidth() - 20;
    }

    function maxHeight() {
        
        var height = 0;

        if (isIDevice) {
            if (isIPad) {
                height = 768;
            } else {
                /* 320 on old iPhones */
                height = 640;
            }
        }

        return height;
    }

    function minHeight() {
        return maxHeight() - 20;
    }

    function orientation() {
        var o = Math.abs(window.orientation - 90);
    
        o = (o == 180) ? 0: o;
        
        if (o == 90) {
            return 'portrait';
        } else {
            return 'landscape';
        }
    }

    device.isIDevice     = isIDevice;
    device.isIPad        = isIPad;
    device.isRetina      = isRetina;
    device.isSafari      = isSafari;
    device.hasHomescreen = hasHomescreen;
    device.isStandalone  = isStandalone;
    device.OSVersion     = OSVersion;
    device.platform      = platform;
    device.language      = language;
    device.maxWidth      = maxWidth;
    device.minWidth      = minHeight;
    device.maxHeight     = maxHeight;
    device.minHeight     = minHeight;
    device.orientation   = orientation;

    return device;
});