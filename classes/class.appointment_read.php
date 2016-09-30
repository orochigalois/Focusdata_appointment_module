<?php
include_once ('class.appointment_read_db.php');
class appointment_read
{
	private $appointment_read_db;


	public function __construct()
	{
		session_start ();
		$this->appointment_read_db = new appointment_read_db();

		$this->viewAll ();
		
	}
	



	public function viewAll()
	{
		$response  = array();
			

		$ret= $this->appointment_read_db->viewAll ();
		
		$arrlength = count($ret);
		for($x = 0; $x < $arrlength; $x++) {

			$ret[$x]['doctor']=$ret[$x]['DOCTOR_ID'];
			$ret[$x]['clinic_display_name']="宝芝林";//Eastbound Family Practice
			$ret[$x]['clinic_id']="1";
			$ret[$x]['duration']="15";
			$ret[$x]['clinic']="宝芝林";
			$ret[$x]['date']=$ret[$x]['APPOINTMENT_DATE'].' '.$ret[$x]['APPOINTMENT_TIME'];
			$ret[$x]['id']=$ret[$x]['DOCTOR_APPOINTMENT_TIME_ID'];
			
			unset($ret[$x]['DOCTOR_APPOINTMENT_TIME_ID']);
			unset($ret[$x]['DOCTOR_ID']);
			unset($ret[$x]['APPOINTMENT_DATE']);
			unset($ret[$x]['APPOINTMENT_TIME']);
			unset($ret[$x]['ACTIVE_STATUS']);
			unset($ret[$x]['NOTE']);
			unset($ret[$x]['CREATE_USER']);
			unset($ret[$x]['CREATE_DATE']);
			unset($ret[$x]['UPDATE_USER']);
			unset($ret[$x]['UPDATE_DATE']);
		}
		
		

		$response["meta"] = "";
		$response["objects"] = $ret;
		


		header('Content-Type: application/json');
		echo json_encode ( $response);
	}

}

$appointment_read = new appointment_read();
?>

