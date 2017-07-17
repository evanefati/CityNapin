'use strict';

angular.module('nearPlaceApp').controller('ResetPasswordCtrl',
  function($scope, $mdToast, $mdDialog, Auth) {

  $scope.isLoading = false;

  var showDialog = function (title, message, ev) {

    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.body))
        .clickOutsideToClose(true)
        .title(title)
        .content(message)
        .ariaLabel('Alert Dialog')
        .ok('Ok')
        .targetEvent(ev)
    );
  }

	$scope.onResetPassword = function (isFormValid) {

		if (isFormValid) {

      $scope.isLoading = true;
      Auth.resetPassword($scope.email).then(function (success) {
        $scope.isLoading = false;
        showDialog('Success', 'Check your email to reset your password');
      }, function (error) {
        $scope.isLoading = false;
        showDialog('Error', error.message);
      })
		}
	}

});
