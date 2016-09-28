<?php

session_start ();
$response  = array();

if (isset ( $_SESSION ['id'] ))
{
	$response['phone'] = $_SESSION['phone'];
	$response['name'] = $_SESSION['name'];
	$response['email'] = $_SESSION['email'];
	$response['success'] =true;
}
else 
{
	$response['success'] =false;
}
header('Content-Type: application/json');
echo json_encode ( $response );

?>

