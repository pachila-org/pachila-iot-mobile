angular.module('starter.controllers.chats', [])


  .controller('ChatsCtrl', function ($scope, Chats) {
    console.log("Message List Ctrl...");
    Chats.all().success(
      function (r) {
        if (r.code == 100) {
          $scope.msgs = r.result;
        }
      }
    );
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {

    Chats.get($stateParams.chatId).success(function (r) {
      console.log(JSON.stringify(r));
      $scope.msg = r.result[0];
    });
  })

;


