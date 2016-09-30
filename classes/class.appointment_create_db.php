<?php 
include_once('class.database.php');

class appointment_create_db{
    private $db;
    public function __construct(){  

    $this->db = new Database();
	
    }
    
    public function get_DOCTOR_ID($appointmentID){
    	$sql = "SELECT * FROM fd_rel_doctor_appointment_time WHERE DOCTOR_APPOINTMENT_TIME_ID=".$appointmentID;
    	 
    	$ret = $this->db->fetchAll_sql($sql,null);
    	 
    	return $ret[0]['DOCTOR_ID'];
    }

    public function get_CUSTOMER_USER_ID($patient_id){
    	$sql = "SELECT * FROM ap_patient WHERE id=".$patient_id;
    	
    	$ret = $this->db->fetchAll_sql($sql,null);
    	
    	return $ret[0]['CUSTOMER_USER_ID'];
    }
    
    public function create($arr_values){
    
    	$ret = $this->db->insertData('fd_rel_customer_appointment', $arr_values);
    	return $ret;
    }
    
    public function update($arr_values){
    

    	$where =" DOCTOR_APPOINTMENT_TIME_ID = ".$arr_values['DOCTOR_APPOINTMENT_TIME_ID'];
    	unset($arr_values["DOCTOR_APPOINTMENT_TIME_ID"]);
    	 
    	$ret = $this->db->updateData('fd_rel_doctor_appointment_time', $arr_values, $where);
    	return $ret;
    }

}
?>