<?php 
include_once('class.database.php');

class account_update_db{
    private $db;
    public function __construct(){  

    $this->db = new Database();
	
    }
    
    
    public function update($arr_values){


    	$where =" CUSTOMER_USER_ID = ".$arr_values['CUSTOMER_USER_ID'];
    	unset($arr_values["CUSTOMER_USER_ID"]);
    	

    	$ret = $this->db->updateData('fd_customer_user', $arr_values, $where);
    	return $ret;
    }

}
?>