app = {};

// app server config
//app.root = "http://123.57.90.89/opencenter";
app.root = " http://120.27.4.46/iotpass";
app.domain_root = app.root + "/api.php";
app.domain = app.domain_root + "?s=";
app.deviceList = app.domain + "/devices/list";
app.deviceGet = app.domain + "/devices/{id}";

// app settings...
app.debugmode = true;
app.cache = false;
app.cacheSeconds = 60 * 60 * 4; // 4小时

angular.module('starter.appservices', [])

  .factory('App', function ($state, $http) {
    return {
      // properties
      // isLogin:true,
      DeviceList: {},
      LoginUser: {
        'username': '',
        'password': ''
      },
      CurrentDevice: {},
      OptTitle: "",
      TOKEN_EMPIRED: false,
      Tmpr: 0,
      Humd: 0,
      IsLogin: "FALSE",
      // functions
      isLogin: function () {
        return localStorage["ISLOGIN"];
      },
      checkLogin: function () {

        console.log(localStorage["ISLOGIN"]);

        if (localStorage["ISLOGIN"] == "TRUE") {
          console.log("in chck login....");
          this.IsLogin = "TRUE";
          this.LoginUser.username = this.getUser().username;
          this.LoginUser.password = "";

          console.log("in chck login....login name:" + this.LoginUser.username);
        } else {
          if (this.getUser() != null && this.getUser().username != null)
            this.LoginUser.username = this.getUser().username;
        }

        if (!localStorage["ISLOGIN"]) {
          $state.go("tab.login");
        } else if (localStorage["ISLOGIN"] != "TRUE") {
          $state.go("tab.login");
        }
      },
      getUser: function () {
        return JSON.parse(localStorage["LOGIN_USER"]);
      },
      setUser: function (userObj) {
        localStorage["LOGIN_USER"] = JSON.stringify(userObj);
      },
      getToken: function () {
        //url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx5066466debcef183&secret=8a2bd7516b75972e6190d4f8880efe3b"
        var req = {
          method: 'GET',
          url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf22eb430cdc70d17&secret=9dd14cd33e15476bf21f55d7b89acc32"
        };
        return $http(req);
      },
      //https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=oICAluJ30cjrkdF0ayJAR_j5_TtQ
      getUserInfo: function (at) {
        //url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx5066466debcef183&secret=8a2bd7516b75972e6190d4f8880efe3b"
        var req = {
          method: 'GET',
          url: "https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + at + "&openid=oICAluJ30cjrkdF0ayJAR_j5_TtQ"
        };
        return $http(req);
      },
    }
  })


  // util
  .service('DataUtil', function ($http, $q, App) {

    this.get = function (url) {
      var deffered = $q.defer();

      if (localStorage["dlist"] != null && app.cache == true) {
        deffered.resolve(JSON.parse(localStorage["dlist"]));
      }
      else {
        $http({
          method: 'GET',
          url: app.domain + url,
          headers: {
            'Authorization': 'Token ' + localStorage["token"] + ''
          }
        }).success(function (data, status, headers, config) {
          localStorage["dlist"] = JSON.stringify(data);


          if (app.debugmode == true) {
            console.log("=====================");
            console.log("URL:" + url);
            console.log("DATA:" + JSON.stringify(data));
            console.log("=====================");
          }

          if (data.code == 100) {
            deffered.resolve(data);
          } else {
            //alert(data.msg);
            if (data.detail_code == "TOKEN_EMPIRED") {
              App.TOKEN_EMPIRED = true;
            }
            deffered.resolve(data);
          }
        }).error(function (data, status, headers, config) {
          deffered.reject(data);

          if (app.debugmode == true) {
            console.log("=====================");
            console.log("URL:" + url);
            console.log("ERROR:" + JSON.stringify(data));
            console.log("=====================");
          }
        });
      }
      return deffered.promise;
    };

    this.post = function (url, data) {
      var deffered = $q.defer();

      console.log("post .... ");

      $http({
        method: 'POST',
        url: app.domain + url,
        data: data,
        headers: {
          'Authorization': 'Token ' + localStorage["token"] + ''
        }
      }).success(function (data, status, headers, config) {

        console.log("=====================");
        console.log("URL:" + url);
        console.log("DATA:" + JSON.stringify(data));
        console.log("=====================");

        if (data.code == 100) {
          deffered.resolve(data);
        } else {
          //alert(data.msg);
          if (data.detail_code == "TOKEN_EMPIRED") {
            App.TOKEN_EMPIRED = true;
          }
          deffered.resolve(data);
        }
      }).error(function (data, status, headers, config) {
        deffered.reject(data);

        console.log("=====================");
        console.log("URL:" + url);
        console.log("ERROR:" + JSON.stringify(data));
        console.log("=====================");
      });

      return deffered.promise;
    };

    this.getPath = function (path) {
      var r = app.root + path;
      return r;
    };
  })

  .service('AppMonitor', function ($state, $http, $interval, Devices, App) {

    var device = {};
    device.newmsg = {"COUNT": 0, "LIST": {}};

    var intervalId = 0;
    var times = 0;

    return {
      run: function (sn) {
        intervalId = $interval(function () {
          console.log("monitor sn is :" + sn);
          Devices.getAllStatus(sn).then(
            function (r) {

              //"TEMPERATURE":"30.1","HUMIDITY":"55.95"

              var tmp = r.result.TEMPERATURE;
              var hmd = r.result.HUMIDITY;

              tmp = (parseFloat(tmp) - 32) / 1.8;
              hmd = parseFloat(hmd);
              // 摄氏度 = (华氏度 - 32) ÷ 1.8

              App.Tmpr = tmp.toFixed(1);
              App.Humd = hmd.toFixed(1); //.toFixed(1);
            },
            function (r) {
              console.log("ERROR - 001");
            }
          );

        }, 5000);
      },
      stop: function () {
        $interval.cancel(intervalId);
      },
      // new message
      getMsg: function () {
        return device.newmsg;
      },
      setMsg: function (v) {
        device.newmsg = v;
      }
      // end
    }
  })
;
