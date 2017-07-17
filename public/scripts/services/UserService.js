angular.module('nearPlaceApp')
  .factory('User', function ($q) {

    var User = Parse.User.extend({}, {

      all: function (params) {

        var defer = $q.defer();

        Parse.Cloud.run('getUsers', params, {
          success: function (users) {
              defer.resolve(users);
          },
          error: function (error) {
              defer.reject(error);
          }
        });

        return defer.promise;
      },

      create: function (data) {

        var defer = $q.defer();

        Parse.Cloud.run('createUser', data, {
          success: function(result) {
              defer.resolve(result);
          },
          error: function(error) {
              defer.reject(error);
          }

        });

        return defer.promise;

      },

      update: function (user) {

        var data = {
          'id': user.id,
          'name': user.name,
          'email': user.email,
          'username': user.email,
          'password': user.password,
          'photo': user.photo,
          'roleName': user.roleName,
        }

        var defer = $q.defer();

        Parse.Cloud.run('updateUser', data, {
          success: function(result) {
              defer.resolve(result);
          },
          error: function(error) {
              defer.reject(error);
          }
        });

        return defer.promise;
      },

      delete: function (data) {

        var defer = $q.defer();

        Parse.Cloud.run('destroyUser', data, {
          success: function (response) {
            defer.resolve(response);
          },
          error: function (error) {
            defer.reject(error);
          }
        });

        return defer.promise;
      },

      fetch: function () {
        var defer = $q.defer();

        Parse.User.current().fetch().then(function (user) {
          defer.resolve(user);
        }, function (error) {
          defer.reject(error);
        });

        return defer.promise;
      }

    });

    Object.defineProperty(User.prototype, 'name', {
      get: function() {
        return this.get('name');
      },
      set: function(val) {
        this.set('name', val);
      }
    });

    Object.defineProperty(User.prototype, 'username', {
      get: function() {
        return this.get('username');
      },
      set: function(val) {
        this.set('username', val);
      }
    });

    Object.defineProperty(User.prototype, 'email', {
      get: function() {
        return this.get('email');
      },
      set: function(val) {
        this.set('email', val);
      }
    });

    Object.defineProperty(User.prototype, 'photo', {
      get: function() {
        return this.get('photo');
      },
      set: function(val) {
        this.set('photo', val);
      }
    });

    Object.defineProperty(User.prototype, 'photoThumb', {
      get: function() {
        return this.get('photoThumb');
      },
      set: function(val) {
        this.set('photoThumb', val);
      }
    });

    Object.defineProperty(User.prototype, 'roleName', {
      get: function() {
        return this.get('roleName');
      },
      set: function(val) {
        this.set('roleName', val);
      }
    });

    return User;

  });
