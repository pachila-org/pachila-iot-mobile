cordova.define("cordova/plugins/CodeScan", 
  function(require, exports, module) {
    var exec = require("cordova/exec");
    var CodeScan = function() {};
    CodeScan.prototype.codeScan = function(successCallback, errorCallback) {
        if (errorCallback == null) { errorCallback = function() {}}
        if (typeof errorCallback != "function")  {
            console.log("CodeScan failure: failure parameter not a function");
            return
        }
        if (typeof successCallback != "function") {
            console.log("CodeScan failure: success callback parameter must be a function");
            return
        }
        exec(successCallback, errorCallback, 'CodeScan', 'codeScan', []);
    };

    var CodeScan = new CodeScan();
    module.exports = CodeScan;

});
  
if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.CodeScan) {
    window.plugins.CodeScan = cordova.require("cordova/plugins/CodeScan");
}