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
		
		$success = true;


		$ret= $this->sign_in->viewAll ($this->email,$this->password);
		
		$count = $ret[0]["COUNT"];

		if($count == 1){
			
			$ID= $this->sign_in->getUserID ($this->email,$this->password);
			
			$_SESSION ['UserID'] = $ID[0]["CUSTOMER_USER_ID"];
			
			$success = true;

		}elseif($count == 0){
			$success = false;
			unset($_SESSION ['UserID']);

		}else{
			$success = false;

		}



		echo json_encode ( $success );
	}

}

$Sign_in = new Sign_in();
?>

