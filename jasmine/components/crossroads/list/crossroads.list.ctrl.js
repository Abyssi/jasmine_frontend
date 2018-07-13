'use strict';

angular.module('app.ctrl').controller('crossroadsListController', ['$scope', 'sharedFactory', 'crossroadsService', function ($scope, sharedFactory, crossroadsService) {
    const self = this;

    self.mapCrossroadsLayer = null;

    self.crossroadsList = [];

    self.updating = false;
    self.page = 0;

    self.init = function () {
        self.mapCrossroadsLayer = new L.FeatureGroup();

        sharedFactory.map.addLayer(self.mapCrossroadsLayer);
    }();

    self.start = function () {
        self.updating = true;
        crossroadsService.list(0, 20, function (response) {
            self.crossroadsList = response.data.content;
            self.updateCrossroadsLayer();
            self.page++;
            self.updating = false;
        });
    }();

    self.updateCrossroadsLayer = function () {
        self.mapCrossroadsLayer.clearLayers();
        angular.forEach(self.crossroadsList, function (crossroads) {
            self.addCrossroads(crossroads);
        });
    };

    self.addCrossroads = function (crossroads) {
        angular.forEach(crossroads.semaphores, function (semaphore) {
            const target = [semaphore.location.latitude, semaphore.location.longitude];

            let marker = L.marker(target, {
                icon: L.icon({
                    iconUrl: 'assets/img/jasmine_icon.svg',
                    iconSize: [30, 30]
                }),
                opacity: 0.9
            }).addTo(self.mapCrossroadsLayer);

            marker.on("click", function () {
                window.location = "#/crossroads/details/" + crossroads.id + "/" + semaphore.semaphoreId
            });
        });
    };

    self.loadMore = function () {
        if (!self.updating) {
            self.updating = true;
            crossroadsService.list(self.page, 20, function (response) {
                self.crossroadsList = self.crossroadsList.concat(response.data.content);
                self.updateCrossroadsLayer();
                self.page++;
                self.updating = false;
            });
        }
    };

    $scope.$on("$destroy", function () {
        sharedFactory.map.removeLayer(self.mapCrossroadsLayer);
    });

}]);