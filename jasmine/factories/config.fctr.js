'use strict';

angular.module('app.fctr').factory('configFactory', function () {
    const self = this;

    //self.SERVER_URI = 'http://www.jasmine.cf:32082/';
    self.SERVER_URI = 'http://localhost:8082/';

    self.websocket_top_ten_crossroads_topic = "top-ten-crossroads-";
    self.websocket_outlier_crossroads_topic = "outlier-crossroads-";
    self.websocket_damaged_semaphore_topic = "damaged-semaphore";
    self.websocket_top_semaphore_route_topic = "top-semaphore-route";
    self.websocket_topic_suffix = "-topic";

    // Development values
    //self.top_semaphore_route_window = 5000;
    //self.small_window = 15000;
    //self.medium_window = 60000;
    //self.large_window = 1440000;

    // Real values
    self.top_semaphore_route_window = 300000;
    self.small_window = 900000;
    self.medium_window = 3600000;
    self.large_window = 86400000;

    return self;
});