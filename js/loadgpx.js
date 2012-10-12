function displayCaches(data) 
{
    var waypoints = data.documentElement.getElementsByTagName("wpt");
    if(waypoints.length == 0)
    {
      alert('No waypoints found.');
      return false;
    }

    var icon, type, wpt_data, sym, latlng, Oicon, oMarker, infoContent, InfoBoxOptions, ibLabel, i = 0, nb = waypoints.length;
    var oInfo  = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    for (i; i < nb; i++) 
    {
        wpt_data = waypoints[i];
        sym = wpt_data.getElementsByTagName('sym')[0].childNodes[0] || false;
        if(sym && (sym.nodeValue != "Geocache" && 
                   sym.nodeValue != "Geocache Found" && 
                   sym.nodeValue != "") )
        {
          continue;
        }
        
        type = wpt_data.getElementsByTagName('type')[0].childNodes[0].nodeValue.substr(9);
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

        latlng = new google.maps.LatLng(parseFloat(wpt_data.getAttribute("lat")),
                                            parseFloat(wpt_data.getAttribute("lon")));

        Oicon  = new google.maps.MarkerImage("img/" + icon, null, null, null, new google.maps.Size(16, 16));
        
        infoContent = '<div>' +
                            '<h5><img src="img/' + icon + '" alt="" width="16" height="16" style="vertical-align:middle;" /> ' +
                            '<a href="http://coord.info/' + wpt_data.getElementsByTagName('urlname')[0].childNodes[0].nodeValue + '" onclick="window.open(this.href);return false;">' + 
                            wpt_data.getElementsByTagName('urlname')[0].childNodes[0].nodeValue + '</a></h5>'+
                            '<p>' + wpt_data.getElementsByTagName('name')[0].childNodes[0].nodeValue + '</p>'+
                            '</div>'; 

        oMarker = new google.maps.Marker({
                             position: latlng,
                             icon: Oicon,
                             title: wpt_data.getElementsByTagName('desc')[0].childNodes[0].nodeValue,
                             draggable: false,
                             raiseOnDrag: true,
                             map: map
        });

        setEventMarker(oMarker, oInfo, infoContent);

        InfoBoxOptions = {
          content: wpt_data.getElementsByTagName('name')[0].childNodes[0].nodeValue,
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
                displayCaches(doc);
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
