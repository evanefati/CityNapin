'use strict';

 angular.module('nearPlaceApp')
 .controller('HostCtrl', function ($scope, $mdDialog, Host, Auth) {

 	// Pagination options.
 	$scope.rowOptions = [10, 20, 40];

 	$scope.query = {
 		filter: '',
 		limit: 40,
 		page: 1,
 		total: 0
 	};

 	$scope.Hosts = [];

 	// var loadHosts = function() {
  //   Auth.ensureLoggedIn().then(function () {
 	// 	  $scope.promise = Host.all($scope.query).then(function(Hosts) {
 	// 		  $scope.Hosts = Hosts;
 	// 	  });
  //   });
 	// }

 	// loadHosts();

 	 var loadHosts = function() {
      Auth.ensureLoggedIn().then(function () {
        $scope.promise = Host.all($scope.query).then(function (data) {
          $scope.hosts = data.hosts;
          $scope.query.total = data.total;
        });
      });
    }

    loadHosts();

    var loadCount = function () {
	    Auth.ensureLoggedIn().then(function () {
	      Host.count($scope.query).then(function(total) {
	   		  $scope.query.total = total;
	   	  });
	    });
	}

  	loadCount();

 	$scope.onSearch = function () {
 		$scope.query.page = 1;
 		$scope.query.total = 0;
 		loadHosts();
    loadCount();
 	};

 	$scope.onPaginationChange = function (page, limit) {
 		$scope.query.page = page;
 		$scope.query.limit = limit;
 		loadHosts();
 	};

 	$scope.openMenu = function ($mdOpenMenu, ev) {
 		$mdOpenMenu(ev);
 	};

 	$scope.onNewHost = function (ev) {

 		$mdDialog.show({
 			controller: 'DialogHostController',
 			templateUrl: '/views/partials/host.html',
 			parent: angular.element(document.body),
 			targetEvent: ev,
 			locals: {
 				host: null
 			},
 			clickOutsideToClose: true
 		})
 		.then(function(answer) {
 			loadHosts();
      loadCount();
 		});
 	}

 	$scope.onEditHost = function (ev, host) {

 		$mdDialog.show({
 			controller: 'DialogHostController',
 			templateUrl: '/views/partials/host.html',
 			parent: angular.element(document.body),
 			targetEvent: ev,
 			locals: {
 				host: angular.copy(host)
 			},
 			clickOutsideToClose: true
 		})
 		.then(function(answer) {
 			loadHosts();
 		});
 	}

 	$scope.onDestroyHost = function(ev, host) {

 		var confirm = $mdDialog.confirm()
	 		.title('Confirm action')
	 		.content('Are you sure you want to delete this host? Places of this host will be deleted.')
	 		.ok('Delete')
	 		.cancel('Cancel')
	 		.targetEvent(ev);

 		$mdDialog.show(confirm).then(function() {

 			Host.destroy(host.id).then(function(success) {
 				loadHosts();
        loadCount();
 			}, function (error) {
 				showSimpleToast(error.message);
 			});

 		});


 	}

}).controller('DialogHostController',
function($scope, $mdDialog, $mdToast, Host, File, host) {

	$scope.isCreating = false;
	$scope.isUploading = false;
  	$scope.isUploadingIcon = false;
	$scope.imageFilename = '';
  	$scope.iconFilename = '';

	if (host) {

		$scope.isCreating = false;
		$scope.imageFilename = host.image.name();

    if (host.icon) {
      $scope.iconFilename = host.icon.name();
    }

		$scope.objHost = host;

	} else {

		$scope.objHost = {};
		$scope.isCreating = true;
	}

	var showToast = function (message) {
		$mdToast.show(
			$mdToast.simple()
			.content(message)
			.action('OK')
			.hideDelay(3000)
		);
	};

	$scope.hide = function() {
		$mdDialog.cancel();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.uploadImage = function (file, invalidFile) {

		if (file) {
      $scope.imageFilename = file.name;
			$scope.isUploading = true;

			File.upload(file).then(function (savedFile) {
        $scope.objHost.image = savedFile;
        $scope.isUploading = false;
        showToast('Image uploaded');
	 		},
      function (error) {
   		  showToast(error.message);
   		  $scope.isUploading = false;
	 		});
		} else {
      if (invalidFile) {
        if (invalidFile.$error === 'maxSize') {
          showToast('Image too big. Max ' + invalidFile.$errorParam);
        }
      }
    }
	};

  $scope.uploadIcon = function (file, invalidFile) {

    if (file) {
      $scope.iconFilename = file.name;
			$scope.isUploadingIcon = true;

			File.upload(file).then(function (savedFile) {
        $scope.objHost.icon = savedFile;
        $scope.isUploadingIcon = false;
        showToast('Icon uploaded');
	 		}, function (error) {
	 		  showToast(error.message);
	 		  $scope.isUploadingIcon = false;
	 		});
    } else {
      if (invalidFile) {
        if (invalidFile.$error === 'maxSize') {
          showToast('Icon too big. Max ' + invalidFile.$errorParam);
        } else if (invalidFile.$error === 'dimensions') {
          showToast('Icon size should be 64x64');
        }
      }
    }
	};

	$scope.onSaveHost = function (isFormValid) {

		if(!isFormValid) {
			showToast('Please correct all highlighted errors and try again');
			return;

		} else if (!$scope.objHost.image) {
			showToast('Upload an image');
		} else {

      $scope.isSavingHost = true;

			Host.create($scope.objHost).then(function (host) {
				showToast('Host saved');
				$mdDialog.hide();
        $scope.isSavingHost = false;
			}, function (error) {
				showToast(error.message);
        $scope.isSavingHost = false;
			});
		}

	};

	$scope.onUpdateHost = function (isFormValid) {

		if(!isFormValid) {
			showToast('Please correct all highlighted errors and try again');
		} else if(!$scope.objHost.image) {
			showToast('Upload an image');
		} else {

      $scope.isSavingHost = true;

			Host.update($scope.objHost).then(function (host) {
				showToast('Host updated');
				$mdDialog.hide();
        $scope.isSavingHost = false;
			}, function (error) {
				showToast(error.message);
        $scope.isSavingHost = false;
			});
		}
	}

});
