<?php

$fn = isset($_SERVER['HTTP_X_FILENAME']) ? $_SERVER['HTTP_X_FILENAME'] : false;

if ($fn) 
{
	$new_file = sprintf('upload/%d_%s.gpx', date('YmdHis'), uniqid());

	file_put_contents($new_file, file_get_contents('php://input'));

	$finfo = new finfo(FILEINFO_MIME_TYPE);

	if($finfo->file($new_file) == "application/xml")
	{
		echo json_encode(array('upload' => $new_file));
		exit();
	}
	else {
		@unlink($new_file);
		echo json_encode(array('error' => 'Invalid file'));
		exit();
	}
}
echo json_encode(array(false));
exit();