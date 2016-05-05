angular.module('starter.controllers.button', [])


  .controller('DeviceButtonCtrl', function ($scope, $ionicPopover, $stateParams, $timeout, AppMonitor, DataUtil, Devices, Plug, App) {

    console.log("DeviceButtonCtrl");

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

    $scope.gp = DataUtil.getPath;

    var PageInit = function () {
      console.log("button");

      Devices.buttonTriggers(sn).then(
        function (r) {
          var r2;
          r2 = {
            "code": "100",
            "msg": "",
            "detail_code": "",
            "result": [{
              "id": "7",
              "engine_type": "2",
              "engine_name": "\u989c\u8272\u89e6\u53d1\u5173\u673a",
              "owner_uid": "1",
              "engine_memo": "TEST",
              "create_time": "0000-00-00 00:00:00",
              "update_time": "0000-00-00 00:00:00",
              "md_code": "COLOR_RED",
              "eigen_value": "1000",
              "actions": [{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              },{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              },{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              }]
            },{
              "id": "7",
              "engine_type": "2",
              "engine_name": "\u989c\u8272\u89e6\u53d1\u5173\u673a",
              "owner_uid": "1",
              "engine_memo": "TEST",
              "create_time": "0000-00-00 00:00:00",
              "update_time": "0000-00-00 00:00:00",
              "md_code": "COLOR_RED",
              "eigen_value": "1000",
              "actions": [{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              },{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              },{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              },{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              },{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              },{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              }]
            },{
              "id": "7",
              "engine_type": "2",
              "engine_name": "\u989c\u8272\u89e6\u53d1\u5173\u673a",
              "owner_uid": "1",
              "engine_memo": "TEST",
              "create_time": "0000-00-00 00:00:00",
              "update_time": "0000-00-00 00:00:00",
              "md_code": "COLOR_RED",
              "eigen_value": "1000",
              "actions": [{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              },{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              },{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              },{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              },{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              },{
                "id": "7",
                "engine_id": "7",
                "device_mac": "18FE34ED8823",
                "md_code": "POWER_OFF",
                "eigen_value": "",
                "sort": "0",
                "create_time": "0000-00-00 00:00:00",
                "update_time": "0000-00-00 00:00:00",
                "md_name": "\u5173\u673a",
                "device_name": "18FE34ED8823",
                "device_sn": "18FE34ED8823"
              }]
            }]
          };
          if(r.code == 200)
            r = r2;
          $scope.btnTriggers = r.result;
          console.log(JSON.stringify(r));
        },
        function (r) {
        }
      );
    };
    PageInit();

  })
;


