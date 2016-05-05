/*
 device -- url: 'http://123.57.90.89/opencenter/api.php?s=/devices/5',
 reg -- s=devices/registry {MAC:mac2, ProductCode:112, Uid=102}
 unreg -- s=devices/unregistry {MAC:mac2, ProductCode:112}
 */

angular.module('starter.services', ['starter.appservices'])

  .constant('ApiEndpoint', {
    // domain: "http://123.57.90.89/opencenter/api.php?s="
  })

  .factory('Light', function ($http) {
    var token = localStorage["token"];
    return {
      opt: function (device_sn, md_code, md_value) {
        if (!md_value)
          md_value = "";
        // http://123.57.90.89/opencenter/api.php?s=/devices/asyncommand
        var req = {
          method: 'POST',
          url: app.domain + '/devices/asyncommand',
          data: {
            "device_sn": device_sn,
            "md_code": md_code,
            "md_value": md_value
          },
          headers: {
            'Authorization': 'Token ' + localStorage["token"] + ''
          }
        }
        return $http(req);
      }
    };
  })

  .service('Plug', function ($http, DataUtil) {
    var token = localStorage["token"];
    this.open = function (sn) {
      var d = {
        "device_sn": sn
      };

      return DataUtil.post('/devices/auth', d);
    };
    this.close = function (sn) {
      var d = {
        "device_sn": sn
      };

      return DataUtil.post('/devices/auth', d);
    };
  })


  .factory('Devices', function ($http, DataUtil) {

    //var users = [ {id: 1, fullName: 'Matt'}, {id: 2, fullName: 'Bob'} ];
    //window.localForage.setItem('users', users, function(result) {
    //  console.log(result);
    //});

    var token = localStorage["token"];

    return {
      devices: function () {
        return DataUtil.get("/devices/list");
      },
      senarios: function () {
        return DataUtil.get("/engins/situations/list");
      },
      useSenarios: function (id) {
        var d = {
          "situation_id": id
        };

        return DataUtil.post('/engins/situations/excute', d);
      },
      // /engins/triggers/list/18FE34ED8823
      buttonTriggers: function (sn) {
        return DataUtil.get("/engins/triggers/list/" + sn);
      },
      get: function (sn) {
        return DataUtil.get("/devices/" + sn);
      },
      getAllStatus: function (sn) {
        // /devices/(device_sn)/status
        return DataUtil.get("/devices/" + sn + "/status");
      },
      getOTAStatus: function (sn) {
        return DataUtil.get('/devices/' + sn + '/otastatus');
      },
      requestOTA: function (sn) {
        return DataUtil.get('/devices/request_ota');
      },
      opt: function (sn, optcode, md_value) {
        if (!md_value)
          md_value = "";
        // http://123.57.90.89/opencenter/api.php?s=/devices/asyncommand
        var req = {
          method: 'POST',
          url: app.domain + '/devices/asyncommand',
          data: {
            "device_sn": sn, //"82NTESTMAC",
            "md_code": optcode, //"POWER_ONOFF",
            "md_value": md_value
          },
          headers: {
            'Authorization': 'Token ' + localStorage["token"] + ''
          }
        }
        return $http(req);
      },
      status: function (sn, code) {
        //http://123.57.90.89/opencenter/api.php?s=/devices/82NTESTMAC/status
        var req = {
          method: 'GET',
          url: app.domain + '/devices/' + sn + '/' + code + '',
          headers: {
            'Authorization': 'Token ' + localStorage["token"] + ''
          }
        }
        return $http(req);
      },
      auth: function (sn, uid, authtype) {
        var d = {
          "device_sn": sn, //"82NTESTMAC",
          "user_id": uid, //"POWER_ONOFF",
          "auth_type": authtype
        };

        return DataUtil.post('/devices/auth', d);
      },
      unauth: function (sn, uid) {
        var d = {
          "device_sn": sn,
          "uid": uid
        };

        return DataUtil.post('/deviceusers/unauth', d);
      },
      // /devices/cancellation
      decommition: function (sn) {
        var d = {
          "device_sn": sn
        };

        return DataUtil.post('/devices/cancellation', d);
      },
      modifyName: function (sn, name) {
        var d = {
          "device_sn": sn,
          "device_name": name
        };

        return DataUtil.post('/devices/name', d);
      },
      barcodeCheck: function (sn) {
        var d = {
          "barcode": sn
        };

        return DataUtil.post('/barcode/check', d);
      },

      getDeviceUsers: function (sn) {
        return DataUtil.get("/deviceusers/" + sn);
      },
      applyDeviceControl: function (sn) {
        var d = {
          "device_sn": sn
        };
        return DataUtil.post("/deviceusers/apply", d);
      },
      unbindowner: function (sn) {
        var d = {
          "device_sn": sn
        };

        return DataUtil.post('/devices/unbindowner', d);
      },
      bindowner: function (sn) {
        var d = {
          "device_sn": sn
        };

        return DataUtil.post('/devices/bindowner', d);
      }
    };
  })


  .factory('Account', function ($http, DataUtil) {
    return {
      get: function (id) {
        var req = {
          method: 'GET',
          url: app.domain + 'users/profile/' + id,
          headers: {
            'Authorization': 'Token ' + localStorage["token"] + ''
          }
        }
        return $http(req);
      },
      login: function (u, p) {

        console.log("You are trying to login....");
        var d = {
          username: u,
          password: p
        };
        return DataUtil.post('/users/login', d);
      },
      logout: function () {
        var req = {
          method: 'POST',
          url: app.domain + '/users/logout',
          headers: {
            'Authorization': 'Token ' + localStorage["token"] + ''
          }
        }
        return $http(req);
      },
      reg: function (u, p) {
        var req = {
          method: 'POST',
          url: app.domain + '/users/reg',
          data: {username: u, password: p},
          headers: {
            'Authorization': 'Token ' + localStorage["token"] + ''
          }
        }
        return $http(req);
      },
      loginby3rd: function (uid, nickname, avatar_url, login_type) {
        var d = {
          'union_id': uid,
          'nick_name': nickname,
          'login_type': login_type
        };
        return DataUtil.post('/users/loginby3rd', d);
      }
    }
  })

  .factory('Version', function ($http, DataUtil) {

    return {
      get: function () {
        return DataUtil.get("/system/version/android/SmartAppliance");
      }
    }
  })

  .factory('Chats', function ($http) {
    return {
      all: function () {
        var req = {
          method: 'GET',
          url: app.domain + '/message/list',
          headers: {
            'Authorization': 'Token ' + localStorage["token"] + ''
          }
        }
        return $http(req);
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (id) {
        var req = {
          method: 'GET',
          url: app.domain + '/message/get/' + id,
          headers: {
            'Authorization': 'Token ' + localStorage["token"] + ''
          }
        }
        return $http(req);
      }
    };
  });
