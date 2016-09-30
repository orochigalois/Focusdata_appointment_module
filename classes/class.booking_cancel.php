<?php
include_once ('class.booking_cancel_db.php');
class booking_cancel
{
	private $booking_cancel_db;
	private $arr_values_update1 = array();
	
	private $arr_values_update2 = array();


	public function __construct()
	{
		session_start ();
		$this->booking_cancel_db = new booking_cancel_db();

		
		//Step1. update fd_rel_customer_appointment
		
		$this->arr_values_update1['CUSTOMER_APPOINTMENT_ID']=$_POST['ID'];
		$this->arr_values_update1['APPOINTMENT_STATUS_ID']=2;
		if (isset ( $_SESSION ['id'] ))
		{
			$this->arr_values_update1["UPDATE_USER"] = $_SESSION ['user'];
		}
		else
		{
			$this->arr_values_update1["UPDATE_USER"] = "";
		}
		$this->arr_values_update1["UPDATE_DATE"] = date("Y-m-d H:i:s",time());
		
		
		$ret = $this->booking_cancel_db->update1($this->arr_values_update1);
		
		//Step2. update fd_rel_doctor_appointment_time
		
		//2.1 get DOCTOR_APPOINTMENT_TIME_ID from patient_id
		$DOCTOR_APPOINTMENT_TIME_ID = $this->booking_cancel_db->get_DOCTOR_APPOINTMENT_TIME_ID($_POST['ID']);
		
		$this->arr_values_update2['DOCTOR_APPOINTMENT_TIME_ID']=$DOCTOR_APPOINTMENT_TIME_ID;
		$this->arr_values_update2['ACTIVE_STATUS']=1;
		if (isset ( $_SESSION ['id'] ))
		{
			$this->arr_values_update2["UPDATE_USER"] = $_SESSION ['user'];
		}
		else
		{
			$this->arr_values_update2["UPDATE_USER"] = "";
		}
		$this->arr_values_update2["UPDATE_DATE"] = date("Y-m-d H:i:s",time());
		
		$ret = $this->booking_cancel_db->update2($this->arr_values_update2);
		
		
	}
	


	

}

$booking_cancel = new booking_cancel();
?>

