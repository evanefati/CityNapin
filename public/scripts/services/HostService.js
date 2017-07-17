'use strict';
 angular.module('nearPlaceApp')
 .factory('Host', function ($q) {

    var Host = Parse.Object.extend('Host', {}, {

      create: function (host) {

        var defer = $q.defer();
        var objHost = new Host();

        objHost.save(host, {
          success: function (obj) {
            defer.resolve(obj);
          }, error: function (obj, error) {
            defer.reject(error);
          }
        });

        return defer.promise;
      },

      update: function (host) {

        var defer = $q.defer();

        host.save(null, {
          success: function (obj) {
            defer.resolve(obj);
          }, error: function (obj, error) {
            defer.reject(error);
          }
        });

        return defer.promise;
      },

      destroy: function (hostId) {

        var defer = $q.defer();

        var host = new Host();
        host.id = hostId;

        host.destroy({
          success: function (obj) {
            defer.resolve(obj);
          }, error: function (obj, error) {
            defer.reject(error);
          }
        });

        return defer.promise;
      },

      count: function (params) {

        var defer = $q.defer();

        var query = new Parse.Query(this);

        if (params.filter != '') {
          query.contains('canonical', params.filter);
        }

        query.count({
          success: function (count) {
            defer.resolve(count);
          },
          error: function (error) {
            defer.reject(error);
          }
        });

        return defer.promise;

      },

      // all: function (params) {

      //   var defer = $q.defer();

      //   var query = new Parse.Query(this);

      //   if (params.filter != '') {
      //     query.contains('canonical', params.filter);
      //   }

      //   if (params.order === 'order') {
      //     query.ascending('order');
      //   } else if (params.order === '-order') {
      //     query.descending('order');
      //   } else {
      //     query.ascending('order');
      //   }

      //   query.limit(params.limit);
      //   query.skip((params.page * params.limit) - params.limit);
      //   query.find({
      //     success: function (hosts) {
      //       defer.resolve(hosts);
      //     }, error: function (error) {
      //       defer.reject(error);
      //     }
      //   });

      //   return defer.promise;

      // },

      all: function (params) {

        var defer = $q.defer();

        Parse.Cloud.run('getHosts', params, {
          success: function (users) {
              defer.resolve(users);
          },
          error: function (error) {
              defer.reject(error);
          }
        });

        return defer.promise;
      },

    });

    Object.defineProperty(Host.prototype, 'title',
    {
      get: function () {
        return this.get('title');
      },
      set: function (val) {
        this.set('title', val);
      }
    });

    Object.defineProperty(Host.prototype, 'image',
    {
      get: function () {
        return this.get('image');
      },
      set: function (val) {
        this.set('image', val);
      }
    });

    Object.defineProperty(Host.prototype, 'imageThumb',
    {
      get: function () {
        return this.get('imageThumb');
      }
    });

return Host;

});
