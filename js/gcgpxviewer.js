function display(data) {
    var waypoints = data.documentElement.getElementsByTagName('wpt');
    var trks      = data.documentElement.getElementsByTagName('trk');
    if(waypoints.length == 0 && trks.length == 0) {
        alert('No waypoints found.');
    }
    else if(waypoints.length > 0) {
        displayCaches(waypoints);
    }

    if(waypoints.length == 0 && trks.length == 0) {
        alert('No track found.');
    }
    else if(trks.length > 0) {
        displayTrack(trks);
    }
}

function displayCaches(wpts) {
    var icon, type, wpt, sym, latlng, Oicon, oMarker, infoContent, InfoBoxOptions, ibLabel, i = 0, nb = wpts.length;
    var oInfo  = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    var oPolygon, polygonOptions;
    var path = [];

    for(i; i < nb; i++){
        wpt = wpts[i];
        sym = wpt.getElementsByTagName('sym')[0].childNodes[0] || false;
        if(sym && (sym.nodeValue != 'Geocache' &&
                   sym.nodeValue != 'Geocache Found' &&
                   sym.nodeValue != '') ) {
            continue;
        }
        var grdspk = wpt.getElementsByTagNameNS('*', 'cache');
        //console.log(grdspk[0].getAttribute('id'));
        var oName       = grdspk[0].getElementsByTagNameNS('*', 'name');
        var oDifficulty = grdspk[0].getElementsByTagNameNS('*', 'difficulty');
        var oTerrain    = grdspk[0].getElementsByTagNameNS('*', 'terrain');
        var oOwner      = grdspk[0].getElementsByTagNameNS('*', 'owner');
        var oContainer  = grdspk[0].getElementsByTagNameNS('*', 'container');
        var oDate       = new Date(wpt.getElementsByTagName('time')[0].childNodes[0].nodeValue);
        var date        = oDate.format('yyyy/mm/dd');
        var size        = null;

        for(var j = 0; j < typeCaches.length; j++) {
            if(typeCaches[j]['type'] == wpt.getElementsByTagName('type')[0].childNodes[0].nodeValue.substr(9)) {
                icon = 'img/' + typeCaches[j]['id'] + '.gif';
                break;
            }
        }
        if(!icon) {
            continue;
        }

        for(var j = 0; j < sizeCaches.length; j++) {
            if(sizeCaches[j]['id'] == oContainer[0].childNodes[0].nodeValue.toLowerCase()) {
                size = sizeCaches[j]['label'];
                break;
            }
        }

        latlng = new google.maps.LatLng(parseFloat(wpt.getAttribute('lat')),
                                        parseFloat(wpt.getAttribute('lon')));

        Oicon  = new google.maps.MarkerImage(icon, null, null, null, new google.maps.Size(16, 16));

        infoContent = '<div class="infowindow">';
        infoContent+= '<div class="code">' + wpt.getElementsByTagName('name')[0].childNodes[0].nodeValue + '</div>';
        infoContent+= '    <h4>';
        infoContent+= '        <img src="' + icon + '">';
        infoContent+= '        <a href="//coord.info/' + wpt.getElementsByTagName('name')[0].childNodes[0].nodeValue + '" onclick="window.open(this.href);return false;">' + oName[0].childNodes[0].nodeValue + '</a>';
        infoContent+= '    </h4>';
        infoContent+= '    <dl style="float:left;margin-right:2em;width:50%;">';
        if(oOwner[0].childNodes[0]) {
            infoContent+= '        <dt>Created by:</dt>';
            infoContent+= '        <dd>' + oOwner[0].childNodes[0].nodeValue + '</dd>';
        }
        infoContent+= '        <dt>Difficulty:</dt>';
        infoContent+= '        <dd>' + oDifficulty[0].childNodes[0].nodeValue + '</dd>';
        infoContent+= '        <dt>Cache size:</dt>';
        infoContent+= '        <dd>' + size + '</dd>';
        infoContent+= '    </dl>';
        infoContent+= '    <dl style="margin-left:50%">';
        infoContent+= '        <dt>Date Hidden:</dt>';
        infoContent+= '        <dd>' + date + '</dd>';
        infoContent+= '        <dt>Terrain:</dt>';
        infoContent+= '        <dd>' + oTerrain[0].childNodes[0].nodeValue + '</dd>';
        infoContent+= '    </dl>';
        infoContent+= '</div>';
        oMarker = new google.maps.Marker({
                             position: latlng,
                             icon: Oicon,
                             title: wpt.getElementsByTagName('desc')[0].childNodes[0].nodeValue,
                             draggable: false,
                             raiseOnDrag: true,
                             map: map
        });
        markers.push(oMarker);

        setEventMarker(oMarker, oInfo, infoContent);

        mc.addMarker(oMarker, false);

        InfoBoxOptions = {
            content: wpt.getElementsByTagName('name')[0].childNodes[0].nodeValue,
            boxClass: 'labels',
            disableAutoPan: true,
            pixelOffset: new google.maps.Size(-25, 0),
            position: latlng,
            closeBoxURL: '',
            isHidden: false,
            pane: 'mapPane',
            maxWidth: 0,
            enableEventPropagation: true
        };
        ibLabel = new InfoBox(InfoBoxOptions);
        labelList.push(ibLabel);

        circle  = new google.maps.Circle({
                              map: map,
                              radius: 161,
                              center: latlng,
                              strokeColor: '#ff0000',
                              strokeOpacity: 0.8,
                              strokeWeight: 1,
                              fillColor: 'transparent',
                              visible: false
                            });
        circleList.push(circle);

        displayInfos(oMarker, ibLabel, circle);
        bounds.extend(oMarker.getPosition());
    }
    if(!bounds.isEmpty()) {
        map.fitBounds(bounds);
    }
}

function displayTrack(wpts) {
    var wpt, latlng, i = 0, nb = wpts.length;
    var bounds = new google.maps.LatLngBounds();
    var oPolygon;

    for (i; i < nb; i++) {
        wpt = wpts[i];
        var trksegs = wpt.getElementsByTagName('trkseg');

        for(var j = 0; j < trksegs.length; j++) {
            var trkseg = trksegs[j];
            var path = new Array();
            trkpts = trkseg.getElementsByTagName('trkpt');
            for(var k = 0; k < trkpts.length; k++) {
                var trkpt = trkpts[k];
                latlng    = new google.maps.LatLng(parseFloat(trkpt.getAttribute('lat')),
                                                parseFloat(trkpt.getAttribute('lon')));
                path.push(latlng);
                bounds.extend(latlng);
            }

            new google.maps.Polyline({
                  map: map,
                  path: path,
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.5,
                  strokeWeight: 5
                });
        }
        bounds.extend(latlng);
    }
    if(!bounds.isEmpty()) {
      map.fitBounds(bounds);
    }
}

function setEventMarker(marker, infowindow, string) {
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(string);
      infowindow.open(this.getMap(), this);
    });
}

function displayInfos(marker, infobox, circle) {
    infobox.open(map);

    google.maps.event.addListener(map, 'zoom_changed', function() {
        if(map.getZoom() > mcMaxZoom) {
            if(document.getElementById('display_label').checked)  infobox.show();
            if(document.getElementById('display_circle').checked) circle.setVisible(true);
        }
        else {
            infobox.hide();
            circle.setVisible(false);
        }
    });
}

function refreshMap() {
    var updated_label = updated_circle = false;

    if(display_label != document.getElementById('display_label').checked) {
        display_label = document.getElementById('display_label').checked;
        updated_label = true;
    }

    if(display_circle != document.getElementById('display_circle').checked) {
        display_circle = document.getElementById('display_circle').checked;
        updated_circle = true;
    }

    for(i in markers) {
        if(updated_label)
            display_label ? labelList[i].show() : labelList[i].hide();
        if(updated_circle)
            circleList[i].setVisible(display_circle);
    }
}

function load() {
    var viewFullScreen = document.getElementById('fullscreen');

    if (viewFullScreen) {
        viewFullScreen.addEventListener('click', function () {
            var docElm = document.getElementById('map_canvas');
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }
            else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }
            else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            }
            else {
                alert('Your browser doesn\'t support fullscreen mode, please upgrade it (or use Firefox or Chrome).');
            }
        }, false);
    }

    typeCaches = [{'id':2   , 'type':'Traditional Cache'},
                  {'id':3   , 'type':'Multi-cache'},
                  {'id':4   , 'type':'Virtual Cache'},
                  {'id':5   , 'type':'Letterbox Hybrid'},
                  {'id':6   , 'type':'Event Cache'},
                  {'id':8   , 'type':'Unknown Cache'},
                  {'id':11  , 'type':'Webcam Cache'},
                  {'id':13  , 'type':'Cache In Trash Out Event'},
                  {'id':137 , 'type':'Earthcache'},
                  {'id':453 , 'type':'Mega-Event Cache'},
                  {'id':1304, 'type':'GPS Adventures Exhibit'},
                  {'id':1858, 'type':'Wherigo Cache'}
                 ];
    sizeCaches = [{'id':'micro'     , 'label':'Micro'},
                  {'id':'small'     , 'label':'Small'},
                  {'id':'regular'   , 'label':'Regular'},
                  {'id':'large'     , 'label':'Large'},
                  {'id':'not_chosen', 'label':'Not chosen'},
                  {'id':'not chosen', 'label':'Not chosen'},
                  {'id':'unknown'   , 'label':'Unknown'}
                 ];
    mcMaxZoom      = 13;
    display_label  = document.getElementById('display_label').checked;
    display_circle = document.getElementById('display_circle').checked;
    labelList      = [];
    circleList     = [];
    markers        = [];

    var mapOptions = { zoom: 6,
                       center: new google.maps.LatLng(46,2.9),
                       mapTypeId: google.maps.MapTypeId.ROADMAP,
                       streetViewControl: false,
                       scaleControl: true
                     };
    var mcOptions  = { gridSize: 80,
                       maxZoom: mcMaxZoom,
                       styles: [{url: 'img/m1.png', height: 53, width: 52},
                                {url: 'img/m2.png', height: 56, width: 55},
                                {url: 'img/m3.png', height: 66, width: 65},
                                {url: 'img/m4.png', height: 78, width: 77},
                                {url: 'img/m5.png', height: 90, width: 89}
                               ]
                     };
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    mc  = new MarkerClusterer(map, [], mcOptions);

    google.maps.event.addDomListener(document.getElementById('display_label'), 'change', refreshMap);
    google.maps.event.addDomListener(document.getElementById('display_circle'), 'change', refreshMap);
}

function detectFullscreen() {
    var docElm = document.documentElement;
    if(docElm.requestFullscreen || docElm.mozRequestFullScreen || docElm.webkitRequestFullScreen) {
        return true;
    }
    return false;
}

/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
http://www.sitepoint.com/html5-file-drag-and-drop/
*/
(function() {

    // output information
    function Output(msg) {
        var li = document.createElement('li');
        li.innerHTML = msg;
        list.appendChild(li);
    }

    function FileDragHover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.className = (e.type == 'dragover' ? 'hover' : '');
    }

    function FileSelectHandler(e) {
        // cancel event and hover styling
        FileDragHover(e);

        // fetch FileList object
        var files = e.target.files || e.dataTransfer.files;

        // process all File objects
        for (var i = 0, f; f = files[i]; i++) {
            ParseFile(f);
        }
    }

    // output file information
    function ParseFile(file) {
        var reader = new FileReader();
        var el = document.getElementById('loader');
        var fileinfo = [{'name': file.name, 'size': file.size}];

        reader.onprogress = function(e) {
            el.style.display = 'block';
        },

        reader.onload = function(e) {
            if(window.DOMParser) {
                parser = new DOMParser();
                doc = parser.parseFromString(e.target.result, 'text/xml');
            }
            else {
                doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(e.target.result);
            }

            doc = parser.parseFromString(e.target.result, 'application/xml');
            if(!doc || doc.documentElement.tagName != 'gpx') {
                alert(fileinfo[0]['name'] + ' in an invalid file.');
                return false;
            }
            Output(fileinfo[0]['name'] + ' (' + Math.round(fileinfo[0]['size']/1024*100)/100 + 'Ko)');
            display(doc);
        },
        reader.onloadend = function(e) {
            el.style.display = 'none';
        },

        reader.readAsText(file, 'UTF-8');
    }

    // initialize
    function Init() {
        var filedrag = document.getElementById('filedrag');
        filedrag.addEventListener('dragover', FileDragHover, false);
        filedrag.addEventListener('dragleave', FileDragHover, false);
        filedrag.addEventListener('drop', FileSelectHandler, false);
    }

    // call initialization file
    if(window.File && window.FileList && window.FileReader) {
        Init();
    }
    else {
        alert('Your browser doesn\'t support this feature, please upgrade it (or use Firefox or Chrome).');
    }

})();

window.onload = load;