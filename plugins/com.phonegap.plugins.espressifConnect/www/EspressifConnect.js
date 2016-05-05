cordova.define("cordova/plugins/EspressifConnect", 
  function(require, exports, module) {
    var exec = require("cordova/exec");
    var EspressifConnect = function() {};
    EspressifConnect.prototype.Push2Dvc = function(ssid,spwd,successCallback, errorCallback) {
        if (errorCallback == null) { errorCallback = function() {}}
    
        if (typeof errorCallback != "function")  {
            console.log("EspressifConnect failure: failure parameter not a function");
            return
        }
    
        if (typeof successCallback != "function") {
            console.log("EspressifConnect failure: success callback parameter must be a function");
            return
        }
    
        exec(successCallback, errorCallback, 'EspressifConnect', 'push2dvc', [ssid,spwd]);
    };

	EspressifConnect.prototype.getSSid = function(successCallback, errorCallback) {
        if (errorCallback == null) { errorCallback = function() {}}
    
        if (typeof errorCallback != "function")  {
            console.log("EspressifConnect failure: failure parameter not a function");
            return
        }
    
        if (typeof successCallback != "function") {
            console.log("EspressifConnect failure: success callback parameter must be a function");
            return
        }
    
        exec(successCallback, errorCallback, 'EspressifConnect', 'getssid', []);
    };
	
    var EspressifConnect = new EspressifConnect();
    module.exports = EspressifConnect;

});

  
if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.EspressifConnect) {
    window.plugins.EspressifConnect = cordova.require("cordova/plugins/EspressifConnect");
}