(function(_) {
    /*'use strict';*/
    var typeCaches, sizeCaches, objOptionLabel, objOptionPerimeter, circleList, polylineList, markers,
        map, parser, doc, circle, control,
        circleOpacity = 0.8,
        circleColor = '#c11414',
        circleFillOpacity = 0.25,
        unitType = ['o', 'Ko', 'Mo', 'Go'];

    // Types of geocaches from geocaching.com
    typeCaches = [{
        'type': 'Traditional Cache',
        'filename': 'type_traditional'
    }, {
        'type': 'Multi-cache',
        'filename': 'type_multi'
    }, {
        'type': 'Virtual Cache',
        'filename': 'type_virtual'
    }, {
        'type': 'Letterbox Hybrid',
        'filename': 'type_letterbox'
    }, {
        'type': 'Event Cache',
        'filename': 'type_event'
    }, {
        'type': 'Unknown Cache',
        'filename': 'type_mystery'
    }, {
        'type': 'Project APE Cache',
        'filename': 'type_ape'
    }, {
        'type': 'Webcam Cache',
        'filename': 'type_webcam'
    }, {
        'type': 'Cache In Trash Out Event',
        'filename': 'type_cito'
    }, {
        'type': 'Earthcache',
        'filename': 'type_earth'
    }, {
        'type': 'Mega-Event Cache',
        'filename': 'type_mega'
    }, {
        'type': 'GPS Adventures Exhibit',
        'filename': 'type_event'
    }, {
        'type': 'Wherigo Cache',
        'filename': 'type_wherigo'
    }, {
        'type': 'Lost and Found Event Caches',
        'filename': 'type_event'
    }, {
        'type': 'Groundspeak HQ',
        'filename': 'type_hq'
    }, {
        'type': 'Groundspeak Lost and Found Celebration',
        'filename': 'type_event'
    }, {
        'type': 'Groundspeak Block Party',
        'filename': 'type_event'
    }, {
        'type': 'Giga-Event Cache',
        'filename': 'type_giga'
    }];

    // Size list geocaches
    sizeCaches = [{
        'id': 'micro',
        'label': 'Micro'
    }, {
        'id': 'small',
        'label': 'Small'
    }, {
        'id': 'regular',
        'label': 'Regular'
    }, {
        'id': 'large',
        'label': 'Large'
    }, {
        'id': 'not_chosen',
        'label': 'Not chosen'
    }, {
        'id': 'not chosen',
        'label': 'Not chosen'
    }, {
        'id': 'unknown',
        'label': 'Unknown'
    }, {
        'id': 'other',
        'label': 'Other'
    }, {
        'id': 'virtual',
        'label': 'Virtual'
    }];
    objOptionLabel = document.getElementById('display_labels');
    objOptionPerimeter = document.getElementById('display_perimeters');
    circleList = [];
    polylineList = [];
    markers = [];

    // Display geocaches on the map
    var displayCaches = function(wpts) {
        var icon, wpt, sym, latlng, oMarker, infoContent, i, nbWpts, j, nbTypeCaches, nbSizeCaches,
            regexType = /[a-z]*?\|([^<]*)\|?/i,
            grdspk, elmName, elmDifficulty, elmTerrain, elmOwner, elmContainer, elmDate, elmSize, match;

        // for each geocaches
        for (i = 0, nbWpts = wpts.length; i < nbWpts; ++i) {
            wpt = wpts[i];
            sym = wpt.getElementsByTagName('sym')[0].childNodes[0] || false;
            if (sym && (sym.nodeValue !== 'Geocache' &&
                sym.nodeValue !== 'Geocache Found' &&
                sym.nodeValue !== '')) {
                continue;
            }
            // Retrieve all informations in the waypoint
            grdspk = wpt.getElementsByTagNameNS('*', 'cache');
            /*console.log(grdspk[0].getAttribute('id'));*/
            elmName = grdspk[0].getElementsByTagNameNS('*', 'name');
            elmDifficulty = grdspk[0].getElementsByTagNameNS('*', 'difficulty');
            elmTerrain = grdspk[0].getElementsByTagNameNS('*', 'terrain');
            elmOwner = grdspk[0].getElementsByTagNameNS('*', 'owner');
            elmContainer = grdspk[0].getElementsByTagNameNS('*', 'container');
            elmDate = new Date(wpt.getElementsByTagName('time')[0].childNodes[0].nodeValue);
            elmDate = elmDate.format('yyyy/mm/dd');
            elmSize = null;
            match = wpt.getElementsByTagName('type')[0].childNodes[0].nodeValue.match(regexType);

            if (match) {
                for (j = 0, nbTypeCaches = typeCaches.length; j < nbTypeCaches; ++j) {
                    if (typeCaches[j].type === match[1]) {
                        icon = L.icon({
                            iconSize: [22, 22],
                            iconUrl: 'img/' + typeCaches[j].filename + '.map.png',
                            iconPopin: 'img/' + typeCaches[j].filename + '.png'
                        });
                        break;
                    }
                }
            }
            if (!icon) {
                continue;
            }

            for (j = 0, nbSizeCaches = sizeCaches.length; j < nbSizeCaches; ++j) {
                if (sizeCaches[j].id === elmContainer[0].childNodes[0].nodeValue.toLowerCase()) {
                    elmSize = sizeCaches[j].label;
                    break;
                }
            }

            latlng = new L.latLng(parseFloat(wpt.getAttribute('lat')), parseFloat(wpt.getAttribute('lon')));

            // Create the marker
            oMarker = L.marker(latlng, {
                icon: icon
            }).bindLabel(wpt.getElementsByTagName('name')[0].childNodes[0].nodeValue, {
                opacity: objOptionLabel.checked ? 1 : 0,
                noHide: true,
                direction: 'auto'
            }).addTo(map);

            // Content for the popup
            infoContent = '<div class="infowindow">';
            infoContent += '<div class="code">' + wpt.getElementsByTagName('name')[0].childNodes[0].nodeValue + '</div>';
            infoContent += '    <h4>';
            infoContent += '        <img src="' + icon.options.iconPopin + '" width="20" alt="" />';
            infoContent += '        <a href="http://coord.info/' + wpt.getElementsByTagName('name')[0].childNodes[0].nodeValue + '" onclick="window.open(this.href);return false;">' + elmName[0].childNodes[0].nodeValue + '</a>';
            infoContent += '    </h4>';
            infoContent += '    <dl style="float:left;margin-right:2em;width:50%;">';
            if (elmOwner[0].childNodes[0]) {
                infoContent += '        <dt>Created by:</dt>';
                infoContent += '        <dd title="' + elmOwner[0].childNodes[0].nodeValue + '">' + elmOwner[0].childNodes[0].nodeValue + '</dd>';
            }
            infoContent += '        <dt>Difficulty:</dt>';
            infoContent += '        <dd>' + elmDifficulty[0].childNodes[0].nodeValue + '</dd>';
            infoContent += '        <dt>Cache size:</dt>';
            infoContent += '        <dd>' + elmSize + '</dd>';
            infoContent += '    </dl>';
            infoContent += '    <dl style="margin-left:50%">';
            infoContent += '        <dt>Date Hidden:</dt>';
            infoContent += '        <dd>' + elmDate + '</dd>';
            infoContent += '        <dt>Terrain:</dt>';
            infoContent += '        <dd>' + elmTerrain[0].childNodes[0].nodeValue + '</dd>';
            infoContent += '    </dl>';
            infoContent += '</div>';

            oMarker.bindPopup(L.popup({
                maxWidth: 500
            }).setLatLng(latlng).setContent(infoContent));
            markers.push(oMarker);

            // Set perimeter
            circle = new L.circle(latlng, 161, {
                weight: 2,
                color: circleColor,
                opacity: objOptionPerimeter.checked ? circleOpacity : 0,
                fillColor: objOptionPerimeter.checked ? circleColor : 'transparent',
                fillOpacity: objOptionPerimeter.checked ? circleFillOpacity : 0,
                clickable: false
            });
            circle.addTo(map);
            circleList.push(circle);

            // Extends the bounds to contain the given point
            bounds.extend(latlng);
        }
    };

    // Display tracks on the map
    var displayTracks = function(wpts) {
        var wpt, latlng, i = 0,
            j, k,
            nb = wpts.length,
            trksegs, trkseg, trkpts, trkpt, nbTrkSegs, nbTrkPts, path;

        for (i; i < nb; ++i) {
            wpt = wpts[i];
            trksegs = wpt.getElementsByTagName('trkseg');

            for (j = 0, nbTrkSegs = trksegs.length; j < nbTrkSegs; ++j) {
                trkseg = trksegs[j];
                path = [];
                trkpts = trkseg.getElementsByTagName('trkpt');
                for (k = 0, nbTrkPts = trkpts.length; k < nbTrkPts; ++k) {
                    trkpt = trkpts[k];
                    latlng = new L.latLng(parseFloat(trkpt.getAttribute('lat')), parseFloat(trkpt.getAttribute('lon')));
                    path.push(latlng);
                    bounds.extend(latlng);
                }
                var polyline = new L.Polyline(path, {
                    color: 'red'
                });
                polyline.addTo(map);
                polylineList.push(polyline);
            }
        }

    };

    // function to display informations on the maps, waypoints or tracks
    var display = function(data) {
        var waypoints = data.documentElement.getElementsByTagName('wpt'),
            trks = data.documentElement.getElementsByTagName('trk');
        if (waypoints.length === 0 && trks.length === 0) {
            alert('No waypoints found.');
        } else if (waypoints.length > 0) {
            displayCaches(waypoints);
        }

        if (waypoints.length === 0 && trks.length === 0) {
            alert('No tracks found.');
        } else if (trks.length > 0) {
            displayTracks(trks);
        }

        if (bounds.isValid()) {
            map.fitBounds(bounds);
        }
    };

    // Toggle labels according to the old value
    var toggleLabels = function() {
        _.each(markers, function(value, key) {
            if (objOptionLabel.checked) {
                markers[key].setOpacity(1, true);
                markers[key].showLabel();
            } else {
                markers[key].hideLabel();
            }
        });

        localStorage.setItem('option_label', +objOptionLabel.checked);
    };

    // Toggle perimeters acccording to the old value
    var togglePerimeters = function() {
        _.each(markers, function(value, key) {
            circleList[key].setStyle({
                opacity: objOptionPerimeter.checked ? circleOpacity : 0,
                fillColor: objOptionPerimeter.checked ? circleColor : 'transparent',
                fillOpacity: objOptionPerimeter.checked ? circleFillOpacity : 0
            });
        });

        localStorage.setItem('option_perimeter', +objOptionPerimeter.checked);
    };

    // Clear the map by removing all layers
    var clear = function() {
        _.each(circleList, function(value, key) {
            map.removeLayer(circleList[key]);
        });
        _.each(markers, function(value, key) {
            map.removeLayer(markers[key]);
        });
        _.each(polylineList, function(value, key) {
            map.removeLayer(polylineList[key]);
        });

        circleList.length = 0;
        markers.length = 0;
        polylineList.length = 0;
        bounds = new L.LatLngBounds();

        var element = document.getElementById('list');
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    };

    // Save the position and the zoom in localstorage
    var savePosition = function() {
        localStorage.setItem('zoom', map.getZoom());
        localStorage.setItem('latitude', map.getCenter().lat.toFixed(5));
        localStorage.setItem('longitude', map.getCenter().lng.toFixed(5));
    };

    // Save the position of the sidebard (hidden or not)  in localstorage
    var saveSidebar = function() {
        localStorage.setItem('sidebar', +sidebar.isVisible());
    };

    // Save the current baselayer  in localstorage
    var saveBaseLayer = function() {
        localStorage.setItem('baselayer', control.getActiveBaseLayer().name);
    };

    var bounds = new L.LatLngBounds();

    // Init function to create the user interface
    var load = function() {
        var cloudmadeLayer = L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
        });

        var transportLayer = L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://www.thunderforest.com/">Thunderforest</a>'
        });

        var mapquestLayer = L.tileLayer('http://otile2.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://www.mapquest.com/">Mapquest</a>'
        });

        var osmLegacyLayer = L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://www.openstreetmap.org/">OpenStreetMap</a>'
        });

        var bingLayerAerial = new L.BingLayer("AlBwVzyGYtseSIzUAiDWBVI6k8OLGHVnEYuSfWSzNtQJ7eltNWiL1wCkdbD6T_JJ", {
            type: 'Aerial'
        });

        var bingLayerAerialWithLabels = new L.BingLayer("AlBwVzyGYtseSIzUAiDWBVI6k8OLGHVnEYuSfWSzNtQJ7eltNWiL1wCkdbD6T_JJ", {
            type: 'AerialWithLabels'
        });

        var bingLayerRoad = new L.BingLayer("AlBwVzyGYtseSIzUAiDWBVI6k8OLGHVnEYuSfWSzNtQJ7eltNWiL1wCkdbD6T_JJ", {
            type: 'Road'
        });

        var stamenToner = new L.StamenTileLayer("toner");

        var stamenWaterColor = new L.StamenTileLayer("watercolor");

        // Default values
        var currentLatitude = 46,
            currentLongitude = 2.9,
            currentZoom = 6,
            currentSidebar = 1,
            currentBaseLayer = 'OSM Legacy',
            option_label = 1,
            option_perimeter = 1;

        // List of base layers
        var baseLayers = {
            "OSM Legacy": osmLegacyLayer,
            "Bing Aerial": bingLayerAerial,
            "Bing Road": bingLayerRoad,
            "Bing Hybrid": bingLayerAerialWithLabels,
            "Mapquest": mapquestLayer,
            "CloudMade": cloudmadeLayer,
            "Transport": transportLayer,
            "Stamen Toner": stamenToner,
            "Stamen WaterColor": stamenWaterColor
        };

        var overlays = {};

        // Set some of default values for the map
        if (window.localStorage) {
            currentLatitude = _.isNull(localStorage.getItem('latitude')) ? currentLatitude : parseFloat(localStorage.getItem('latitude'));
            currentLongitude = _.isNull(localStorage.getItem('longitude')) ? currentLongitude : parseFloat(localStorage.getItem('longitude'));
            currentZoom = _.isNull(localStorage.getItem('zoom')) ? currentZoom : +localStorage.getItem('zoom');
            if (localStorage.getItem('baselayer') !== null && _.has(baseLayers, localStorage.getItem('baselayer'))) {
                currentBaseLayer = localStorage.getItem('baselayer');
            }
            currentSidebar = localStorage.getItem('sidebar') === null ? currentSidebar : +localStorage.getItem('sidebar');
            option_label = localStorage.getItem('option_label') === null ? option_label : +localStorage.getItem('option_label');
            option_perimeter = localStorage.getItem('option_perimeter') === null ? option_perimeter : +localStorage.getItem('option_perimeter');
        }

        // Create the map
        map = L.map('map', {
            center: new L.LatLng(currentLatitude, currentLongitude),
            zoom: currentZoom,
            layers: _.values(_.pick(baseLayers, currentBaseLayer)),
            attributionControl: false,
            zoomControl: true,
            inertia: false
        });

        // Active Layers
        control = L.control.activeLayers(baseLayers, overlays);
        control.addTo(map);

        // Scale options
        L.control.scale({
            'maxWidth': 200
        }).addTo(map);

        // Sidebar options
        sidebar = L.control.sidebar('sidebar', {
            position: 'left',
            autoPan: false
        });
        map.addControl(sidebar);
        document.getElementById('sidebar').style.display = 'block';
        if (currentSidebar) {
            _.delay(function() {
                sidebar.show();
            }, 250);
        }
        if (option_label) {
            objOptionLabel.checked = 'checked';
        }
        if (option_perimeter) {
            objOptionPerimeter.checked = 'checked';
        }

        // Fullscreen options
        map.addControl(new L.Control.FullScreen());

        // Geolocation options
        L.control.locate({
            drawCircle: false
        }).addTo(map);

        // Options
        map.addControl(new L.Control.Options());

        // EventListeners
        document.getElementById('clear').addEventListener('click', clear);
        objOptionLabel.addEventListener('change', toggleLabels);
        objOptionPerimeter.addEventListener('change', togglePerimeters);
        L.DomEvent.addListener(map, 'zoomend', savePosition);
        L.DomEvent.addListener(map, 'moveend', savePosition);
        L.DomEvent.addListener(map, 'baselayerchange', saveBaseLayer);
        sidebar.on('hide', saveSidebar);
        sidebar.on('show', saveSidebar);
    };

    // App Cache, reload the web app by user request to get the latest version
    var onUpdateReady = function() {
        _.delay(function() {
            if (confirm('Geocaching GPX Viewer has been updated!\n\nDo you want to reload the page to use the new version?')) {
                window.location.reload(true);
            }
        }, 0);
        return false;
    };
    // Listener for App Cache
    window.applicationCache.addEventListener('updateready', onUpdateReady);
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
        onUpdateReady();
    }

    // Flattr Button
    (function() {
        var f, s = document.getElementById('flattr');
        f = document.createElement('iframe');
        f.src = '//api.flattr.com/button/view/?uid=Surfoo&button=compact&url=' + encodeURIComponent(document.URL);
        f.title = 'Flattr';
        f.height = 20;
        f.width = 110;
        f.style.borderWidth = 0;
        f.style.verticalAlign = 'middle';
        s.parentNode.insertBefore(f, s);
    }());

    // Output information
    var Output = function(msg) {
        var li = document.createElement('li'),
            list = document.getElementById('list');
        li.innerHTML = msg;
        list.appendChild(li);
    };

    // Output file information
    var ParseFile = function(file) {
        var reader = new FileReader(),
            el = document.getElementById('loader'),
            fileinfo = [{
                'name': file.name,
                'size': file.size
            }];

        reader.onprogress = function() {
            el.style.display = 'block';
        };

        reader.onload = function(e) {
            if (window.DOMParser) {
                parser = new DOMParser();
                doc = parser.parseFromString(e.target.result, 'text/xml');
            } else {
                doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(e.target.result);
            }

            doc = parser.parseFromString(e.target.result, 'application/xml');
            if (!doc || doc.documentElement.tagName !== 'gpx') {
                alert(fileinfo[0].name + ' in an invalid file.');
                return false;
            }

            var size = fileinfo[0].size,
                unitCount = 0;
            while (size >= 1024) {
                size = size / 1024;
                ++unitCount;
            }

            Output(fileinfo[0].name + ' (' + size.toFixed(2) + unitType[unitCount] + ')');
            display(doc);
        };

        reader.onloadend = function() {
            el.style.display = 'none';
        };

        reader.readAsText(file, 'UTF-8');
    };

    var FileSelectHandler = function(e) {
        // fetch FileList object
        var files = e.target.files || e.dataTransfer.files;

        // process all File objects
        _.each(files, function(value) {
            ParseFile(value);
        });

    };

    // call initialization file
    if (window.File && window.FileList && window.FileReader) {
        document.getElementById('files').addEventListener('change', FileSelectHandler, false);
    } else {
        alert('Your browser doesn\'t support this feature, please upgrade it (or use Firefox or Chrome).');
    }

    window.onload = load();
})(_);
