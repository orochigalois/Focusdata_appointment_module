<?php 
include_once('class.database.php');

class register_db{
    private $db;
    public function __construct(){  

    $this->db = new Database();
	
    }
    
    public function col_exists($where){
    	$ret = $this->db->col_exists('fd_customer_user','CUSTOMER_USER_MAIL="'.$where.'"');
    	return $ret;
    }

    
    
    public function create($arr_values){
    	
    	$ret = $this->db->insertData('fd_customer_user', $arr_values);
    	return $ret;
    }
    
    public function addtoPatient($arr_values_ap_patient){
    	 
    	 
    	$ret = $this->db->insertData('ap_patient', $arr_values_ap_patient);
    	return $ret;
    }

}
?>