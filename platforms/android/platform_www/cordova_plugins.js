cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.phonegap.plugins.codeScan/www/CodeScan.js",
        "id": "com.phonegap.plugins.codeScan.CodeScan",
        "clobbers": [
            "cordova.plugins.CodeScan"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.espressifConnect/www/EspressifConnect.js",
        "id": "com.phonegap.plugins.espressifConnect.EspressifConnect",
        "clobbers": [
            "cordova.plugins.EspressifConnect"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.thirdLogin/www/ThirdLogin.js",
        "id": "com.phonegap.plugins.thirdLogin.ThirdLogin",
        "clobbers": [
            "window.plugins.ThirdLogin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
        "id": "cordova-plugin-camera.Camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
        "id": "cordova-plugin-camera.CameraPopoverOptions",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/Camera.js",
        "id": "cordova-plugin-camera.camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverHandle.js",
        "id": "cordova-plugin-camera.CameraPopoverHandle",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "file": "plugins/cordova-plugin-getui/www/getuiwrapper.js",
        "id": "cordova-plugin-getui.getuiwrapper",
        "clobbers": [
            "cordova.plugins.getuiwrapper"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/ionic-plugin-keyboard/www/android/keyboard.js",
        "id": "ionic-plugin-keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.phonegap.plugins.codeScan": "0.0.1",
    "com.phonegap.plugins.espressifConnect": "0.0.1",
    "com.phonegap.plugins.thirdLogin": "0.0.3",
    "cordova-plugin-camera": "1.2.0",
    "cordova-plugin-console": "1.0.2",
    "cordova-plugin-getui": "0.2.1",
    "cordova-plugin-splashscreen": "3.1.0",
    "cordova-plugin-whitelist": "1.2.0",
    "ionic-plugin-keyboard": "1.0.8"
};
// BOTTOM OF METADATA
});