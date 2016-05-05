angular.module('starter.controllers.temperature', [])


  .controller('DeviceTmprCtrl', function ($scope, $ionicPopover, $stateParams, $timeout, AppMonitor, DataUtil, Devices, Plug, App) {

    console.log("DeviceTmprCtrl");

    var sn = $stateParams.sn;
    $scope.current_sn = sn;

    Devices.get(sn).then(
      function (r) {
        console.log(JSON.stringify(r));
        App.CurrentDevice = r;
        $scope.device = {name: r.result.device.device_name};
      }, function (r) {
        console.log(JSON.stringify(r));
      });

    // device menu
    $ionicPopover.fromTemplateUrl('templates/devices/device-menu.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

    $scope.PlugOpen = function () {
      console.log("plug open");
      $scope.selectedColor = "#00FF00";

      var sn = localStorage["current_sn"];
      Plug.open(sn).then(function () {

      }, function () {
      });
    };
    $scope.PlugClose = function () {
      console.log("plug close");
      $scope.selectedColor = "#777777";

      var sn = localStorage["current_sn"];
      Plug.close(sn).then(function () {
      }, function () {
      });
    };

    $scope.currentTmpr = App.Tmpr;
    $scope.currentHumd = App.Humd;


    $scope.setTmpr = function (t) {
      App.Tmpr = 0;
      App.Humd = 0;
    };

    $scope.startMonitor = function () {
      AppMonitor.run(sn);
    };
    $scope.stopMonitor = function () {
      AppMonitor.stop();
    };

    $scope.$watch(
      function () {
        return App.Tmpr
      },
      function (newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
          // console.log("Old one is:" + oldVal + ", NewVal:"  + newVal);
          Tmpr.SetTemp(newVal);
          $scope.currentTmpr = newVal;
        }
      });

    $scope.$watch(
      function () {
        return App.Humd
      },
      function (newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
          // console.log("Old one is:" + oldVal + ", NewVal:"  + newVal);
          // Tmpr.SetTemp(newVal);
          $scope.currentHumd = newVal;
        }
      });

    var Tmpr = {
      canvas: null,
      img: null,
      Init: function () {
        console.log("in tmpr init...");
        canvas = document.getElementById("myCanvas");
        img = new Image();
        img.onload = this.imgOnLoaded;
        img.src = 'images/temprature.png';
      },
      SetTemp: function (t) {
        var ctx = canvas.getContext('2d');


        var MarginTop = 90;
        var MarginBottom = 10;

        ctx.fillStyle = "#CCCCCC";
        ctx.fillRect(63, 90, 14, MarginBottom + 264);

        ctx.fillStyle = "#C80202";
        var tmpr = parseInt(t) + 30; //temperature
        var tmprH = tmpr * 264 / 80;
        var top = 264 - tmprH + MarginTop;
        ctx.fillRect(63, top, 14, tmprH + MarginBottom);


      },
      imgOnLoaded: function () {
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 141, 478);
      }
    };

    var PageInit = function () {
      Tmpr.Init();
      $scope.startMonitor();
    };
    PageInit();

  })
;


