angular.module('starter.controllers.device.menu', [])

  .controller("DeviceMenuCtrl", function ($scope, $state, Devices, App) {
    console.log("DeviceMenuCtrl");

    var sn = localStorage["current_sn"];

    $scope.relation = 0;

    Devices.get(sn).then(
      function (r) {
        console.log(JSON.stringify(r));

        $scope.relation = r.result.relation_type;
        App.CurrentDevice = r;

      }, function (r) {
        console.log(JSON.stringify(r));
      });

    /********* tempalte **********/

    $scope.openPopover = function ($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function () {
      $scope.popover.hide();
    };

    // 解绑
    $scope.device_unbind = function () {
      console.log("device unbind...");
      Devices.unbindowner(sn).then(function (r) {

        $state.go("tab.device", {}, {reload: true});

      });
      $scope.popover.hide();
    };

    $scope.device_ota = function () {
      console.log("device ota...");
      Devices.getOTAStatus(sn).then(function (r) {
          Devices.requestOTA(sn);
        }, function (r) {
          console.log(JSON.stringify(r));
        }
      );
      $scope.popover.hide();
    };

    $scope.device_auth = function () {
      console.log("device auth 2...");

      $scope.popover.hide();
      $state.go("tab.device-users", {sn: sn});
    };

    // modify device info
    $scope.device_info_modify = function () {
      $scope.popover.hide();
      $state.go("tab.device-info-modify", {sn: sn});
    };

    $scope.device_decommition = function () {
      Devices.decommition(sn).then(function () {
        $state.go("tab.device", {}, {reload: true});
      });
      $scope.popover.hide();
    };

    /******** end *********/
  })
;


