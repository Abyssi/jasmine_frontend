'use strict';

angular.module('app.fltr').filter('round', function (numberFilter) {
    return function (value, maxDecimals) {
        return numberFilter((value || 0)
            .toFixed(maxDecimals)
            .replace(/(?:\.0+|(\.\d+?)0+)$/, "$1")
        );
    };
});