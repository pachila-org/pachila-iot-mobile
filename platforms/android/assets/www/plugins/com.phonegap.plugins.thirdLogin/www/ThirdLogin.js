cordova.define("com.phonegap.plugins.thirdLogin.ThirdLogin", function(require, exports, module) {

var exec = require('cordova/exec')

var ThirdLogin = {};

ThirdLogin.qqLogin = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, 'ThirdLogin', 'qqLogin', []);
};
ThirdLogin.wxLogin = function(successCallback, errorCallback) {
	exec(successCallback, errorCallback, 'ThirdLogin', 'wxLogin', []);
};
ThirdLogin.jdLogin = function(successCallback, errorCallback) {
	exec(successCallback, errorCallback, 'ThirdLogin', 'jdLogin', []);
};
ThirdLogin.wbLogin = function(successCallback, errorCallback) {
	exec(successCallback, errorCallback, 'ThirdLogin', 'wbLogin', []);
};

module.exports = ThirdLogin;

});
