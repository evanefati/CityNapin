angular.module('nearPlaceApp').factory('Auth', function ($q) {

  var mSessionToken = null;

  return {

    getLoggedUser: function () {
      return Parse.User.current();
    },

    setSessionToken: function (sessionToken) {
      mSessionToken = sessionToken;
    },

    ensureLoggedIn: function () {
      var defer = $q.defer();

      if (mSessionToken === null) {
        defer.reject('Session token invalid');
        return defer.promise;
      }

      if (!Parse.User.current()) {
        Parse.User.become(mSessionToken)
          .then(function (user) {
            defer.resolve(user);
          }, function (error) {
            defer.reject(error);
          });
      } else {
        defer.resolve(Parse.User.current());
      }

      return defer.promise;
    },

    recoverPassword: function (email) {

      var defer = $q.defer();

      Parse.User.requestPasswordReset(email, {
        success: function () {
          defer.resolve();
        },
        error: function (error) {
          defer.reject(error);
        }
      });

      return defer.promise;
    },

    resetPassword: function (email) {

      var defer = $q.defer();

      Parse.User.requestPasswordReset(email, {
        success: function () {
          defer.resolve();
        },
        error: function (error) {
          defer.reject(error);
        }
      });

      return defer.promise;
    },

  	logIn: function (username, password) {
  	  var defer = $q.defer();

  	  Parse.User.logIn(username, password, {
  		success: function (user) {
  		  defer.resolve(user);
  		},
  		error: function (user, error) {
  		  defer.reject(error);
  	  	}
  	  });

  	  return defer.promise;
    },

  	logOut: function () {
  	  Parse.User.logOut();
  	}
  }
});
