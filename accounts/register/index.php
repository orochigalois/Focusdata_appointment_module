<?php
include_once ('db.php');
// define _DBUG_LOG 1;
class register
{
	private $register;
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
		$ret_code = "S00000"; //閹存劕濮�

		$ret = $this->qryDoctorAppTime->viewAll ($this->arr_values);
		
		if($ret!=""){
			$success = true;
			$ret_msg="閺屻儴顕楅幋鎰";
			$ret_code = "S00000";
		}else{
			$success = true;
			$ret_msg="閺冪姷顑侀崥鍫熸蒋娴犺埖鏆熼幑锟�";
			$ret_code = "S00001";
		}

		$status  = array();
		$status["ret_msg"] = $ret_msg;	
		$status["ret_code"] = $ret_code;

		//閺堝秴濮熼崳銊δ佸寤砤ta
		// $data  = array();
		// $data["draw"] = $this->draw;
		// $data["recordsTotal"] = $records;
		// $data["recordsFiltered"] = $records;
		// $data["data"]=$ret["data"];
		
		// echo $ret;
		$response["response"] = $this->response_const();  //閸ュ搫鐣鹃崣鍌涙殶鏉╂柨娲�
		$response["response"]["success"] = $success;  //閸ュ搫鐣鹃崣鍌涙殶鏉╂柨娲�	
		$response["response"]["status"] = $status;  //閸ュ搫鐣鹃崣鍌涙殶鏉╂柨娲�	
		$response["response"]["meta"] = "";  //閸ュ搫鐣鹃崣鍌涙殶鏉╂柨娲�	
		$response["response"]["data"] = $ret;

		echo json_encode ( $response );
	}
}

$register = new register();
?>