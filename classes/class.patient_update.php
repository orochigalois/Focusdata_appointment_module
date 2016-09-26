<?php
include_once ('class.patient_update_db.php');
class patient_update
{
	private $patient_update_db;


	public function __construct()
	{
		session_start ();
		$this->patient_update_db = new patient_update_db();


		$this->ID = $_SESSION ['UserID'];
		

		$this->viewAll ();
		
	}
	



	public function viewAll()
	{
		$response  = array();
	

		$ret= $this->patient_update_db->viewAll ($this->ID);
		

		$response["meta"] = "";
		$response["objects"] = $ret;


		header('Content-Type: application/json');
		echo json_encode ( $response);
	}

}

$patient_update = new patient_update();
?>

