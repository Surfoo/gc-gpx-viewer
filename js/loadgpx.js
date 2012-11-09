function display(data)
{
  var waypoints = data.documentElement.getElementsByTagName("wpt");
  var trks      = data.documentElement.getElementsByTagName("trk");
  if(waypoints.length == 0 && trks.length == 0)
  {
      alert('No waypoints found.');
  }
  else if(waypoints.length > 0) 
  {
    displayCaches(waypoints);
  }

  if(waypoints.length == 0 && trks.length == 0)
  {
      alert('No track found.');
  }
  else if(trks.length > 0) 
  {
    displayTrack(trks);
  }
}

function displayCaches(wpts) 
{
    var icon, type, wpt, sym, latlng, Oicon, oMarker, infoContent, InfoBoxOptions, ibLabel, i = 0, nb = wpts.length;
    var oInfo  = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    var oPolygon;
    var path = new Array();
    var polygonOptions;

    for (i; i < nb; i++) 
    {
        wpt = wpts[i];
        sym = wpt.getElementsByTagName('sym')[0].childNodes[0] || false;
        if(sym && (sym.nodeValue != "Geocache" && 
                   sym.nodeValue != "Geocache Found" && 
                   sym.nodeValue != "") )
        {
          continue;
        }
        
        type = wpt.getElementsByTagName('type')[0].childNodes[0].nodeValue.substr(9);
        switch(type){
          case "Unknown Cache":
            icon = 'mystery.gif';
            break;
          case "Traditional Cache":
            icon = 'traditional.gif';
            break;
          case "Multi-cache":
            icon = 'multi.gif';
            break;
          case "Wherigo Cache":
            icon = 'wherigo.gif';
            break;
          case "Event Cache":
            icon = 'event.gif';
            break;
          case "Virtual Cache":
            icon = 'virtual.gif';
            break;
          case "Earthcache":
            icon = 'earthcache.gif';
            break;
          case "Letterbox Hybrid":
            icon = 'letterbox.gif';
            break;
          case "Webcam Cache":
            icon = 'webcam.gif';
            break;
          default:
            continue;
        }

        latlng = new google.maps.LatLng(parseFloat(wpt.getAttribute("lat")),
                                        parseFloat(wpt.getAttribute("lon")));

        Oicon  = new google.maps.MarkerImage("img/" + icon, null, null, null, new google.maps.Size(16, 16));
        
        infoContent = '<div>' +
                            '<h5><img src="img/' + icon + '" alt="" width="16" height="16" style="vertical-align:middle;" /> ' +
                            '<a href="http://coord.info/' + wpt.getElementsByTagName('name')[0].childNodes[0].nodeValue + '" onclick="window.open(this.href);return false;">' + 
                            wpt.getElementsByTagName('urlname')[0].childNodes[0].nodeValue + '</a></h5>'+
                            '<p>' + wpt.getElementsByTagName('name')[0].childNodes[0].nodeValue + '</p>'+
                            '</div>'; 

        oMarker = new google.maps.Marker({
                             position: latlng,
                             icon: Oicon,
                             title: wpt.getElementsByTagName('desc')[0].childNodes[0].nodeValue,
                             draggable: false,
                             raiseOnDrag: true,
                             map: map
        });

        setEventMarker(oMarker, oInfo, infoContent);

        InfoBoxOptions = {
          content: wpt.getElementsByTagName('name')[0].childNodes[0].nodeValue,
          boxClass: 'labels',
          disableAutoPan: true,
          pixelOffset: new google.maps.Size(-25, 0),
          position: latlng,
          closeBoxURL: "",
          isHidden: false,
          pane: "mapPane",
          maxWidth: 0,
          enableEventPropagation: true
        };
        ibLabel = new InfoBox(InfoBoxOptions);
        ibLabel.open(map);

        bounds.extend(oMarker.getPosition());

    }
    if(wpt.length > 0) 
    {
      map.fitBounds(bounds);
    }

}

function displayTrack(wpts)
{
    var wpt, latlng, i = 0, nb = wpts.length;
    var bounds = new google.maps.LatLngBounds();
    var oPolygon;
    var colors = ['blue', 'red', 'yellow', 'green'];
    console.log('nb', nb);
    for (i; i < nb; i++) 
    {
        wpt = wpts[i];
        var trksegs = wpt.getElementsByTagName('trkseg');

        console.log('trksegs', trksegs.length);
        for(var j = 0; j < trksegs.length; j++)
        {
            var trkseg = trksegs[j];
            var path = new Array();
            trkpts = trkseg.getElementsByTagName('trkpt');
            console.log('trkpts', trkpts.length);
            for(var k = 0; k < trkpts.length; k++)
            {
              var trkpt = trkpts[k];
              latlng = new google.maps.LatLng(parseFloat(trkpt.getAttribute("lat")),
                                              parseFloat(trkpt.getAttribute("lon")));
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
    map.fitBounds(bounds);
}

function setEventMarker(marker, infowindow, string)
{
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(string);
    infowindow.open(this.getMap(), this);
  });
}

function load() 
{
    var viewFullScreen = document.getElementById("fullscreen");
    if (viewFullScreen) {
        viewFullScreen.addEventListener("click", function () {
            var docElm = document.getElementById("map_canvas");
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

    var myOptions = { zoom: 6,
                      center: new google.maps.LatLng(46,2.9),
                      mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}

function detectFullscreen()
{
  var docElm = document.documentElement;
  if (docElm.requestFullscreen || docElm.mozRequestFullScreen || docElm.webkitRequestFullScreen ) {
     return true;
  }
  return false;
}

/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/
(function() {

    function FileDragHover(e)
    {
        e.stopPropagation();
        e.preventDefault();
        e.target.className = (e.type == "dragover" ? "hover" : "");
    }

    function FileSelectHandler(e)
    {
        // cancel event and hover styling
        FileDragHover(e);

        // fetch FileList object
        var files = e.target.files || e.dataTransfer.files;

        // process all File objects
        for (var i = 0, f; f = files[i]; i++) 
        {
            var reader = new FileReader();
            var el = document.getElementById('filedrag');

            reader.onprogress = function(e) 
            {
                el.innerHTML = '<img src="img/ajax-loader.gif" alt="" width="200" height="19" />';
            }

            reader.onload = function(e) 
            {
                if (window.DOMParser) 
                {
                    parser = new DOMParser();
                    doc = parser.parseFromString(e.target.result, "text/xml");
                } 
                else 
                {
                    doc = new ActiveXObject("Microsoft.XMLDOM");
                    doc.async = "false";
                    doc.loadXML(e.target.result);
                }

                doc = parser.parseFromString(e.target.result, "application/xml");
                if(!doc || doc.documentElement.tagName != "gpx")
                {
                    alert("Invalid file.");
                    return false;
                }
                display(doc);
            }
            reader.onloadend = function(e) 
            {
                el.innerHTML = 'Drop your GPX files here';
            }
            
            reader.readAsText(f, 'UTF-8');
        }

    }

    // initialize
    function Init() 
    {
        var filedrag = document.getElementById("filedrag");
        filedrag.addEventListener("dragover", FileDragHover, false);
        filedrag.addEventListener("dragleave", FileDragHover, false);
        filedrag.addEventListener("drop", FileSelectHandler, false);
        filedrag.style.display = "block";
    }

    // call initialization file
    if (window.File && window.FileList && window.FileReader) 
    {
        Init();
    }
    else 
    {
        alert('Your browser doesn\'t support this feature, please upgrade it (or use Firefox or Chrome).');
    }

})();

window.onload = load;
