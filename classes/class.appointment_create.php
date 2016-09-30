<?php
include_once ('class.appointment_create_db.php');
class appointment_create
{
	private $appointment_create_db;
	private $arr_values = array();
	
	private $arr_values_update = array();


	public function __construct()
	{
		session_start ();
		$this->appointment_create_db = new appointment_create_db();

		
		//Step1. add a record to fd_rel_customer_appointment
		
		//1.1 get CUSTOMER_USER_ID from patient_id
		$CUSTOMER_USER_ID = $this->appointment_create_db->get_CUSTOMER_USER_ID($_POST ['DATA']['patient_id']);
		
		//1.2 get DOCTOR_ID from fd_rel_doctor_appointment_time
		$DOCTOR_ID = $this->appointment_create_db->get_DOCTOR_ID($_POST ['appointmentID']);
		
		$this->arr_values["CUSTOMER_USER_ID"]=$CUSTOMER_USER_ID;
		$this->arr_values["DOCTOR_ID"]=$DOCTOR_ID;
		$this->arr_values["DOCTOR_APPOINTMENT_TIME_ID"]=$_POST ['appointmentID'];
		$this->arr_values["APPOINTMENT_STATUS_ID"]=1;
		$this->arr_values["NOTE"]="";
		
		
		if (isset ( $_SESSION ['id'] ))
		{
			$this->arr_values["CREATE_USER"] = $_SESSION ['user'];
		}
		else
		{
			$this->arr_values["CREATE_USER"] = "";
		}
		$this->arr_values["CREATE_DATE"] = date("Y-m-d H:i:s",time());
			
		$ret = $this->appointment_create_db->create($this->arr_values);
		
		
		//Step2. update fd_rel_doctor_appointment_time
		$this->arr_values_update['DOCTOR_APPOINTMENT_TIME_ID']=$_POST ['appointmentID'];
		$this->arr_values_update['ACTIVE_STATUS']=0;
		
		
		if (isset ( $_SESSION ['id'] ))
		{
			$this->arr_values_update["UPDATE_USER"] = $_SESSION ['user'];
		}
		else
		{
			$this->arr_values_update["UPDATE_USER"] = "";
		}
		$this->arr_values_update["UPDATE_DATE"] = date("Y-m-d H:i:s",time());
		
		
		$ret = $this->appointment_create_db->update($this->arr_values_update);

		
	}
	


	

}

$appointment_create = new appointment_create();
?>

