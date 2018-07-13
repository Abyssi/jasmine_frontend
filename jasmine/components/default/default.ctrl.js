'use strict';

angular.module('app.ctrl').controller('defaultController', ['$scope', '$timeout', 'sharedFactory', 'semaphoreService', 'socketService', function ($scope, $timeout, sharedFactory, semaphoreService, socketService) {
    const self = this;

    self.mapDamagedSemaphoreLayer = null;

    self.damagedSemaphoreList = [];
    self.counter = 0;

    self.damagedSemaphoreSubscription = null;

    self.startDamagedSemaphore = function () {
        semaphoreService.damagedList(0, 100, function (response) {
            if (response.data.content !== null)
                self.damagedSemaphoreList = response.data.content;
            self.updateDamagedSemaphoreLayer();
        });

        if (self.damagedSemaphoreSubscription != null)
            socketService.unsubscribe(self.damagedSemaphoreSubscription);

        socketService.listenDamagedSemaphore(function (message) {
            self.damagedSemaphoreList.push(message);
            $scope.$apply();
            self.updateDamagedSemaphoreLayer();
        }, function (subscription) {
            self.damagedSemaphoreSubscription = subscription;
        });
    };

    self.updateDamagedSemaphoreLayer = function () {
        self.mapDamagedSemaphoreLayer.clearLayers();
        angular.forEach(self.damagedSemaphoreList, function (semaphore) {
            self.addDamagedSemaphore(semaphore);
        });
    };

    self.addDamagedSemaphore = function (semaphore) {
        const target = [semaphore.location.latitude, semaphore.location.longitude];

        let marker = L.marker(target, {
            icon: L.icon({
                iconUrl: 'assets/img/jasmine_icon_warning.svg',
                iconSize: [30, 30]
            }),
            opacity: 0.9,
            zIndexOffset: 2
        });
        marker.addTo(self.mapDamagedSemaphoreLayer);

        marker.on("click", function () {
            window.location = "#/crossroads/details/" + semaphore.crossroads.id + "/" + semaphore.semaphoreId
        });
    };

    self.init = function () {
        self.mapDamagedSemaphoreLayer = new L.FeatureGroup();

        sharedFactory.map.addLayer(self.mapDamagedSemaphoreLayer);

        $timeout(function () {
            self.startDamagedSemaphore();
        }, 1000);
    }();

    $scope.$on("$destroy", function () {
        sharedFactory.map.removeLayer(self.mapDamagedSemaphoreLayer);
    });

}]);