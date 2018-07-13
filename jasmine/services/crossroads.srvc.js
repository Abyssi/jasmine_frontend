'use strict';

angular.module('app.srvc').service('crossroadsService', ['$http', '$q', 'configFactory', function ($http, $q, configFactory) {
    const self = this;

    self.CROSSROADS_API_ENDPOINT = 'api/v1/crossroads/';

    // API

    self.create = function (crossroads, success, error) {
        self.httpAsync($http.put(configFactory.SERVER_URI + self.CROSSROADS_API_ENDPOINT, crossroads), success, function (response) {
            console.log("Error during create");
            if (error != null) error(response);
        });
    };

    self.get = function (id, success, error) {
        self.httpAsync($http.get(configFactory.SERVER_URI + self.CROSSROADS_API_ENDPOINT + id), success, function (response) {
            console.log("Error during get");
            if (error != null) error(response);
        });
    };

    self.update = function (id, crossroads, success, error) {
        self.httpAsync($http.post(configFactory.SERVER_URI + self.CROSSROADS_API_ENDPOINT + id, crossroads), success, function (response) {
            console.log("Error during update");
            if (error != null) error(response);
        });
    };

    self.delete = function (id, success, error) {
        self.httpAsync($http.delete(configFactory.SERVER_URI + self.CROSSROADS_API_ENDPOINT + id), success, function (response) {
            console.log("Error during delete");
            if (error != null) error(response);
        });
    };

    self.list = function (page, pageSize, success, error) {
        self.httpAsync($http.get(configFactory.SERVER_URI + self.CROSSROADS_API_ENDPOINT + "?page=" + page + (pageSize != null ? "&pageSize=" + pageSize : "")), success, function (response) {
            console.log("Error during list");
            if (error != null) error(response);
        });
    };

    self.getOutliersSmallWindow = function (success, error) {
        self.httpAsync($http.get(configFactory.SERVER_URI + self.CROSSROADS_API_ENDPOINT + "outliers/" + configFactory.small_window), success, function (response) {
            console.log("Error during outliers");
            if (error != null) error(response);
        });
    };

    self.getOutliersMediumWindow = function (success, error) {
        self.httpAsync($http.get(configFactory.SERVER_URI + self.CROSSROADS_API_ENDPOINT + "outliers/" + configFactory.medium_window), success, function (response) {
            console.log("Error during outliers");
            if (error != null) error(response);
        });
    };

    self.getOutliersLargeWindow = function (success, error) {
        self.httpAsync($http.get(configFactory.SERVER_URI + self.CROSSROADS_API_ENDPOINT + "outliers/" + configFactory.large_window), success, function (response) {
            console.log("Error during outliers");
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