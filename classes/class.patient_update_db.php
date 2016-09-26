<?php 
include_once('class.database.php');

class patient_update_db{
    private $db;
    public function __construct(){  

    $this->db = new Database();
	
    }

    public function viewAll($ID){

        $sql = "SELECT * FROM ap_patient WHERE CUSTOMER_USER_ID='".$ID."'";

        $ret = $this->db->fetchAll_sql($sql,null);
        
        return $ret;
    }
}
?>