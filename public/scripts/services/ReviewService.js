'use strict';
 angular.module('nearPlaceApp')
 .factory('Review', function ($q) {

    var Review = Parse.Object.extend('Review', {

      getStatus: function () {

        if (this.isInappropriate) {
          return 'Inappropriate';
        }
        return null;
      }

    }, {

      update: function (review) {

        var defer = $q.defer();

        review.save(null, {
          success: function (obj) {
            defer.resolve(obj);
          },
          error: function (obj, error) {
            defer.reject(error);
          }
        });

        return defer.promise;
      },

      count: function (params) {

        var defer = $q.defer();

        var query = new Parse.Query(this);

        if (params.status) {
          if (params.status === 'inappropriate') {
            query.equalTo('isInappropriate', true);
          }
          if (params.status === 'appropriate') {
            query.equalTo('isInappropriate', false);
          }
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

      all: function (params) {

        var defer = $q.defer();

        var query = new Parse.Query(this);

        if (params.status) {
          if (params.status === 'inappropriate') {
            query.equalTo('isInappropriate', true);
          }
          if (params.status === 'appropriate') {
            query.equalTo('isInappropriate', false);
          }
        }

        query.descending('createdAt');
        query.include(['userData', 'place']);
        query.limit(params.limit);
        query.skip((params.page * params.limit) - params.limit);
        query.find({
          success: function (reviews) {
            defer.resolve(reviews);
          },
          error: function (error) {
            defer.reject(error);
          }
        });

        return defer.promise;

      },

    });

    Object.defineProperty(Review.prototype, 'userData', {
      get: function () {
        return this.get('userData');
      }
    });

    Object.defineProperty(Review.prototype, 'place', {
      get: function () {
        return this.get('place');
      }
    });

    Object.defineProperty(Review.prototype, 'comment', {
      get: function () {
        return this.get('comment');
      }
    });

    Object.defineProperty(Review.prototype, 'rating', {
      get: function () {
        return this.get('rating');
      }
    });

    Object.defineProperty(Review.prototype, 'isInappropriate', {
      get: function () {
        return this.get('isInappropriate');
      },
      set: function (val) {
        this.set('isInappropriate', val);
      }
    });

    return Review;

});
