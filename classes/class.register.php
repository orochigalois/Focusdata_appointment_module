<?php
include_once ('class.register_db.php');
header('Content-Type: application/json');
class register
{
	private $register_db;
	private $arr_values = array();
	
	private $arr_values_ap_patient = array();


	public function __construct()
	{
		session_start ();
		$this->register_db = new register_db();
		
		
		
		if (isset ( $_POST ['form'] )){
			$this->arr_values = $_POST ['form'];
			$this->arr_values_ap_patient = $_POST ['form'];
		}
		
		//prepare for fd_customer_user
		
		$this->arr_values['CUSTOMER_USER_PWD']=md5($this->arr_values['password']);
		
		$this->arr_values['CUSTOMER_USER_MAIL']=$this->arr_values['email'];
		$this->arr_values['CUSTOMER_FIRSTNAME']=$this->arr_values['first_name'];
		$this->arr_values['CUSTOMER_LASTNAME']=$this->arr_values['last_name'];
		if($this->arr_values['gender']=="M")
			$this->arr_values['GENDER_ID']="0";
		else
			$this->arr_values['GENDER_ID']="1";
		
		$date = str_replace('/', '-', $this->arr_values['dob']);
		$this->arr_values['CUSTOMER_BIRTHDAY'] =date('Y-m-d', strtotime($date));

		$this->arr_values['CUSTOMER_PHONE_NO']=$this->arr_values['phone_mobile'];
		$this->arr_values['MEDICAL_CARD_NO']=$this->arr_values['medicare_no'];
		
		
		if($this->arr_values['title']=="Mr")
			$this->arr_values['TITLE_ID']="0";
		else if($this->arr_values['title']=="Mrs")
			$this->arr_values['TITLE_ID']="1";
		else if($this->arr_values['title']=="Ms")
			$this->arr_values['TITLE_ID']="2";
		else if($this->arr_values['title']=="Miss")
			$this->arr_values['TITLE_ID']="3";
		else if($this->arr_values['title']=="Master")
			$this->arr_values['TITLE_ID']="4";
		else if($this->arr_values['title']=="Dr")
			$this->arr_values['TITLE_ID']="5";
		else{}
			
		
		unset($this->arr_values['title']);
		unset($this->arr_values['first_name']);
		unset($this->arr_values['last_name']);
		unset($this->arr_values['gender']);
		unset($this->arr_values['dob']);
		unset($this->arr_values['phone_mobile']);
		unset($this->arr_values['medicare_no']);
		unset($this->arr_values['medicare_ref']);
		unset($this->arr_values['email']);
		unset($this->arr_values['email1']);
		unset($this->arr_values['password']);
		
		$this->arr_values["STATE_ID"]=1;
		$this->arr_values["CREATE_USER"] = $this->arr_values['CUSTOMER_USER_MAIL'];
		$this->arr_values["CREATE_DATE"] = date("Y-m-d H:i:s",time());


		$this->create ();
		
	}
	public function create()
	{
		
		$response  = array();
		$response['success'] =true;
		
		if($this->register_db->col_exists($this->arr_values["CUSTOMER_USER_MAIL"]))
		{
			$response['success'] =false;
			echo json_encode ( $response );
			return;
		}

		$lastID = $this->register_db->create($this->arr_values);
	
		//auto login
		if($lastID>0){
			
			//auto login
			$_SESSION ['id'] = $lastID;
			$_SESSION ['user'] = $this->arr_values['CUSTOMER_USER_MAIL'];
			$_SESSION['phone'] = $this->arr_values["CUSTOMER_PHONE_NO"];
			$_SESSION['name'] = $this->arr_values["CUSTOMER_FIRSTNAME"];
			$_SESSION['email'] = $this->arr_values["CUSTOMER_USER_MAIL"];
			
			//auto add myself to ap_patient

			$this->arr_values_ap_patient['CUSTOMER_USER_ID']= $_SESSION ['id'];
			unset($this->arr_values_ap_patient['email1']);
			unset($this->arr_values_ap_patient['password']);
			$this->arr_values_ap_patient["CREATE_USER"] = $_SESSION ['user'];
			$this->arr_values_ap_patient["CREATE_DATE"] = date("Y-m-d H:i:s",time());
			
			$this->register_db->addtoPatient($this->arr_values_ap_patient);
				
			$response['success'] =true;

		}else{
			$response['success'] =false;

		}
		echo json_encode ( $response );
	}



	

}

$register = new register();
?>

