<?php
include_once ('class.sign_in_db.php');
class Sign_in
{
	private $sign_in;
	private $arr_values = array();


	public function __construct()
	{
		session_start ();
		$this->sign_in = new Sign_in_DB();


		$this->email = $_POST ['username'];
		$this->password = $_POST ['password'];

		$this->viewAll ();
		
	}
	



	public function viewAll()
	{
		

		
		$response  = array();


		$ret= $this->sign_in->viewAll ($this->email,$this->password);
		
		$count = $ret[0]["COUNT"];

		if($count == 1){
			
			$ID= $this->sign_in->getUserID ($this->email,$this->password);
			
			$_SESSION ['id'] = $ID[0]["CUSTOMER_USER_ID"];
			$_SESSION ['user'] = $ID[0]["CUSTOMER_USER_MAIL"];
			$_SESSION['phone'] = $ID[0]["CUSTOMER_PHONE_NO"];
			$_SESSION['name'] = $ID[0]["CUSTOMER_FIRSTNAME"];
			$_SESSION['email'] = $ID[0]["CUSTOMER_USER_MAIL"];
			
			$response['phone'] = $ID[0]["CUSTOMER_PHONE_NO"];
			$response['name'] = $ID[0]["CUSTOMER_FIRSTNAME"];
			$response['success'] =true;


		}elseif($count == 0){
			$response['success'] =false;
			unset($_SESSION ['id']);
			unset($_SESSION ['user']);
			unset($_SESSION ['phone']);
			unset($_SESSION ['name']);
			unset($_SESSION ['email']);

		}else{
			$response['success'] =false;
			unset($_SESSION ['id']);
			unset($_SESSION ['user']);
			unset($_SESSION ['phone']);
			unset($_SESSION ['name']);
			unset($_SESSION ['email']);

		}



		header('Content-Type: application/json');
		echo json_encode ( $response );
	}

}

$Sign_in = new Sign_in();
?>

