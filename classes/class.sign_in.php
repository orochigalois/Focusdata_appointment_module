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


		$this->username = $_POST ['username'];
		$this->password = $_POST ['password'];

		$this->viewAll ();
		
	}
	



	public function viewAll()
	{
		
		$success = true;


		$ret= $this->sign_in->viewAll ($this->username,$this->password);
		
		$count = $ret[0]["COUNT"];

		if($count == 1){
			$success = true;

// 			$_SESSION ['fd_user_name'] = $this->arr_values["USER_NAME"];
// 			$_SESSION ['fd_user_pwd'] = $this->arr_values["USER_PWD"];
		}elseif($count == 0){
			$success = false;

		}else{
			$success = false;

		}



		echo json_encode ( $success );
	}

}

$Sign_in = new Sign_in();
?>

