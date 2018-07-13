'use strict';

angular.module('app.srvc').service('semaphoreService', ['$http', '$q', 'configFactory', function ($http, $q, configFactory) {
    const self = this;

    self.SEMAPHORE_API_ENDPOINT = 'api/v1/semaphores/';

    // API

    self.create = function (semaphore, success, error) {
        self.httpAsync($http.put(configFactory.SERVER_URI + self.SEMAPHORE_API_ENDPOINT, semaphore), success, function (response) {
            console.log("Error during create");
            if (error != null) error(response);
        });
    };

    self.get = function (id, success, error) {
        self.httpAsync($http.get(configFactory.SERVER_URI + self.SEMAPHORE_API_ENDPOINT + id), success, function (response) {
            console.log("Error during get");
            if (error != null) error(response);
        });
    };

    self.update = function (id, semaphore, success, error) {
        self.httpAsync($http.post(configFactory.SERVER_URI + self.SEMAPHORE_API_ENDPOINT + id, semaphore), success, function (response) {
            console.log("Error during update");
            if (error != null) error(response);
        });
    };

    self.delete = function (id, success, error) {
        self.httpAsync($http.delete(configFactory.SERVER_URI + self.SEMAPHORE_API_ENDPOINT + id), success, function (response) {
            console.log("Error during delete");
            if (error != null) error(response);
        });
    };

    self.list = function (page, pageSize, success, error) {
        self.httpAsync($http.get(configFactory.SERVER_URI + self.SEMAPHORE_API_ENDPOINT + "?page=" + page + (pageSize != null ? "&pageSize=" + pageSize : "")), success, function (response) {
            console.log("Error during list");
            if (error != null) error(response);
        });
    };

    self.damagedList = function (page, pageSize, success, error) {
        self.httpAsync($http.get(configFactory.SERVER_URI + self.SEMAPHORE_API_ENDPOINT + "damaged/?page=" + page + (pageSize != null ? "&pageSize=" + pageSize : "")), success, function (response) {
            console.log("Error during list");
            if (error != null) error(response);
        });
    };

    self.restore = function (id, success, error) {
        self.httpAsync($http.get(configFactory.SERVER_URI + self.SEMAPHORE_API_ENDPOINT + "restore/" + id), success, function (response) {
            console.log("Error during restore");
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