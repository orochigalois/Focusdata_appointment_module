<?php
include_once ('class.patient_read_db.php');
class patient_read
{
	private $patient_read_db;


	public function __construct()
	{
		session_start ();
		$this->patient_read_db = new patient_read_db();


		$this->ID = $_SESSION ['id'];
		

		$this->viewAll ();
		
	}
	



	public function viewAll()
	{
		$response  = array();
	

		$ret= $this->patient_read_db->viewAll ($this->ID);
		

		$response["meta"] = "";
		$response["objects"] = $ret;


		header('Content-Type: application/json');
		echo json_encode ( $response);
	}

}

$patient_read = new patient_read();
?>

