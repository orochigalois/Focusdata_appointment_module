<?php 
include_once('class.database.php');

class booking_cancel_db{
    private $db;
    public function __construct(){  

    $this->db = new Database();
	
    }
    
    public function get_DOCTOR_APPOINTMENT_TIME_ID($ID){
    	$sql = "SELECT * FROM fd_rel_customer_appointment WHERE CUSTOMER_APPOINTMENT_ID=".$ID;
    	 
    	$ret = $this->db->fetchAll_sql($sql,null);
    	 
    	return $ret[0]['DOCTOR_APPOINTMENT_TIME_ID'];
    }

    
    public function update1($arr_values){
    

    	$where =" CUSTOMER_APPOINTMENT_ID = ".$arr_values['CUSTOMER_APPOINTMENT_ID'];
    	unset($arr_values["CUSTOMER_APPOINTMENT_ID"]);
    	 
    	$ret = $this->db->updateData('fd_rel_customer_appointment', $arr_values, $where);
    	return $ret;
    }
    
    public function update2($arr_values){
    
    
    	$where =" DOCTOR_APPOINTMENT_TIME_ID = ".$arr_values['DOCTOR_APPOINTMENT_TIME_ID'];
    	unset($arr_values["DOCTOR_APPOINTMENT_TIME_ID"]);
    
    	$ret = $this->db->updateData('fd_rel_doctor_appointment_time', $arr_values, $where);
    	return $ret;
    }

}
?>