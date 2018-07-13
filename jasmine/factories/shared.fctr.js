'use strict';

angular.module('app.fctr').factory('sharedFactory', function () {
    const self = this;

    self.map = null;

    self.init = function () {
        const cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
        });

        self.map = L.map("map", {
            zoom: 12,
            center: ['41.8980115', '12.49145'],
            layers: [cartoLight],
            zoomControl: false,
            attributionControl: false
        });

        let attributionControl = L.control({
            position: "bottomright"
        });
        attributionControl.onAdd = function () {
            var div = L.DomUtil.create("div", "leaflet-control-attribution");
            div.innerHTML = "<span class='hidden-xs'>Developed by JASMINE Team</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
            return div;
        };

        self.map.addControl(attributionControl);

        /*
        let sidebarControl = L.control({
            position: "topleft"
        });
        sidebarControl.onAdd = function () {
            var div = L.DomUtil.create("div", "leaflet-control-sidebar");
            div.innerHTML = "<button type=\"button\" class=\"btn btn-light\" id=\"sidebar-hide-btn\" data-target=\"#sidebar\" data-toggle=\"collapse\" aria-expanded=\"true\"><i class=\"fa fa-chevron-left\"></i></button>";
            return div;
        };

        self.map.addControl(sidebarControl);
        */
    }();

    self.setSidebarRatio = function (ratio) {
        $("#sidebar").removeClass(function (index, className) {
            return (className.match(/(^|\s)col-md-\S+/g) || []).join(' ');
        });
        $('#sidebar').addClass('col-md-' + ratio);

        $("#main").removeClass(function (index, className) {
            return (className.match(/(^|\s)col-md-\S+/g) || []).join(' ');
        });
        $('#main').addClass('col-md-' + (12 - ratio));
    };

    self.legendControl = null;

    self.addLegend = function () {
        self.legendControl = L.control({position: 'topright'});
        self.legendControl.onAdd = function () {
            let div = L.DomUtil.create('div', 'info legend'),
                colors = ['#00CCBE', '#4A4A4A', '#CC2E26', '#F5A623'],
                labels = ['Top crossroads', 'Outlier crossroads', 'Top routes', 'Damaged semaphores'];

            for (let i = 0; i < labels.length; i++)
                div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' + labels[i] + '<br>';

            return div;
        };

        self.map.addControl(self.legendControl);
    };

    self.removeLegend = function () {
        self.map.removeControl(self.legendControl);
    };

    return self;
});