'use strict';

angular.module('app.ctrl').controller('overviewController', ['$scope', '$timeout', 'configFactory', 'sharedFactory', 'crossroadsService', 'crossroadsLeaderboardService', 'routeLeaderboardService', 'socketService', function ($scope, $timeout, configFactory, sharedFactory, crossroadsService, crossroadsLeaderboardService, routeLeaderboardService, socketService) {
    const self = this;

    self.websocket_small_window = configFactory.small_window;
    self.websocket_medium_window = configFactory.medium_window;
    self.websocket_large_window = configFactory.large_window;

    self.websocket_top_semaphore_route_window = configFactory.top_semaphore_route_window;

    self.mapTopCrossroadsLayer = null;
    self.mapTopRouteLayer = null;
    self.mapOutlierCrossroadsLayer = null;

    self.topCrossroadsList = [];
    self.topRouteList = [];
    self.outlierCrossroadsList = [];

    self.topCrossroadsWindow = 0;
    self.outlierCrossroadsWindow = 0;
    self.topRouteWindow = 0;

    self.topCrossroadsSubscription = null;
    self.topRouteSubscription = null;
    self.outlierCrossroadsSubscription = null;

    self.doubled = false;
    self.showing = '';

    self.startTopCrossroads = function (topCrossroadsWindow) {
        if (self.topCrossroadsWindow === topCrossroadsWindow && !(self.doubled && self.showing === 'TOP_CROSSROADS')) {
            self.doubled = true;
            self.showing = 'TOP_CROSSROADS';
            sharedFactory.setSidebarRatio(4);
            return;
        } else {
            self.doubled = false;
            self.showing = '';
            sharedFactory.setSidebarRatio(2);
        }

        self.topCrossroadsList = [];
        self.updateTopCrossroadsLayer();

        if (self.topCrossroadsSubscription != null)
            socketService.unsubscribe(self.topCrossroadsSubscription);

        if (self.topCrossroadsWindow === topCrossroadsWindow) {
            self.topCrossroadsWindow = 0;
            return;
        }

        self.topCrossroadsWindow = topCrossroadsWindow;

        const apiMap = [
            {window: self.websocket_small_window, pointer: crossroadsLeaderboardService.getSmallWindow},
            {window: self.websocket_medium_window, pointer: crossroadsLeaderboardService.getMediumWindow},
            {window: self.websocket_large_window, pointer: crossroadsLeaderboardService.getLargeWindow}
        ];

        apiMap.find(item => item.window === self.topCrossroadsWindow).pointer(function (response) {
            self.topCrossroadsList = response.data.list;
            self.updateTopCrossroadsLayer();
        });

        const socketMap = [
            {window: self.websocket_small_window, pointer: socketService.listenTopTenCrossroadsSmallWindow},
            {window: self.websocket_medium_window, pointer: socketService.listenTopTenCrossroadsMediumWindow},
            {window: self.websocket_large_window, pointer: socketService.listenTopTenCrossroadsLargeWindow}
        ];

        socketMap.find(item => item.window === self.topCrossroadsWindow).pointer(function (message) {
            self.topCrossroadsList = message.list;
            self.updateTopCrossroadsLayer();
        }, function (subscription) {
            self.topCrossroadsSubscription = subscription;
        });
    };

    self.startTopRoute = function (topRouteWindow) {
        if (self.topRouteWindow === topRouteWindow && !(self.doubled && self.showing === 'TOP_ROUTE')) {
            self.doubled = true;
            self.showing = 'TOP_ROUTE';
            sharedFactory.setSidebarRatio(4);
            return;
        } else {
            self.doubled = false;
            self.showing = '';
            sharedFactory.setSidebarRatio(2);
        }

        self.topRouteList = [];
        self.updateTopRouteLayer();

        if (self.topRouteSubscription != null)
            socketService.unsubscribe(self.topRouteSubscription);

        if (self.topRouteWindow === topRouteWindow) {
            self.topRouteWindow = 0;
            return;
        }

        self.topRouteWindow = topRouteWindow;

        const apiMap = [
            {window: self.websocket_top_semaphore_route_window, pointer: routeLeaderboardService.getSmallWindow}
        ];

        apiMap.find(item => item.window === self.topRouteWindow).pointer(function (response) {
            self.topRouteList = response.data.list;
            self.updateTopRouteLayer();
        });

        const socketMap = [
            {window: self.websocket_top_semaphore_route_window, pointer: socketService.listenTopSemaphoreRoute}
        ];

        socketMap.find(item => item.window === self.topRouteWindow).pointer(function (message) {
            self.topRouteList = message.list;
            self.updateTopRouteLayer();
        }, function (subscription) {
            self.topRouteSubscription = subscription;
        });
    };

    self.startOutlierCrossroads = function (outlierCrossroadsWindow) {
        if (self.outlierCrossroadsWindow === outlierCrossroadsWindow && !(self.doubled && self.showing === 'OUTLIER_CROSSROADS')) {
            self.doubled = true;
            self.showing = 'OUTLIER_CROSSROADS';
            sharedFactory.setSidebarRatio(4);
            return;
        } else {
            self.doubled = false;
            self.showing = '';
            sharedFactory.setSidebarRatio(2);
        }

        self.outlierCrossroadsList = [];
        self.updateOutlierCrossroadsLayer();

        if (self.outlierCrossroadsSubscription != null)
            socketService.unsubscribe(self.outlierCrossroadsSubscription);

        if (self.outlierCrossroadsWindow === outlierCrossroadsWindow) {
            self.outlierCrossroadsWindow = 0;
            return;
        }

        self.outlierCrossroadsWindow = outlierCrossroadsWindow;

        const apiMap = [
            {window: self.websocket_small_window, pointer: crossroadsService.getOutliersSmallWindow},
            {window: self.websocket_medium_window, pointer: crossroadsService.getOutliersMediumWindow},
            {window: self.websocket_large_window, pointer: crossroadsService.getOutliersLargeWindow}
        ];

        apiMap.find(item => item.window === self.outlierCrossroadsWindow).pointer(function (response) {
            self.outlierCrossroadsList = response.data.map(function (x) {
                return {data: x, time: x.timestamp};
            });
            self.updateOutlierCrossroadsLayer();
        });

        const socketMap = [
            {window: self.websocket_small_window, pointer: socketService.listenOutlierCrossroadsSmallWindow},
            {window: self.websocket_medium_window, pointer: socketService.listenOutlierCrossroadsMediumWindow},
            {window: self.websocket_large_window, pointer: socketService.listenOutlierCrossroadsLargeWindow}
        ];

        socketMap.find(item => item.window === self.outlierCrossroadsWindow).pointer(function (message) {
            let found = self.outlierCrossroadsList.find(item => item.data.id === message.id);
            if (found !== undefined) {
                found.time = Date.now();
                return
            }

            self.outlierCrossroadsList.push({data: message, time: Date.now()});
            while (self.outlierCrossroadsList.length > 0 && self.outlierCrossroadsList[0].time < Date.now() - self.outlierCrossroadsWindow)
                self.outlierCrossroadsList.shift();
            self.updateOutlierCrossroadsLayer();
        }, function (subscription) {
            self.outlierCrossroadsSubscription = subscription;
        });
    };

    self.updateTopCrossroadsLayer = function () {
        self.mapTopCrossroadsLayer.clearLayers();
        angular.forEach(self.topCrossroadsList, function (crossroads) {
            self.addTopCrossroads(crossroads);
        });
    };

    self.updateTopRouteLayer = function () {
        self.mapTopRouteLayer.clearLayers();
        angular.forEach(self.topRouteList, function (route) {
            self.addTopRoute(route);
        });
    };

    self.updateOutlierCrossroadsLayer = function () {
        self.mapOutlierCrossroadsLayer.clearLayers();
        angular.forEach(self.outlierCrossroadsList, function (crossroads) {
            self.addOutlierCrossroads(crossroads.data);
        });
    };

    self.addTopCrossroads = function (crossroads) {
        angular.forEach(crossroads.semaphores, function (semaphore) {
            const target = [semaphore.location.latitude, semaphore.location.longitude];

            L.circle(target, {
                stroke: false,
                fillColor: '#00CCBE',
                fillOpacity: 0.1,
                radius: 500,
                zIndexOffset: 1
            }).addTo(self.mapTopCrossroadsLayer);

            let marker = L.marker(target, {
                icon: L.icon({
                    iconUrl: 'assets/img/jasmine_icon.svg',
                    iconSize: [30, 30]
                }),
                opacity: 0.9,
                zIndexOffset: 1
            }).addTo(self.mapTopCrossroadsLayer);

            marker.on("click", function () {
                window.location = "#/crossroads/details/" + crossroads.id + "/" + semaphore.semaphoreId
            });
        });
    };

    self.addTopRoute = function (route) {
        var pointList = [];
        angular.forEach(route, function (semaphore) {
            pointList.push([semaphore.location.latitude, semaphore.location.longitude]);
        });

        new L.Polyline(pointList, {
            color: '#CC2E26',
            weight: 8,
            opacity: 0.2,
            smoothFactor: 1,
            zIndexOffset: 1
        }).addTo(self.mapTopRouteLayer);

        new L.Polyline(pointList, {
            color: '#CC2E26',
            weight: 3,
            opacity: 0.9,
            smoothFactor: 1,
            zIndexOffset: 1
        }).addTo(self.mapTopRouteLayer);
    };

    self.addOutlierCrossroads = function (crossroads) {
        angular.forEach(crossroads.semaphores, function (semaphore) {
            const target = [semaphore.location.latitude, semaphore.location.longitude];

            let marker = L.marker(target, {
                icon: L.icon({
                    iconUrl: 'assets/img/jasmine_icon_grey.svg',
                    iconSize: [30, 30]
                }),
                opacity: 0.9,
                zIndexOffset: 0
            }).addTo(self.mapOutlierCrossroadsLayer);

            marker.on("click", function () {
                window.location = "#/crossroads/details/" + crossroads.id + "/" + semaphore.semaphoreId
            });
        });
    };

    $scope.$on("$destroy", function () {
        sharedFactory.map.removeLayer(self.mapTopCrossroadsLayer);
        sharedFactory.map.removeLayer(self.mapTopRouteLayer);
        sharedFactory.map.removeLayer(self.mapOutlierCrossroadsLayer);
        sharedFactory.removeLegend();
        sharedFactory.setSidebarRatio(2);
    });

    self.init = function () {
        self.mapTopCrossroadsLayer = new L.FeatureGroup();
        self.mapTopRouteLayer = new L.FeatureGroup();
        self.mapOutlierCrossroadsLayer = new L.FeatureGroup();

        sharedFactory.map.addLayer(self.mapTopCrossroadsLayer);
        sharedFactory.map.addLayer(self.mapTopRouteLayer);
        sharedFactory.map.addLayer(self.mapOutlierCrossroadsLayer);
        sharedFactory.addLegend();

        $timeout(function () {
            self.startTopCrossroads(self.websocket_small_window);
            self.startTopRoute(self.websocket_top_semaphore_route_window);
            self.startOutlierCrossroads(self.websocket_small_window);
        });
    }();

}]);