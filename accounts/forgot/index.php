<?php
include_once ('db.php');
// define _DBUG_LOG 1;
class forgotPWD
{
	private $forgotPWD;
	private $arr_values = array();
	private $request;
	private $_dbug;

	public function __construct()
	{
		session_start ();
		

		if (isset ( $_POST ['request'] )){
			$this->request = $_POST ['request'];
		}
		
		$abc=0;
		$abc++;



		/* $this->action = "";
		$this->action_type (); */
	}
	private function action_type()
	{
		switch ($this->action)
		{
			case 'create' :
				$this->create ();
				break;
			case 'save' :
				$this->save ();
				break;
			case 'update' :
				$this->update ();
				break;
			case 'remove' :
				$this->remove ();
				break;	
			default :
				$this->viewAll ();
				//$this->getDataTime();
				break;
		}
	}



	public function viewAll()
	{
		$response["response"]  = array();
		$success = true;
		$ret_msg = "";
		$ret_code = "S00000"; //鎴愬姛

		$ret = $this->qryDoctorAppTime->viewAll ($this->arr_values);
		
		if($ret!=""){
			$success = true;
			$ret_msg="鏌ヨ鎴愬姛";
			$ret_code = "S00000";
		}else{
			$success = true;
			$ret_msg="鏃犵鍚堟潯浠舵暟鎹�";
			$ret_code = "S00001";
		}

		$status  = array();
		$status["ret_msg"] = $ret_msg;	
		$status["ret_code"] = $ret_code;

		//鏈嶅姟鍣ㄦā寮廳ata
		// $data  = array();
		// $data["draw"] = $this->draw;
		// $data["recordsTotal"] = $records;
		// $data["recordsFiltered"] = $records;
		// $data["data"]=$ret["data"];
		
		// echo $ret;
		$response["response"] = $this->response_const();  //鍥哄畾鍙傛暟杩斿洖
		$response["response"]["success"] = $success;  //鍥哄畾鍙傛暟杩斿洖	
		$response["response"]["status"] = $status;  //鍥哄畾鍙傛暟杩斿洖	
		$response["response"]["meta"] = "";  //鍥哄畾鍙傛暟杩斿洖	
		$response["response"]["data"] = $ret;

		echo json_encode ( $response );
	}
}

$forgotPWD = new forgotPWD();
?>