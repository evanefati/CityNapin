'use strict';

 angular.module('nearPlaceApp')
 .controller('MainCtrl', function ($rootScope, $scope, $location, $mdSidenav, Auth) {

  $scope.toggle = function () {
    $mdSidenav('leftMenu').toggle();
  }

  $scope.navigateTo = function (url) {
 		$location.path(url);
    $mdSidenav('leftMenu').toggle();
 	};

 	$rootScope.currentUser = Auth.getLoggedUser();

	$rootScope.isLoggedIn = function () {
	  return $rootScope.currentUser !== null;
	};

 	$scope.logout = function () {
 	  Auth.logOut();
 	  $rootScope.currentUser = null;
    $mdSidenav('leftMenu').toggle();
 	  $location.path('/');
 	};

 });
