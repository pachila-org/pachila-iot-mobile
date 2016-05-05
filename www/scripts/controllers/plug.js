angular.module('starter.controllers.plug', [])


  .controller('DevicePlug2Ctrl', function ($scope, $ionicPopover, $stateParams, DataUtil, Devices, Plug, App) {

    console.log("DevicePlug2Ctrl");

    var sn = $stateParams.sn;
    $scope.current_sn = sn;
    $scope.statues = false;

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
      Devices.opt(sn, "POWER_ON");

    };
    $scope.PlugClose = function () {
      console.log("plug close");
      $scope.selectedColor = "#777777";

      var sn = localStorage["current_sn"];
      Devices.opt(sn, "POWER_OFF");
    };
  })
;


