<?php
  define('MAX_FILE_SIZE', (int) ini_get('upload_max_filesize') * 1024 * 1024);
  define('MAX_FILE_UPLOADS', (int) ini_get('max_file_uploads'));
  define('MAX_FILE_SIZE_INFO', ini_get('upload_max_filesize'));
?>
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
  <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
  <title>Geocaching GPX viewer</title>
  <link href="design.css" type="text/css" rel="stylesheet" />
  <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?v=3&amp;sensor=true"></script>
  <script type="text/javascript" src="js/infobox_packed.js"></script>
</head>

<body>
<form id="upload" action="upload.php" method="POST" enctype="multipart/form-data">  
    <input type="hidden" id="MAX_FILE_SIZE" name="MAX_FILE_SIZE" value="10485760" />  
    <div>  
        <input type="file" id="fileselect" name="fileselect[]" multiple="multiple" style="display: none;" />  
        <div id="filedrag">Drop your GPX files here 
          <br />
          <span>(max <?php echo MAX_FILE_SIZE_INFO; ?> per file, max <?php echo MAX_FILE_UPLOADS; ?> files)</span>
        </div>
    </div>
</form>
<p class="source"><a href="http://github.com/Surfoo/gc-gpx-viewer" onclick="window.open(this.href);return false;">Source on Github.com</a></p>
<p style="text-align: center;"><button id="fullscreen">Fullscreen</button></p>

<div id="map_canvas" style="width:100%; height:100%;"></div>


<script type="text/javascript" src="js/loadgpx.js"></script>
<script type="text/javascript" src="js/filedrag.js"></script>
</body>
</html>
