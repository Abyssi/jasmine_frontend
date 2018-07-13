'use strict';

angular.module('app.ctrl').controller('crossroadsCreateController', ['$scope', '$routeParams', 'sharedFactory', 'crossroadsService', function ($scope, $routeParams, sharedFactory, crossroadsService) {
    const self = this;

    self.doubled = false;
    self.editingIndex = -1;

    self.mapSemaphoreLayer = null;

    self.crossroads = {semaphores: []};

    self.init = function () {
        self.mapSemaphoreLayer = new L.FeatureGroup();

        sharedFactory.map.addLayer(self.mapSemaphoreLayer);
    }();

    self.updateSemaphoreLayer = function () {
        self.mapSemaphoreLayer.clearLayers();
        angular.forEach(self.crossroads.semaphores, function (semaphore) {
            self.addSemaphore(semaphore);
        });
    };

    self.save = function () {
        crossroadsService.create(self.crossroads, function (response) {
            self.updateSemaphoreLayer();
        })
    };

    self.editSemaphore = function (semaphore) {
        self.editingIndex = self.crossroads.semaphores.indexOf(semaphore);
        self.doubled = true;
        sharedFactory.setSidebarRatio(4);
    };

    self.newSemaphore = function () {
        const semaphore = {
            semaphoreId: self.crossroads.semaphores.length > 0 ? (parseInt(self.crossroads.semaphores[self.crossroads.semaphores.length - 1].semaphoreId + 1)) : 0,
            location: {latitude: "", longitude: ""}
        };
        self.crossroads.semaphores.push(semaphore);
        self.editSemaphore(semaphore);
    };

    self.deleteSemaphore = function (semaphore) {
        self.crossroads.semaphores.splice(self.crossroads.semaphores.indexOf(semaphore), 1);
    };

    self.addSemaphore = function (semaphore) {
        const target = [semaphore.location.latitude, semaphore.location.longitude];

        L.marker(target, {
            icon: L.icon({
                iconUrl: 'assets/img/jasmine_icon.svg',
                iconSize: [40, 40]
            }),
            opacity: 0.9
        }).addTo(self.mapSemaphoreLayer);
    };

    $scope.$on("$destroy", function () {
        sharedFactory.map.removeLayer(self.mapSemaphoreLayer);
        sharedFactory.setSidebarRatio(2);
    });

}]);