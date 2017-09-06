angular.module('starter.controllers', [])

.controller('TextsCtrl', function($scope, Texts) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  Texts.all(function(data){
    $scope.texts = data;
  });
})

.controller('TextDetailCtrl', function($rootScope, $scope, $stateParams, Texts) {
  if ($rootScope.settings === undefined) {
    $rootScope.settings = { repeat: '1', timeout: '1' };
  }
  $scope.control = { autoPlay: false };
  $scope.repeatProcess = 1;
  var setPlaying = function(sentenceId, playing) {
    if (playing === undefined) playing = true;
    $scope.sentences.forEach(function(s) {
      s.playing = false;
    });
    $scope.sentences.forEach(function(s) {
      if (s.sentenceId == sentenceId) {
        s.playing = playing;
      }
    });
  };
  var setEnded = function(sentenceId) {
    setPlaying(sentenceId, false);
  };
  Texts.get($stateParams.textId, $stateParams.textPart, function(data){
    $scope.title = data[0].textTitle + " 第" + data[0].textPart + "部分";
    $scope.sentences = data;
  });
  $scope.play = function(sentenceId) {
    setPlaying(sentenceId);
    playRecord(sentenceId, function() {
      // play ended event
      setEnded(sentenceId);
      $scope.$apply();
      setTimeout(function() {
        if ($scope.control.autoPlay) {
          if ($rootScope.settings.repeat > $scope.repeatProcess) {
            $scope.play(sentenceId);
            $scope.repeatProcess++;
          } else {
            $scope.repeatProcess = 1;
            if ($scope.sentences.length === parseInt(sentenceId)) {
              $scope.play(1);
            } else {
              $scope.play(parseInt(sentenceId) + 1);
            }
          }
        }
        $scope.$apply();
      }, parseInt($rootScope.settings.timeout) * 1000);
    });
  };
})

.controller('AccountCtrl', function($rootScope, $scope) {
  if ($rootScope.settings === undefined) {
    $rootScope.settings = { repeat: '1', timeout: '1' };
  }
  $scope.settings = $rootScope.settings;
  $scope.settingsChanged = function() {
    $rootScope.settings = $scope.settings;
  };
});
