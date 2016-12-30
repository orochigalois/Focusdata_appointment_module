<?php
include_once ('class.account_update_db.php');
class account_update
{
	private $account_update_db;
	private $arr_values = array();


	public function __construct()
	{
		session_start ();
		$this->account_update_db = new account_update_db();

		
		if (isset ( $_POST)){
			$_POST['CUSTOMER_FIRSTNAME'] = $_POST['name'];
			unset($_POST['name']);
			
			$_POST['CUSTOMER_PHONE_NO'] = $_POST['phone'];
			unset($_POST['phone']);
			
			$_POST['CUSTOMER_USER_MAIL'] = $_POST['email'];
			unset($_POST['email']);
			
			$this->arr_values = $_POST;
		}
		
		

		if (isset ( $_SESSION ['id'] ))
		{
			$this->arr_values["CUSTOMER_USER_ID"] = $_SESSION ['id'];
			$this->arr_values["UPDATE_USER"] = $_SESSION ['user'];
		}

		$this->arr_values["UPDATE_DATE"] = date("Y-m-d H:i:s",time());

		$this->update ();
		
	}
	public function update()
	{
		$response  = array();

		$ret = $this->account_update_db->update($this->arr_values);
	
		if($ret>0){
			$response['phone'] = $this->arr_values["CUSTOMER_PHONE_NO"];
			$response['name'] = $this->arr_values["CUSTOMER_FIRSTNAME"];
			$response['email'] = $this->arr_values["CUSTOMER_USER_MAIL"];

		}
		header('Content-Type: application/json');
		echo json_encode ( $response );
	}
	




	

}

$account_update = new account_update();
?>

