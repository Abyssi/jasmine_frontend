'use strict';

angular.module('app.srvc').service("socketService", ['$stomp', '$timeout', 'configFactory', function ($stomp, $timeout, configFactory) {

    const self = this;

    self.STOMP_API_ENDPOINT = 'stomp/';

    self.listenTopTenCrossroadsSmallWindow = function (callback, subscription) {
        self.listen(configFactory.websocket_top_ten_crossroads_topic + configFactory.small_window + configFactory.websocket_topic_suffix, callback, subscription);
    };

    self.listenTopTenCrossroadsMediumWindow = function (callback, subscription) {
        self.listen(configFactory.websocket_top_ten_crossroads_topic + configFactory.medium_window + configFactory.websocket_topic_suffix, callback, subscription);
    };

    self.listenTopTenCrossroadsLargeWindow = function (callback, subscription) {
        self.listen(configFactory.websocket_top_ten_crossroads_topic + configFactory.large_window + configFactory.websocket_topic_suffix, callback, subscription);
    };

    self.listenOutlierCrossroadsSmallWindow = function (callback, subscription) {
        self.listen(configFactory.websocket_outlier_crossroads_topic + configFactory.small_window + configFactory.websocket_topic_suffix, callback, subscription);
    };

    self.listenOutlierCrossroadsMediumWindow = function (callback, subscription) {
        self.listen(configFactory.websocket_outlier_crossroads_topic + configFactory.medium_window + configFactory.websocket_topic_suffix, callback, subscription);
    };

    self.listenOutlierCrossroadsLargeWindow = function (callback, subscription) {
        self.listen(configFactory.websocket_outlier_crossroads_topic + configFactory.large_window + configFactory.websocket_topic_suffix, callback, subscription);
    };

    self.listenDamagedSemaphore = function (callback, subscription) {
        self.listen(configFactory.websocket_damaged_semaphore_topic + configFactory.websocket_topic_suffix, callback, subscription);
    };

    self.listenTopSemaphoreRoute = function (callback, subscription) {
        self.listen(configFactory.websocket_top_semaphore_route_topic + configFactory.websocket_topic_suffix, callback, subscription);
    };

    // Middle level support functions

    self.listen = function (topic, callback, subscriptionHandler) {
        $timeout(function () {
            self.connect(configFactory.SERVER_URI + self.STOMP_API_ENDPOINT, function () {
                const subscription = self.subscribe(topic, function (payload, headers, response) {
                    callback(payload);
                });
                if (subscriptionHandler != null)
                    subscriptionHandler(subscription);
            });
        });
    };

    // Low level support functions

    self.muxes = [];

    self.connect = function (url, connectionCallback, errorCallback) {
        let mux = self.muxes.find(item => item.url === url);
        if (mux == null)
            self.muxes.push(mux = {url: url, state: "NOT_CONNECTED", callbacks: []});

        if (mux.state === "CONNECTED")
            connectionCallback();
        else if (mux.state === "CONNECTING")
            mux.callbacks.push(connectionCallback);
        else if (mux.state === "NOT_CONNECTED") {
            mux.state = "CONNECTING";
            $stomp.connect(url, {}, errorCallback).then(function () {
                angular.forEach(mux.callbacks, function (callback) {
                    callback();
                    mux.state = "CONNECTED";
                });
                mux.callbacks = [];
            });
        }
    };

    self.closeConnection = function (callback) {
        $stomp.disconnect().then(callback);
    };

    self.subscribe = function (topic, callback) {
        return $stomp.subscribe(topic, callback, {});
    };

    self.unsubscribe = function (subscription) {
        $stomp.unsubscribe(subscription);
    };

}]);
