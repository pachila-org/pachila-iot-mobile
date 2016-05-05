angular.module("app.controllers", ["starter.controllers.account", "starter.controllers.test", "starter.controllers.chats", "starter.controllers.plug", "starter.controllers.temperature", "starter.controllers.button", "starter.controllers.device.menu"]);

angular.module('starter.controllers', [])

  .controller('DeviceCtrl', function ($scope, $state, $cordovaSplashscreen, $timeout, $ionicPopover, AppMonitor, Devices, DataUtil, App) {

    // App.checkLogin();

    console.log("DeviceCtrl...");

    $scope.isLogin = App.IsLogin;

    // 设备管理菜单
    $ionicPopover.fromTemplateUrl('templates/devices-opt.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function () {
      $scope.popover.hide();
    };

    // 解绑
    $scope.device_connect = function () {
      console.log("device_connect...");
      $state.go("tab.device-detect");
      $scope.popover.hide();
    };

    $scope.device_refresh = function () {
      BindPageData();
      $scope.popover.hide();
    };

    $scope.device_senario = function (c) {
      Devices.useSenarios(c);
      $scope.popover.hide();
    };

    $scope.device_scan = function () {

      $scope.$emit("to-parent", 'emit from devices...');

      var sn = "18FE34A107FA";
      // TESTBYLUYUANXSWQAZ
      // TEST4SICO6X2ST2POXUY
      // TEST4LIGHT222XSS12S12


      var check_barcode = function (sn) {
        Devices.barcodeCheck(sn).then(
          function (r) {
            var status = r.result.device.device_status;
            console.log("STATUS:" + status);
            switch (status) {
              case "1": //初始化
                $state.go("tab.device-detect");
                break;
              case "2": //激活
                // 重新绑定
                Devices.bindowner(sn).then(function (r) {
                  BindPageData();
                  alert("绑定成功！");
                });
                break;
              case "3": //绑定
                // 申请控制
                Devices.applyDeviceControl(sn).then(function (r) {
                  BindPageData();
                  alert("已发出控制申请！");
                });
                break;
              default :
                break;
            }
          }, function (r) {
            console.log(JSON.stringify(r));
          });
      };

      // check_barcode(sn);


      window.plugins.CodeScan.codeScan(function (r) {

        check_barcode(r.text);
        // check_barcode(r);
        console.log("sicon said:" + JSON.stringify(r));
      }, function (r) {
        console.log("sicon said:" + JSON.stringify(r));
        alert(r);
      });


      $scope.popover.hide();
    };
    /*****/

    // cool 2.
    $scope.$watch(
      function () {
        return App.DeviceList
      },
      function (newVal, oldVal) {


        if (typeof newVal !== 'undefined') {
          $scope.devices = App.DeviceList;

          Devices.senarios().then(function (r) {

            $scope.senarios = r.result; //[{"Name": "123", "Code": 234}, {"Name": "1234", "Code": 2345}];//r.result;
            console.log("senarios success.:");
          }, function (data) {
            console.log("senarios failed.: " + JSON.stringify(data));
          });

          $scope.isLogin = App.IsLogin;
        } else {
          console.log("in else...");
          $scope.devices = {};
        }
      });

    // cool 2.
    $scope.$watch(
      function () {
        return App.IsLogin
      },
      function (newVal, oldVal) {
        console.log("FFF 1:"+JSON.stringify(newVal));
        if (typeof newVal !== 'undefined') {
          $scope.isLogin = App.IsLogin;
        } else {
          console.log("FFF 2:"+JSON.stringify(newVal));
        }
      });


    var BindPageData = function () {
      Devices.devices().then(function (r) {
        App.DeviceList = r.result;
        $scope.devices = App.DeviceList;
        console.log("success.:");
      }, function (data) {
        console.log("failed.: " + JSON.stringify(data));
      });

      Devices.senarios().then(function (r) {

        $scope.senarios = r.result; //[{"Name": "123", "Code": 234}, {"Name": "1234", "Code": 2345}];//r.result;
        console.log("senarios success.:");
      }, function (data) {
        console.log("senarios failed.: " + JSON.stringify(data));
      });
    };

    $scope.getDesc = function (type) {
      var rv = "正常"
      switch (type) {
        case "1":
          rv = "正常";
          break;
        default :
          rv = "其他：" + type;
          break;
      }
      return "设备状态：" + rv;
    };

    // go to control index page with href
    $scope.getCtrlIdx = function (typeCode) {

      var rv = "device"
      switch (typeCode) {
        case "99":
          rv = "dvc-plug";
          break;
        default :
          rv = "device";
          break;
      }
      return rv;
    };

    // go to control index page with category
    $scope.go2CtrlIdx = function (idx, sn) {
      console.log(sn);
      localStorage["current_sn"] = sn;
      var ctg, sn;
      switch (idx) {
        case "FLYCO_AIRCLEANER":
          console.log("IDX:FLYCO_AIRCLEANER");
          ctg = "aircon";
          $state.go("tab.device-detail", {ctg: ctg, sn: sn});
          break;
        case "SMART_LIGHT":
          console.log("SMART_LIGHT");
          ctg = "light";
          $state.go("tab.device-light", {ctg: ctg, sn: sn});
          break;
        case "SMART_PLUG":
          console.log("SMART_PLUG");
          ctg = "plug";
          $state.go("tab.device-plug", {ctg: ctg, sn: sn});
          break;
        case "THERMOMETER":
          console.log("THERMOMETER");
          ctg = "tmpr";
          $state.go("tab.device-tmpr", {ctg: ctg, sn: sn});
          break;
        case "SMART_BUTTON":
          console.log("SMART_BUTTON");
          ctg = "button";
          $state.go("tab.device-button", {ctg: ctg, sn: sn});
          break;
        default:
          console.log("IDX:default");
          ctg = "others";
          $state.go("tab.device-detail", {ctg: ctg, sn: sn});
          break;
      }
    };

    $scope.gp = DataUtil.getPath;

    $scope.go2detect = function () {
      $state.go('tab.device-detect');
    };

    $scope.$on('to-child', function (e, d) {
      console.log("this is in to-child, but i can't see u...why?");
    });

    var PageInit = function () {
      BindPageData();
    };

    PageInit();
  })

  .controller('DeviceUsersCtrl', function ($scope, $stateParams, Devices) {
    var sn = $stateParams.sn;

    $scope.getUserType = function (userTypeId) {
      var userTypeName = "";
      switch (userTypeId) {
        case "1":
          userTypeName = "管理者";
          break;
        case "2":
          userTypeName = "所有者";
          break;
        case "3":
          userTypeName = "使用者";
          break;
        default :
          userTypeName = "其他";
          break;
      }
      return userTypeName;
    };

    $scope.remove = function (user) {
      console.log("解除使用者：" + user.person.nickname);
      Devices.unauth(sn, user.person.uid);
    };

    Devices.getDeviceUsers(sn).then(
      function (r) {
        $scope.deviceUsers = r.result;
      },
      function (r) {
      }
    );
  })
  .controller('DeviceDetailCtrl', function ($scope, $stateParams, $ionicPopover, $state, AppMonitor, Devices, App) {

    //$scope.optMode = {speed: false, light: false, onoff: true, timer: false, filter: false};

    //$scope.device = Devices.get($stateParams.deviceId);

    console.log("DeviceDetailCtrl ...");

    var ctg = $stateParams.ctg;
    var sn = $stateParams.sn;

    Devices.get(sn).then(
      function (r) {
        console.log(JSON.stringify(r));
        App.CurrentDevice = r;
        $scope.device = {name: r.result.device.device_name};
      }, function (r) {
        console.log(JSON.stringify(r));
      });

    // 设备管理菜单
    $ionicPopover.fromTemplateUrl('templates/devices/device-menu.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });


    var t = true;
    $scope.devicestatus = {
      "product_code": "FLYCO_AIRCLEANER",
      "owner_code": "admin",
      "online_status": "false",
      "POWER_STATUS": "OFF",
      "PM25": "81",
      "TEMPERATURE": "19.2",
      "HUMIDITY": "28.8",
      "RUN_MODE": "SLEEP_MODE",
      "ION_STATUS": "CLOSE",
      "LIGHT_STATUS": "LIGHT_OPEN",
      "TIMING_STATUS": "1"
    };
    $scope.device = {name: "智能家庭"};
    $scope.currentopt = "mode";
    $scope.optstuats = {};
    $scope.optstuats.switch = "POWER_OFF";
    $scope.optstuats.ionic == "OPEN_ION";

    $scope.timer = {"value": "180"};

    $scope.opt = function (optcode, isopt, value) {
      console.log(optcode);

      // show corresponding control panel.
      if (isopt == true)
        $scope.currentopt = optcode;

      switch (optcode) {
        case "switch":
          if ($scope.optstuats.switch == "POWER_OFF")
            $scope.optstuats.switch = "POWER_ON";
          else
            $scope.optstuats.switch = "POWER_OFF";

          console.log("$scope.optstuats.switch:" + $scope.optstuats.switch);

          Devices.opt(sn, $scope.optstuats.switch);
          break;
        case "ionic":
          if ($scope.optstuats.ionic == "CLOSE_ION")
            $scope.optstuats.ionic = "OPEN_ION";
          else
            $scope.optstuats.ionic = "CLOSE_ION";

          Devices.opt(sn, $scope.optstuats.ionic);
          break;
        case "SWITCH_MODE_AUTO":
        case "SWITCH_MODE_STRONG":
        case "SWITCH_MODE_SLEEP":
        case "OPEN_LIGHT":
        case "WEAK_LIGHT":
        case "CLOSE_LIGHT":
          Devices.opt(sn, optcode);
          break;
        case "SET_TIME":
          Devices.opt(sn, optcode, value);
          break;
        default :
          break;
      }

      // get status
      Devices.status(sn, "status").success(function (r) {
        $scope.devicestatus = r.result;
      });

    };

    //timer
  })

  .controller('DeviceInfoModifyCtrl', function ($scope, $state, $stateParams, $ionicHistory, Devices, App) {

    var device_name = App.OptTitle;
    var device_sn = App.CurrentDevice.result.device.device_sn;
    $scope.device = {"name": device_name};

    console.log(":::::" + JSON.stringify(App.CurrentDevice));

    $scope.device_info_modify = function () {
      Devices.modifyName(device_sn, $scope.device.name).then(function (r) {
        App.OptTitle = $scope.device.name;

        $ionicHistory.goBack();
      }, function (r) {
      });

    };
  })

  .controller('DeviceAirCleanerCtrl', function ($scope, $stateParams, Devices) {

    //$scope.optMode = {speed: false, light: false, onoff: true, timer: false, filter: false};

    //$scope.device = Devices.get($stateParams.deviceId);

    $scope.device = {name: "空气净化器"};

    var wheel = new wheelnav("wheelDiv");

    //This is the place for code snippets from the documentation -> http://wheelnavjs.softwaretailoring.net/documentation.html

    wheel.createWheel(["模式", "离子", "定时", "滤网", "灯效"]);
    wheel.navigateWheel(2);

  })

  .controller('DeviceDetectCtrl', function ($scope, $state, $timeout, Devices, App) {

    $scope.SSID = {ssid: 'pls wait ...', pwd: '12345678'};

    $scope.connectLable = "连接设备...";

    if (window.plugins != null && window.plugins.EspressifConnect != null) {
      window.plugins.EspressifConnect.getSSid(function (r) {
        $timeout(function () {
          $scope.SSID.ssid = r;
        }, 0, true);
      }, function (e) {
        alert(e);
      });
    }

    var connect2device = function () {
      window.plugins.EspressifConnect.Push2Dvc($scope.SSID.ssid, $scope.SSID.pwd, function (r) {
        console.log("get mac success");
        $timeout(function () {

          var mac = r.mac; //{"mac":"18fe34a132e6"}
          var uid = App.getUser().uid;
          alert(mac);
          if (mac != null)
            Devices.bindowner(mac.toUpperCase()).then(function (r) {
              alert("绑定成功:" + JSON.stringify(r));
              $("#loading").hide();
              $scope.connectLable = "连接设备... ..."
              $state.go("tab.device");
            }, function (r) {
              $("#loading").hide();
              $scope.connectLable = "连接设备... ..."
              alert("绑定失败:" + JSON.stringify(r));
            });
          else {
            $("#loading").hide();
            $scope.connectLable = "连接设备... ..."
            alert("设备连接失败，请重试！");
          }
        }, 3000, true);
      }, function (e) {
        $("#loading").hide();
        $scope.connectLable = "连接设备... ..."
        alert(e);
      });
    };

    $scope.connect = function () {
      console.log("SP:" + $scope.SSID.ssid + ":" + $scope.SSID.pwd);
      // show loading...

      $("#loading").show();
      $scope.connectLable = "连接中... ..."

      $timeout(function () {
        connect2device();
      }, 500, true);
    };

  })

  .controller('DevicePlugCtrl', function ($scope, $http, $stateParams, $ionicPopover, $state, Light, Devices, AppMonitor, App) {

    // $('[data-toggle="popover"]').popover();

    /*********/
    //$scope.popover = $ionicPopover.fromTemplateUrl('templates/device-mgr.html', {
    //  scope: $scope
    //});

    var ctg = $stateParams.ctg;
    var sn = $stateParams.sn;

    console.log("ctg:" + ctg + ",sn:" + sn);

    Devices.get(sn).then(
      function (r) {
        console.log(JSON.stringify(r));
        App.CurrentDevice = r;
        App.OptTitle = r.result.device.device_name;
        $scope.device = {name: App.OptTitle};
      }, function (r) {
        console.log(JSON.stringify(r));
      });

    $scope.current_sn = sn;

    // 设备管理菜单
    $ionicPopover.fromTemplateUrl('templates/devices/device-menu.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

    // 监控数据变化 - cool
    $scope.$watch(
      function () {
        return App.OptTitle
      },
      function (newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
          $scope.device = {name: App.OptTitle};
        }
      });

    $scope.player = $stateParams.playerId;

    $scope.light = {"value": 1};

    $scope.lcolor = {"value": "#ff887c"};

    function opt(r, l) {

      console.log(r);
      console.log(l);

      var cr = parseInt(r.substring(1, 3), 16);
      var cg = parseInt(r.substring(3, 5), 16);
      var cb = parseInt(r.substring(5, 7), 16);
      var cl = l;

      cr = parseInt(cr * 22222 / 255);
      cg = parseInt(cg * 22222 / 255);
      cb = parseInt(cb * 22222 / 255);
      cl = parseInt((cl - 1) * 22222 / 10);

      console.log(cr + "," + cg + "," + cb);

      var device_sn = localStorage["current_sn"]; //18FE34A109BD
      var md_code = "LIGHT_COLOR";
      var md_value = {"rgb": {"red": cr, "green": cg, "blue": cb, "white": cl}};
      Light.opt(device_sn, md_code, md_value);
    };

    var colors = [
      {name: "Green", value: '#7bd148'},
      {name: "BoldBlue", value: '#5484ed'},
      {name: "Blue", value: '#a4bdfc'},
      {name: "Turquoise", value: '#46d6db'},
      {name: "LightGreen", value: '#7ae7bf'},
      {name: "BoldGreen", value: '#51b749'},
      {name: "Yellow", value: '#fbd75b'},
      {name: "Orange", value: '#ffb878'},
      {name: "Red", value: '#ff887c'},
      {name: "BoldRed", value: '#dc2127'},
      {name: "Purple", value: '#dbadff'},
      {name: "Gray", value: '#e1e1e1'}
    ];

    $scope.selectedColor = colors[0];
    $scope.EventColors = colors;
    $scope.picker = false;

    $scope.OnChangeL = function () {
      console.log("light L value is:" + $scope.light.value);
      opt($scope.lcolor.value, $scope.light.value);
    };

    $scope.OnChange = function (r) {
      console.log(r);
      console.log("light value is:" + $scope.light.value);
      $scope.lcolor.value = r.value;
      opt($scope.lcolor.value, $scope.light.value);
    };

    $scope.device = {name: App.OptTitle};
    // $scope.light = {color: {"R": 255, "G": 255, "B": 255}};

    $scope.LightOpen = function () {
      var device_sn = localStorage["current_sn"];
      Light.opt(device_sn, "POWER_ON", {});
    };
    $scope.LightClose = function () {
      var device_sn = localStorage["current_sn"];
      Light.opt(device_sn, "POWER_OFF", {});
    };

    $scope.status = true;
    $scope.OpenClose = function () {
      $scope.status = !$scope.status;
      console.log("status:" + $scope.status);
      if ($scope.status) {
        $scope.LightOpen();
      } else {
        $scope.LightClose();
      }
    };

    $scope.power = function () {
      //var client_name =	"1723237626@qq.com";
      //var client_id =	"O7P8rt8qii460N77";
      //var client_secret =	"742Ovq6UFsC4vQp1";
      var r = 0;
      var g = 0;
      var b = 0;

      var cv = selectedColor.value.substring(1, 6);
      console.log(cv);
      console.log(cv.substring(0, 1));
      console.log(cv.substring(2, 3));
      console.log(cv.substring(4, 5));

      r = parseInt(r * 255 / 22222);
      g = parseInt(g * 255 / 22222);
      b = parseInt(b * 255 / 22222);


      $scope.light = {color: selectedColor.name};

      console.log("S:" + $scope.selectedColor.name);


      var device_sn = "5CCF7F0A1422";
      var md_code = "LIGHT_COLOR";
      var md_value = {"rgb": {"red": 5000, "green": 10000, "blue": 22222, "white": 22222}};

      Light.opt(device_sn, md_code, md_value);
    };
  })

  .controller('RegCtrl', function ($scope, $state, Account) {

    $scope.loginData = {
      username: '',
      password: ''
    };

    $scope.doReg = function () {
      Account.reg($scope.loginData.username, $scope.loginData.password).success(
        function (r) {
          //alert("注册成功:" + r);
          console.log(JSON.stringify(r));
          $state.go('tab.login');
        }
      );

    };
  })

;
