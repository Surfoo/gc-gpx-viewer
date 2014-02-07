(function(_) {
    //'use strict';
    var typeCaches, sizeCaches, objOptionLabel, objOptionPerimeter, circleList, markers,
        map, parser, doc, circle;
    typeCaches = [{
        'id': 2,
        'type': 'Traditional Cache'
    }, {
        'id': 3,
        'type': 'Multi-cache'
    }, {
        'id': 4,
        'type': 'Virtual Cache'
    }, {
        'id': 5,
        'type': 'Letterbox Hybrid'
    }, {
        'id': 6,
        'type': 'Event Cache'
    }, {
        'id': 8,
        'type': 'Unknown Cache'
    }, {
        'id': 11,
        'type': 'Webcam Cache'
    }, {
        'id': 13,
        'type': 'Cache In Trash Out Event'
    }, {
        'id': 137,
        'type': 'Earthcache'
    }, {
        'id': 453,
        'type': 'Mega-Event Cache'
    }, {
        'id': 1304,
        'type': 'GPS Adventures Exhibit'
    }, {
        'id': 1858,
        'type': 'Wherigo Cache'
    }];

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

    var displayCaches = function(wpts) {
        var icon, wpt, sym, latlng, oMarker, infoContent, i, nbWpts, j, nbTypeCaches, nbSizeCaches,
            regexType = /[a-z]*?\|([a-z-\s]*)\|?/i,
            grdspk, oName, oDifficulty, oTerrain, oOwner, oContainer, oDate, date, size, match;

        for (i = 0, nbWpts = wpts.length; i < nbWpts; ++i) {
            wpt = wpts[i];
            sym = wpt.getElementsByTagName('sym')[0].childNodes[0] || false;
            if (sym && (sym.nodeValue !== 'Geocache' &&
                sym.nodeValue !== 'Geocache Found' &&
                sym.nodeValue !== '')) {
                continue;
            }
            grdspk = wpt.getElementsByTagNameNS('*', 'cache');
            //console.log(grdspk[0].getAttribute('id'));
            oName = grdspk[0].getElementsByTagNameNS('*', 'name');
            oDifficulty = grdspk[0].getElementsByTagNameNS('*', 'difficulty');
            oTerrain = grdspk[0].getElementsByTagNameNS('*', 'terrain');
            oOwner = grdspk[0].getElementsByTagNameNS('*', 'owner');
            oContainer = grdspk[0].getElementsByTagNameNS('*', 'container');
            oDate = new Date(wpt.getElementsByTagName('time')[0].childNodes[0].nodeValue);
            date = oDate.format('yyyy/mm/dd');
            size = null;
            match = wpt.getElementsByTagName('type')[0].childNodes[0].nodeValue.match(regexType);

            if (match) {
                for (j = 0, nbTypeCaches = typeCaches.length; j < nbTypeCaches; ++j) {
                    if (typeCaches[j].type === match[1]) {
                        icon = L.icon({
                            iconSize: [16, 16],
                            iconUrl: 'img/' + typeCaches[j].id + '.gif'
                        });
                        break;
                    }
                }
            }
            if (!icon) {
                continue;
            }

            for (j = 0, nbSizeCaches = sizeCaches.length; j < nbSizeCaches; ++j) {
                if (sizeCaches[j].id === oContainer[0].childNodes[0].nodeValue.toLowerCase()) {
                    size = sizeCaches[j].label;
                    break;
                }
            }

            latlng = new L.latLng(parseFloat(wpt.getAttribute('lat')), parseFloat(wpt.getAttribute('lon')));

            oMarker = L.marker(latlng, {
                icon: icon
            }).bindLabel(wpt.getElementsByTagName('name')[0].childNodes[0].nodeValue, {
                opacity: objOptionLabel.checked ? 1 : 0,
                noHide: true,
                direction: 'auto'
            }).addTo(map);

            infoContent = '<div class="infowindow">';
            infoContent += '<div class="code">' + wpt.getElementsByTagName('name')[0].childNodes[0].nodeValue + '</div>';
            infoContent += '    <h4>';
            infoContent += '        <img src="' + icon.options.iconUrl + '">';
            infoContent += '        <a href="http://coord.info/' + wpt.getElementsByTagName('name')[0].childNodes[0].nodeValue + '" onclick="window.open(this.href);return false;">' + oName[0].childNodes[0].nodeValue + '</a>';
            infoContent += '    </h4>';
            infoContent += '    <dl style="float:left;margin-right:2em;width:50%;">';
            if (oOwner[0].childNodes[0]) {
                infoContent += '        <dt>Created by:</dt>';
                infoContent += '        <dd>' + oOwner[0].childNodes[0].nodeValue + '</dd>';
            }
            infoContent += '        <dt>Difficulty:</dt>';
            infoContent += '        <dd>' + oDifficulty[0].childNodes[0].nodeValue + '</dd>';
            infoContent += '        <dt>Cache size:</dt>';
            infoContent += '        <dd>' + size + '</dd>';
            infoContent += '    </dl>';
            infoContent += '    <dl style="margin-left:50%">';
            infoContent += '        <dt>Date Hidden:</dt>';
            infoContent += '        <dd>' + date + '</dd>';
            infoContent += '        <dt>Terrain:</dt>';
            infoContent += '        <dd>' + oTerrain[0].childNodes[0].nodeValue + '</dd>';
            infoContent += '    </dl>';
            infoContent += '</div>';

            oMarker.bindPopup(L.popup({
                maxWidth: 500
            }).setLatLng(latlng).setContent(infoContent));
            markers.push(oMarker);

            circle = new L.circle(latlng, 161, {
                color: '#ff0000',
                opacity: objOptionPerimeter.checked ? 0.8 : 0,
                strokeWeight: 1,
                weight: 1,
                fill: false,
                clickable: false
            });
            circle.addTo(map);
            circleList.push(circle);

            bounds.extend(latlng);
        }
    };

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
            bounds.extend(latlng);
        }

    };

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

    var toggleLabels = function() {
        var i;
        for (i in markers) {
            if (objOptionLabel.checked) {
                markers[i].setOpacity(1, true);
                markers[i].showLabel();
            } else {
                markers[i].hideLabel();
            }
        }

        localStorage.setItem('option_label', +objOptionLabel.checked);
    };

    var togglePerimeters = function() {
        var i, _opacity = objOptionPerimeter.checked ? 0.8 : 0;
        for (i in markers) {
            circleList[i].setStyle({
                opacity: _opacity
            });
        }

        localStorage.setItem('option_perimeter', +objOptionPerimeter.checked);
    };

    var clear = function() {
        var i, element = document.getElementById('list');
        for (i in circleList) {
            map.removeLayer(circleList[i]);
        }
        for (i in markers) {
            map.removeLayer(markers[i]);
        }
        for (i in polylineList) {
            map.removeLayer(polylineList[i]);
        }
        circleList.length = 0;
        markers.length = 0;
        polylineList.length = 0;

        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    };

    var savePosition = function() {
        localStorage.setItem('zoom', map.getZoom());
        localStorage.setItem('latitude', map.getCenter().lat.toFixed(5));
        localStorage.setItem('longitude', map.getCenter().lng.toFixed(5));
    };

    var saveSidebar = function() {
        localStorage.setItem('sidebar', +sidebar.isVisible());
    };

    var saveBaseLayer = function() {
        localStorage.setItem('baselayer', control.getActiveBaseLayer().name);
    };

    var bounds = new L.LatLngBounds();

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

        // Default values
        var currentLatitude = 46,
            currentLongitude = 2.9,
            currentZoom = 6,
            currentSidebar = 1,
            currentBaseLayer = 'OSM Legacy',
            option_label = 1,
            option_perimeter = 1;

        var baseLayers = {
            "OSM Legacy": osmLegacyLayer,
            "Bing Aerial": bingLayerAerial,
            "Bing Road": bingLayerRoad,
            "Bing Hybrid": bingLayerAerialWithLabels,
            "Mapquest": mapquestLayer,
            "CloudMade": cloudmadeLayer,
            "Transport": transportLayer
        };

        var overlays = {};

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

        // Sidebar
        sidebar = L.control.sidebar('sidebar', {
            position: 'left',
            autoPan: false
        });
        map.addControl(sidebar);
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

        // Fullscreen
        map.addControl(new L.Control.FullScreen());

        // Geolocation
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

    // App Cache
    var onUpdateReady = function() {
        _.delay(function() {
            if (confirm('Geocaching GPX Viewer has been updated!\n\nDo you want to reload the page to use the new version?')) {
                window.location.reload(true);
            }
        }, 0);
        return false;
    };
    window.applicationCache.addEventListener('updateready', onUpdateReady);
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
        onUpdateReady();
    }

    // Flattr
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

    // output information
    var Output = function(msg) {
        var li = document.createElement('li'),
            list = document.getElementById('list');
        li.innerHTML = msg;
        list.appendChild(li);
    };

    // output file information
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
            var size_ko = (fileinfo[0].size / 1024 * 100) / 100;
            var size_mo = (fileinfo[0].size / 1024 / 1024 * 100) / 100;
            var size = (size_ko >= 1024) ? size_mo.toFixed(2) + 'Mo' : size_ko.toFixed(2) + 'Ko';
            var outputFileInfo = fileinfo[0].name + ' (' + size + ')';
            Output(outputFileInfo);
            display(doc);
        };

        reader.onloadend = function() {
            el.style.display = 'none';
        };

        reader.readAsText(file, 'UTF-8');
    };

    var FileSelectHandler = function(e) {
        // cancel event and hover styling
        //FileDragHover(e);

        // fetch FileList object
        var files = e.target.files || e.dataTransfer.files,
            i, f;

        // process all File objects
        for (i = 0; f = files[i]; ++i) {
            ParseFile(f);
        }
    };

    // call initialization file
    if (window.File && window.FileList && window.FileReader) {
        document.getElementById('files').addEventListener('change', FileSelectHandler, false);
    } else {
        alert('Your browser doesn\'t support this feature, please upgrade it (or use Firefox or Chrome).');
    }

    window.onload = load();
})(_);