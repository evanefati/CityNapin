'use strict';
angular.module('imgFallback', []).directive('actualSrc', function () {
  return {
    link: function postLink (scope, element, attrs) {
      attrs.$observe('actualSrc', function (newVal) {
        if (newVal !== undefined) {
          var img = new Image();
          img.src = attrs.actualSrc;
          angular.element(img).bind('load', function () {
            element.attr('src', attrs.actualSrc);
          });
        }
      });
    }
  }
});
