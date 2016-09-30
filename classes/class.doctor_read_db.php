<?php 
include_once('class.database.php');

class doctor_read_db{
    private $db;
    public function __construct(){  

    $this->db = new Database();
	
    }

    public function viewAll(){

        $sql = "SELECT * FROM fd_doctor where ACTIVE_STATUS=1";

        $ret = $this->db->fetchAll_sql($sql,null);
        
        return $ret;
    }
}
?>