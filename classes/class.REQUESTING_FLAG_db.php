<?php 
include_once('class.database.php');

class REQUESTING_FLAG_db{
    private $db;
    public function __construct(){  

    $this->db = new Database();
	
    }
    

    
    
    public function update($appID,$customerID){
    
        $where ="`REQUESTING_FLAG`= 0 and `DOCTOR_APPOINTMENT_TIME_ID` = ".$appID." and `ACTIVE_STATUS`=1";
    
    	
    	$arr=array();
    	$arr["REQUESTING_FLAG"]=1;
    	$arr["REQUESTING_USER_ID"]=$customerID;
    
    
    	$ret = $this->db->updateData('fd_rel_doctor_appointment_time', $arr, $where);
    	return $ret;
    }
    


}
?>