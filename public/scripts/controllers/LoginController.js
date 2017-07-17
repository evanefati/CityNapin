'use strict';

angular.module('nearPlaceApp').controller('LoginCtrl', function (
	$rootScope, $scope, $location, $mdToast, $mdDialog, Auth) {

  if ($rootScope.isLoggedIn()) {
  	$location.path('/places');
  }

  var showToast = function (message) {
    $mdToast.showSimple(message);
  };

  $scope.onLogin = function () {
  	
  	var username = $scope.login.username;
    var password = $scope.login.password;

    Auth.logIn(username, password)
      .then(function (user) {
	    $rootScope.currentUser = Auth.getLoggedUser();
	    $location.path('/places');
	  },
	  function(error) {
	  	showToast(error.message);
	  });
	};

});