<?php 
include_once('class.database.php');

class booking_read_db{
    private $db;
    public function __construct(){  

    $this->db = new Database();
	
    }

    public function viewAll(){

        $sql = "SELECT t1.DOCTOR_ID,t2.CUSTOMER_NAME,t3.APPOINTMENT_DATE,t3.APPOINTMENT_TIME,t4.APPOINTMENT_STATUS,t1.CUSTOMER_APPOINTMENT_ID FROM `fd_rel_customer_appointment` t1 left join `fd_customer_user` t2 on t1.`CUSTOMER_USER_ID`=t2.`CUSTOMER_USER_ID` left join `fd_rel_doctor_appointment_time` t3 on t1.`DOCTOR_APPOINTMENT_TIME_ID`= t3.`DOCTOR_APPOINTMENT_TIME_ID` left join `fd_dict_appointment_status` t4 on t1.APPOINTMENT_STATUS_ID=t4.APPOINTMENT_STATUS_ID";

        $ret = $this->db->fetchAll_sql($sql,null);
        
        return $ret;
    }
}
?>