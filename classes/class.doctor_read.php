<?php
include_once ('class.doctor_read_db.php');
class doctor_read
{
	private $doctor_read_db;


	public function __construct()
	{
		session_start ();
		$this->doctor_read_db = new doctor_read_db();

		$this->viewAll ();
		
	}
	



	public function viewAll()
	{
		$response  = array();
			

		$ret= $this->doctor_read_db->viewAll ();
		
		$arrlength = count($ret);
		for($x = 0; $x < $arrlength; $x++) {

			$ret[$x]['doctor_code']=$ret[$x]['DOCTOR_ID'];
			$ret[$x]['picture']="/focusdata_code/".$ret[$x]['DOCTOR_PHOTO'];
			$ret[$x]['notice']="";
			$ret[$x]['name']=$ret[$x]['DOCTOR_NAME'];
			$ret[$x]['thumbnail']="/focusdata_code/".$ret[$x]['DOCTOR_PHOTO'];
			$ret[$x]['id']=$ret[$x]['DOCTOR_ID'];
			
			unset($ret[$x]['DOCTOR_ID']);
			unset($ret[$x]['DOCTOR_TYPE']);
			unset($ret[$x]['DOCTOR_NAME']);
			unset($ret[$x]['DOCTOR_GENDER']);
			unset($ret[$x]['ACTIVE_STATUS']);
			unset($ret[$x]['DOCTOR_PHOTO']);
			unset($ret[$x]['DOCTOR_INFO']);
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

$doctor_read = new doctor_read();
?>

