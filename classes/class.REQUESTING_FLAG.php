<?php
include_once ('class.REQUESTING_FLAG_db.php');
class REQUESTING_FLAG
{
	private $REQUESTING_FLAG_db;

	public function __construct()
	{

    

		session_start ();
		$this->REQUESTING_FLAG_db = new REQUESTING_FLAG_db();

        $this->appointmentID = $_POST ['appointmentID'];


        if (isset ( $_SESSION ['id'] ))
		{
			$this->customer_id = $_SESSION ['id'];
		}
		else
		{
			$this->customer_id = "";
		}


		

		$ret = $this->REQUESTING_FLAG_db->update($this->appointmentID,$this->customer_id);
        
		if($ret>0){
			$success = true;
		}else{
			$success = false;
		}
		
		$success = true;
			
		echo $success;

	}



}

$REQUESTING_FLAG = new REQUESTING_FLAG();
?>

