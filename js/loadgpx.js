function createXmlHttpRequest() 
{
 try {
   if (typeof ActiveXObject != 'undefined') {
     return new ActiveXObject('Microsoft.XMLHTTP');
   } else if (window["XMLHttpRequest"]) {
     return new XMLHttpRequest();
   }
 } catch (e) {
   changeStatus(e);
 }
 return null;
};


function downloadGpx(url)
{
  var response = downloadUrl(url);
  console.log(response);
  if(response)
  {
    displayCaches(response.responseXML);
  }
}

function downloadGpx(url) 
{
    var status = -1;
    var request = createXmlHttpRequest();
    if (!request) {
        return false;
    }

    request.onreadystatechange = function() {
      if (request.readyState == 4) {
          try {
            status = request.status;
          } catch (e) {
          }
          if(status == 200) 
          {
            displayCaches(request.responseXML);
          }
      }
    }
    request.open('GET', url, true);
    try {
       request.send(null);
    } catch (e) {
       changeStatus(e);
    }
}

/*
function validateXML(data, xml, tmp) 
{
  if (window.DOMParser) { // Standard
    tmp = new DOMParser();
    xml = tmp.parseFromString(data, "text/xml");
  } 
  else { // IE
    xml = new ActiveXObject("Microsoft.XMLDOM");
    xml.async = "false";
    xml.loadXML(data);
  }

  tmp = xml.documentElement;

  if ( !tmp || !tmp.nodeName || tmp.nodeName == "parsererror") {
    alert( "Invalid XML: " + data );
    return false;
  }

  return true;
}
*/

function displayCaches(data) 
{
    var waypoints = data.documentElement.getElementsByTagName("wpt");
    if(waypoints.length == 0)
    {
      alert('No waypoints found.');
      return false;
    }

    var oMap, oMarker, oInfo;
    var i, contentString, nb = waypoints.length;
    var oInfo = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < nb; i++) 
    {
        var wpt_data = waypoints[i];
        var sym = wpt_data.getElementsByTagName('sym')[0].childNodes[0] || false;
        if(sym && (sym.nodeValue.substr(9) != "Geocache" && 
                   sym.nodeValue.substr(9) != "Geocache Found" && 
                   sym.nodeValue.substr(9) != "") )
        {
          continue;
        }
        
        var type = wpt_data.getElementsByTagName('type')[0].childNodes[0].nodeValue.substr(9);
        switch(type){
          case "Unknown Cache":
            var icon = 'mystery.gif';
            break;
          case "Traditional Cache":
            var icon = 'traditional.gif';
            break;
          case "Multi-cache":
            var icon = 'multi.gif';
            break;
          case "Wherigo Cache":
            var icon = 'wherigo.gif';
            break;
          case "Event Cache":
            var icon = 'event.gif';
            break;
          case "Virtual Cache":
            var icon = 'virtual.gif';
            break;
          case "Earthcache":
            var icon = 'earthcache.gif';
            break;
          case "Letterbox Hybrid":
            var icon = 'letterbox.gif';
            break;
          case "Webcam Cache":
            var icon = 'webcam.gif';
            break;
          default:
            continue;
        }

        var latlng = new google.maps.LatLng(parseFloat(wpt_data.getAttribute("lat")),
                                            parseFloat(wpt_data.getAttribute("lon")));

        var Oicon  = new google.maps.MarkerImage("img/" + icon, null, null, null, new google.maps.Size(16, 16));
        
        contentString = '<div>' +
                            '<h5><img src="img/' + icon + '" alt="" width="16" height="16" style="vertical-align:middle;" /> ' +
                            '<a href="http://coord.info/' + wpt_data.getElementsByTagName('name')[0].childNodes[0].nodeValue + '" onclick="window.open(this.href);return false;">' + 
                            wpt_data.getElementsByTagName('desc')[0].childNodes[0].nodeValue + '</a></h5>'+
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

        setEventMarker(oMarker, oInfo, contentString);

        var myOptions = {
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
        var ibLabel = new InfoBox(myOptions);
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
              alert('Votre navigateur ne supporte pas le mode plein écran, il est temps de passer à un plus récent ;)');
            }
        }, false);
    }

    var myLatlng = new google.maps.LatLng(48.85693,2.3412);
    var myOptions = {
      zoom: 12,
      center: myLatlng,
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
function enterFullscreen(element) {
    if(element.requestFullScreen) {
      element.requestFullScreen();
    } 
    else if(element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } 
    else if(element.mozRequestFullScreen){
      element.mozRequestFullScreen();
    } 
    else {
      alert('Votre navigateur ne supporte pas le mode plein écran, il est temps de passer à un plus récent ;)');
    }
}
function exitFullscreen() {
    if(document.cancelFullScreen) {
            //fonction officielle du w3c
            document.cancelFullScreen();
    } else if(document.webkitCancelFullScreen) {
            //fonction pour Google Chrome
            document.webkitCancelFullScreen();
    } else if(document.mozCancelFullScreen){
            //fonction pour Firefox
            document.mozCancelFullScreen();
    }
}*/
window.onload = load;
