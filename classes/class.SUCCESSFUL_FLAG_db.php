<?php
include_once('class.database.php');

class SUCCESSFUL_FLAG_db{
	private $db;
	public function __construct(){

		$this->db = new Database();

	}

	public function viewAll($appointmentID){
		
		$sql = "SELECT * FROM `fd_rel_doctor_appointment_time` WHERE `DOCTOR_APPOINTMENT_TIME_ID` = ".$appointmentID;

		$ret = $this->db->fetchAll_sql($sql,null);

		return $ret;
	}
}
?>