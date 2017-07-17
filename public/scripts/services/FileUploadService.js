'use strict';
angular.module('nearPlaceApp').factory('File', function ($q) {

  return {

    upload: function (file) {

      var defer = $q.defer();

      var parseFile = new Parse.File('image.jpg', file);
      parseFile.save({
        success: function (savedFile) {
          defer.resolve(savedFile);
        },
        error: function (error) {
          defer.reject(error);
        }
      });

       return defer.promise;
     }
   };
});
