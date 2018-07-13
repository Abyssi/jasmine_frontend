'use strict';

angular.module('app.ctrl').controller('crossroadsEditController', ['$scope', '$routeParams', 'sharedFactory', 'crossroadsService', 'semaphoreService', function ($scope, $routeParams, sharedFactory, crossroadsService, semaphoreService) {
    const self = this;

    self.doubled = false;
    self.editingIndex = -1;

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
                self.editSemaphore(self.crossroads.semaphores[$routeParams.sid]);
        });
    }();

    self.updateSemaphoreLayer = function () {
        self.mapSemaphoreLayer.clearLayers();
        angular.forEach(self.crossroads.semaphores, function (semaphore) {
            self.addSemaphore(semaphore);
        });
    };

    self.save = function () {
        crossroadsService.update(self.crossroads.id, self.crossroads, function (response) {
            self.updateSemaphoreLayer();
        })
    };

    self.editSemaphore = function (semaphore) {
        self.editingIndex = self.crossroads.semaphores.indexOf(semaphore);
        self.doubled = true;
        sharedFactory.setSidebarRatio(4);
        self.updateSemaphoreLayer();
    };

    self.newSemaphore = function () {
        const semaphore = {
            semaphoreId: parseInt(self.crossroads.semaphores[self.crossroads.semaphores.length - 1].semaphoreId) + 1,
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

        let marker = L.marker(target, {
            icon: L.icon({
                iconUrl: self.editingIndex.toString() === semaphore.semaphoreId ? 'assets/img/jasmine_icon_selected.svg' : 'assets/img/jasmine_icon.svg',
                iconSize: [30, 30]
            }),
            opacity: 0.9
        }).addTo(self.mapSemaphoreLayer);

        marker.on("click", function () {
            self.editSemaphore(semaphore);
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

    self.restore = function (semaphore) {
        semaphoreService.restore(semaphore.id);
        for (let i = 0; i < semaphore.lightBulbs.length; i++) {
            semaphore.lightBulbs[i].status = "OFF";
        }
    };

    $scope.$on("$destroy", function () {
        sharedFactory.map.removeLayer(self.mapSemaphoreLayer);
        sharedFactory.setSidebarRatio(2);
    });

}]);