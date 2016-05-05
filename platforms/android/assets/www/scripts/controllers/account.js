angular.module('starter.controllers.account', [])

  .controller('AboutCtrl', function ($scope, $state, $ionicSideMenuDelegate) {
    $scope.toggleLeft = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };
  })

  .controller('AccountCtrl', function ($scope, $state, $ionicModal, $timeout, $cordovaCamera, Account, Version, Devices, App, AppMonitor) {

    console.log('AccountCtrl ...');
    $scope.settings = {
      enableFriends: true
    };

    var sn = null;

    $scope.current_user = App.LoginUser;
    $scope.isLogin = App.IsLogin;

    console.log("App.IsLogin:" + App.IsLogin);

    console.log($scope.current_user);

    $scope.checkOTA = function () {
      Devices.getOTAStatus(sn).success(function (r) {
        if (r.code != 100) {
          Devices.requestOTA(sn);
        }
      });
    }

    $scope.checkversion = function () {

      Version.get().then(function (r) {
        console.log(JSON.stringify(r));
      }, function (r) {
      });
    }

    $scope.test = function () {

      //Account.get(1).success(function(){
      //  console.log("ok");
      //});
      //AppMonitor.stop();
      /* getui .....
       var clientId = "000";
       console.log("sicon said: before get client id");
       cordova.plugins.getuiwrapper.getClientID(function (r) {
       clientId = r;
       console.log("sicon said:: client id is:" + r);
       }, function (r) {
       console.log("sicon said:: error:" + r);
       });
       console.log("sicon said: after get client id");

       console.log("sicon said: registerPushListener");
       var cb = function (object) {
       console.log("sicon said:" + object);
       console.log("sicon said:" + JSON.stringify(object));

       }
       cordova.plugins.getuiwrapper.registerPushListener(cb)
       console.log("sicon said: registerPushListener done...");
       ........ */

      App.getToken().success(function (r) {
        App.getUserInfo(r.access_token).success(function (r2) {
          console.log(r2);
        });
      });

    }

    $scope.login = function () {
      $state.go('tab.login');
    };


    $scope.logout = function () {
      Account.logout();
      localStorage["token"] = "";
      localStorage["ISLOGIN"] = "FALSE";
      App.IsLogin = "FALSE";
    };


    $scope.$watch(
      function () {
        return App.IsLogin
      },
      function (newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
          $scope.isLogin = App.IsLogin;
        }
      });

    $scope.$watch(
      function () {
        return App.TOKEN_EMPIRED
      },
      function (newVal, oldVal) {
        if (newVal != false) {
          $scope.isLogin = "FALSE";
          App.IsLogin = "FALSE";
          localStorage["ISLOGIN"] = "FALSE";
        }
      });
  })

  .controller('LoginCtrl', function ($scope, $state, Account, App, Devices) {

    console.log("LoginCtrl...");

    $scope.loginData = App.LoginUser;


    var avatar, uid, nickname, accesstoken;

    $scope.doWXLogin = function () {
      window.plugins.ThirdLogin.wxLogin(
        function (r) {
          // alert(JSON.stringify(r));
          avatar = r.avatar;
          uid = r.uid;
          nickname = r.nickname;
          accesstoken = r.accesstoken;

          Account.loginby3rd(uid, nickname, avatar, 5).then(function (r) {
              // alert(JSON.stringify(r));

              localStorage["token"] = r.result.token;
              localStorage["ISLOGIN"] = "TRUE";

              App.setUser(r.result.user);
              App.IsLogin = "TRUE";
              App.TOKEN_EMPIRED = false;
              $state.go('tab.device', {}, {reload: true});
            },
            function (r) {
              alert(JSON.stringify(r));
            });
        },
        function (r) {
          // console.log("sicon-said:" + JSON.stringify(r));
          alert(JSON.stringify(r));
        });
    };

    $scope.doQQLogin = function () {
      window.plugins.ThirdLogin.qqLogin(
        function (r) {
          // alert(JSON.stringify(r));
          avatar = r.avatar;
          uid = r.uid;
          nickname = r.nickname;
          accesstoken = r.accesstoken;

          Account.loginby3rd(uid, nickname, avatar, 4).then(function (r) {
            localStorage["token"] = r.result.token;
            localStorage["ISLOGIN"] = "TRUE";

            App.setUser(r.result.user);
            App.IsLogin = "TRUE";
            App.TOKEN_EMPIRED = false;
            $state.go('tab.device', {}, {reload: true});
          }, function (r) {
            alert(JSON.stringify(r));
          });

        },
        function (r) {
          // console.log("sicon said:" + JSON.stringify(r));
          alert(JSON.stringify(r));
        });
    };

    $scope.doLogin = function () {
      Account.login(
        $scope.loginData.username,
        $scope.loginData.password
      ).then(function (rv) {

          if (rv.code == 100) {
            localStorage["token"] = rv.result.token;
            localStorage["ISLOGIN"] = "TRUE";

            App.setUser(rv.result.user);

            App.IsLogin = "TRUE";

            App.TOKEN_EMPIRED = false;

            $state.go('tab.device', {}, {reload: true});
          } else {
            alert(rv.msg);
          }
        }, function (r) {
          console.log("ERR:" + JSON.stringify(r));
        });

    };


  })
;
