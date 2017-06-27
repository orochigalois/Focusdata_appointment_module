<?php
include_once ('class.SUCCESSFUL_FLAG_db.php');
class SUCCESSFUL_FLAG
{
	private $SUCCESSFUL_FLAG_db;


	public function __construct()
	{
		session_start ();
		$this->SUCCESSFUL_FLAG_db = new SUCCESSFUL_FLAG_db();
		
		$this->appointmentID = $_POST ['appointmentID'];


		$this->viewAll ();

	}




	public function viewAll()
	{

		$ret= $this->SUCCESSFUL_FLAG_db->viewAll ($this->appointmentID);
		$success = true;

		if($ret!=""){
			if($ret[0]["SUCCESSFUL_FLAG"]=="1")
			{
				$success = true;
			}
			else
			{
				$success = false;
			}
		}else{
			$success = false;
		}
		
		echo json_encode ( $success );
	}

}

$SUCCESSFUL_FLAG = new SUCCESSFUL_FLAG();
?>

