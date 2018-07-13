'use strict';

angular.module('app.ctrl').controller('crossroadsDetailsController', ['$scope', '$routeParams', 'sharedFactory', 'crossroadsService', function ($scope, $routeParams, sharedFactory, crossroadsService) {
    const self = this;

    self.doubled = false;
    self.showingIndex = -1;

    self.mapSemaphoreLayer = null;

    self.crossroads = {id: "", semaphores: []};

    self.init = function () {
        self.mapSemaphoreLayer = new L.FeatureGroup();

        sharedFactory.map.addLayer(self.mapSemaphoreLayer);
    }();

    self.start = function () {
        crossroadsService.get($routeParams.cid, function (response) {
            self.crossroads = response.data;
            self.updateSemaphoreLayer();
            if ($routeParams.sid != null)
                self.showSemaphore(self.crossroads.semaphores[$routeParams.sid]);
        });
    }();

    self.showSemaphore = function (semaphore) {
        self.showingIndex = self.crossroads.semaphores.indexOf(semaphore);
        self.doubled = true;
        sharedFactory.setSidebarRatio(4);
        self.updateSemaphoreLayer();
    };

    self.updateSemaphoreLayer = function () {
        self.mapSemaphoreLayer.clearLayers();
        angular.forEach(self.crossroads.semaphores, function (semaphore) {
            self.addSemaphore(semaphore);
        });
    };

    self.addSemaphore = function (semaphore) {
        const target = [semaphore.location.latitude, semaphore.location.longitude];

        let marker = L.marker(target, {
            icon: L.icon({
                iconUrl: self.showingIndex.toString() === semaphore.semaphoreId ? 'assets/img/jasmine_icon_selected.svg' : 'assets/img/jasmine_icon.svg',
                iconSize: [30, 30]
            }),
            opacity: 0.9
        }).addTo(self.mapSemaphoreLayer);

        marker.on("click", function () {
            self.showSemaphore(semaphore);
            $scope.$apply();
        });
    };

    self.isDamaged = function (semaphore) {
        for (let i = 0; i < semaphore.lightBulbs.length; i++) {
            if (semaphore.lightBulbs[i].status === "DAMAGED")
                return true;
        }
        return false;
    };

    $scope.$on("$destroy", function () {
        sharedFactory.map.removeLayer(self.mapSemaphoreLayer);
        sharedFactory.setSidebarRatio(2);
    });

}]);