<?php
include_once ('class.patient_create_db.php');
class patient_create
{
	private $patient_create_db;
	private $arr_values = array();


	public function __construct()
	{
		session_start ();
		$this->patient_create_db = new patient_create_db();


		if (isset ( $_POST ['form'] )){
			$this->arr_values = $_POST ['form'];
		}
		

		if (isset ( $_SESSION ['id'] ))
		{
			$this->arr_values["CUSTOMER_USER_ID"]=$_SESSION ['id'];
			$this->arr_values["CREATE_USER"] = $_SESSION ['user'];
		}
		else
		{
			$this->arr_values["CUSTOMER_USER_ID"]="";
			$this->arr_values["CREATE_USER"] = "";
		}
		
		$this->arr_values["CREATE_DATE"] = date("Y-m-d H:i:s",time());

		$this->create ();
		
	}
	public function create()
	{
		$success = true;

		$ret = $this->patient_create_db->create($this->arr_values);
	
		if($ret>0){
			$success = true;

		}else{
			$success = false;

		}
		echo $success;
	}



	

}

$patient_create = new patient_create();
?>

