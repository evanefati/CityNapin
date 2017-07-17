'use strict';

 angular.module('nearPlaceApp')
 .controller('CategoryCtrl', function ($scope, $mdDialog, Category, Auth) {

 	// Pagination options.
 	$scope.rowOptions = [10, 20, 40];

 	$scope.query = {
 		filter: '',
 		limit: 40,
 		page: 1,
 		total: 0
 	};

 	$scope.categories = [];

 	var loadCategories = function() {
    Auth.ensureLoggedIn().then(function () {
 		  $scope.promise = Category.all($scope.query).then(function(categories) {
 			  $scope.categories = categories;
 		  });
    });
 	}

 	loadCategories();

  var loadCount = function () {
    Auth.ensureLoggedIn().then(function () {
      Category.count($scope.query).then(function(total) {
   		  $scope.query.total = total;
   	  });
    });
  }

  loadCount();

 	$scope.onSearch = function () {
 		$scope.query.page = 1;
 		$scope.query.total = 0;
 		loadCategories();
    loadCount();
 	};

 	$scope.onPaginationChange = function (page, limit) {
 		$scope.query.page = page;
 		$scope.query.limit = limit;
 		loadCategories();
 	};

 	$scope.openMenu = function ($mdOpenMenu, ev) {
 		$mdOpenMenu(ev);
 	};

 	$scope.onNewCategory = function (ev) {

 		$mdDialog.show({
 			controller: 'DialogCategoryController',
 			templateUrl: '/views/partials/category.html',
 			parent: angular.element(document.body),
 			targetEvent: ev,
 			locals: {
 				category: null
 			},
 			clickOutsideToClose: true
 		})
 		.then(function(answer) {
 			loadCategories();
      loadCount();
 		});
 	}

 	$scope.onEditCategory = function (ev, category) {

 		$mdDialog.show({
 			controller: 'DialogCategoryController',
 			templateUrl: '/views/partials/category.html',
 			parent: angular.element(document.body),
 			targetEvent: ev,
 			locals: {
 				category: angular.copy(category)
 			},
 			clickOutsideToClose: true
 		})
 		.then(function(answer) {
 			loadCategories();
 		});
 	}

 	$scope.onDestroyCategory = function(ev, category) {

 		var confirm = $mdDialog.confirm()
	 		.title('Confirm action')
	 		.content('Are you sure you want to delete this category? Places of this category will be deleted.')
	 		.ok('Delete')
	 		.cancel('Cancel')
	 		.targetEvent(ev);

 		$mdDialog.show(confirm).then(function() {

 			Category.destroy(category.id).then(function(success) {
 				loadCategories();
        loadCount();
 			}, function (error) {
 				showSimpleToast(error.message);
 			});

 		});


 	}

}).controller('DialogCategoryController',
function($scope, $mdDialog, $mdToast, Category, File, category) {

	$scope.isCreating = false;
	$scope.isUploading = false;
  $scope.isUploadingIcon = false;
	$scope.imageFilename = '';
  $scope.iconFilename = '';

	if (category) {

		$scope.isCreating = false;
		$scope.imageFilename = category.image.name();

    if (category.icon) {
      $scope.iconFilename = category.icon.name();
    }

		$scope.objCategory = category;

	} else {

		$scope.objCategory = {};
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
        $scope.objCategory.image = savedFile;
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
        $scope.objCategory.icon = savedFile;
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

	$scope.onSaveCategory = function (isFormValid) {

		if(!isFormValid) {
			showToast('Please correct all highlighted errors and try again');
			return;

		} else if (!$scope.objCategory.image) {
			showToast('Upload an image');
		} else {

      $scope.isSavingCategory = true;

			Category.create($scope.objCategory).then(function (category) {
				showToast('Category saved');
				$mdDialog.hide();
        $scope.isSavingCategory = false;
			}, function (error) {
				showToast(error.message);
        $scope.isSavingCategory = false;
			});
		}

	};

	$scope.onUpdateCategory = function (isFormValid) {

		if(!isFormValid) {
			showToast('Please correct all highlighted errors and try again');
		} else if(!$scope.objCategory.image) {
			showToast('Upload an image');
		} else {

      $scope.isSavingCategory = true;

			Category.update($scope.objCategory).then(function (category) {
				showToast('Category updated');
				$mdDialog.hide();
        $scope.isSavingCategory = false;
			}, function (error) {
				showToast(error.message);
        $scope.isSavingCategory = false;
			});
		}
	}

});
