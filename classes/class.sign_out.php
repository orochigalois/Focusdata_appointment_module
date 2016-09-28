<?php

session_start ();

if (isset ( $_SESSION ['id'] ))
{
	unset($_SESSION ['id']);
	unset($_SESSION ['user']);
	unset($_SESSION['phone']);
	unset($_SESSION['name']);
	unset($_SESSION['email']);
}

?>

