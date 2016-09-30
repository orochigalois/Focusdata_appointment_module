<?php 
include_once('class.database.php');

class appointment_read_db{
    private $db;
    public function __construct(){  

    $this->db = new Database();
	
    }

    public function viewAll(){

        $sql = "SELECT * FROM fd_rel_doctor_appointment_time WHERE ACTIVE_STATUS=1";

        $ret = $this->db->fetchAll_sql($sql,null);
        
        return $ret;
    }
}
?>