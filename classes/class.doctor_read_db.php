<?php 
include_once('class.database.php');

class doctor_read_db{
    private $db;
    public function __construct(){  

    $this->db = new Database();
	
    }

    public function viewAll(){

        $sql = "SELECT * FROM fd_doctor a left join `fd_rel_clinic_doctor` b on a.DOCTOR_ID=b.DOCTOR_ID left join `fd_clinic_user` c on b.CLINIC_USER_ID=c.CLINIC_USER_ID where a.ACTIVE_STATUS=1 and c.IS_YELLOWPAGE=0";

        $ret = $this->db->fetchAll_sql($sql,null);
        
        return $ret;
    }
}
?>