'use strict';

angular.module('app.srvc').service('crossroadsLeaderboardService', ['$http', '$q', 'configFactory', function ($http, $q, configFactory) {
    const self = this;

    self.CROSSROADS_LEADERBOARD_API_ENDPOINT = 'api/v1/crossroads_leader_boards/';

    // API

    self.getSmallWindow = function (success, error) {
        self.get(configFactory.small_window, success, error);
    };

    self.getMediumWindow = function (success, error) {
        self.get(configFactory.medium_window, success, error);
    };

    self.getLargeWindow = function (success, error) {
        self.get(configFactory.large_window, success, error);
    };

    self.get = function (millis, success, error) {
        self.httpAsync($http.get(configFactory.SERVER_URI + self.CROSSROADS_LEADERBOARD_API_ENDPOINT + millis), success, function (response) {
            console.log("Error during get");
            if (error != null) error(response);
        });
    };

    // Support functions

    self.httpAsync = function (httpRequest, success, error) {
        const deferred = $q.defer();
        httpRequest.then(
            function (response) {
                if (success != null) success(response);
                deferred.resolve(response);
            },
            function (response) {
                if (error != null) error(response);
                deferred.reject(response);
            }
        );
        return deferred.promise;
    };
}]);