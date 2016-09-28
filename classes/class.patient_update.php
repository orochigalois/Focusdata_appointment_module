<?php
include_once ('class.patient_update_db.php');
class patient_update
{
	private $patient_update_db;
	private $arr_values = array();


	public function __construct()
	{
		session_start ();
		$this->patient_update_db = new patient_update_db();

		
		if (isset ( $_POST ['form'] )){
			$this->arr_values = $_POST ['form'];
		}
		
		if (isset ( $_POST ['patientID'] )){
			$this->arr_values["patientID"] = $_POST ['patientID'];
		}
		

		if (isset ( $_SESSION ['user'] ))
		{
			$this->arr_values["UPDATE_USER"] = $_SESSION ['user'];
		}
		else
		{
			$this->arr_values["UPDATE_USER"] = "";
		}
		$this->arr_values["UPDATE_DATE"] = date("Y-m-d H:i:s",time());

		$this->update ();
		
	}
	public function update()
	{
		$success = true;

		$ret = $this->patient_update_db->update($this->arr_values);
	
		if($ret>0){
			$success = true;

		}else{
			$success = false;

		}
		echo $success;
	}
	




	

}

$patient_update = new patient_update();
?>

