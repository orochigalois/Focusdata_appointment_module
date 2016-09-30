<?php
include_once ('class.booking_read_db.php');
class booking_read
{
	private $booking_read_db;


	public function __construct()
	{
		session_start ();
		$this->booking_read_db = new booking_read_db();

		$this->viewAll ();
		
	}
	



	public function viewAll()
	{
		$response  = array();
			

		$ret= $this->booking_read_db->viewAll ();
		
		$arrlength = count($ret);
		for($x = 0; $x < $arrlength; $x++) {

			$ret[$x]['doctor_code']=$ret[$x]['DOCTOR_ID'];
			$ret[$x]['first_name']=$ret[$x]['CUSTOMER_NAME'];
			$ret[$x]['last_name']=$ret[$x]['CUSTOMER_NAME'];
			$ret[$x]['full_name']=$ret[$x]['CUSTOMER_NAME'];
			$ret[$x]['title']=$ret[$x]['CUSTOMER_NAME'];
			$ret[$x]['date']=$ret[$x]['APPOINTMENT_DATE'].' '.$ret[$x]['APPOINTMENT_TIME'];
			$ret[$x]['clinic']=1;
			$ret[$x]['arrived']=false;
			$ret[$x]['action_type']=$ret[$x]['APPOINTMENT_STATUS'];
			$ret[$x]['action']=$ret[$x]['APPOINTMENT_STATUS'];
			
// 			$ret[$x]['action_type']='create';
// 			$ret[$x]['action']='Pending';
			
			
			$ret[$x]['id']=$ret[$x]['CUSTOMER_APPOINTMENT_ID'];

			
			unset($ret[$x]['DOCTOR_ID']);
			unset($ret[$x]['CUSTOMER_NAME']);
			unset($ret[$x]['APPOINTMENT_DATE']);
			unset($ret[$x]['APPOINTMENT_TIME']);
			unset($ret[$x]['APPOINTMENT_STATUS_ID']);
			unset($ret[$x]['CUSTOMER_APPOINTMENT_ID']);
			
		}
		
		

		

		$response["meta"] = "";
		$response["objects"] = $ret;
		


		header('Content-Type: application/json');
		echo json_encode ( $response);
	}

}

$booking_read = new booking_read();
?>

