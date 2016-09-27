<?php 
include_once('class.database.php');

class patient_create_db{
    private $db;
    public function __construct(){  

    $this->db = new Database();
	
    }
    

    
    
    public function create($arr_values){
    	
    	
    	//update dob
    	foreach($arr_values as $k=>$v){
    		if($k == "dob"){
    			$date = str_replace('/', '-', $v);
    			$arr_values[$k] =date('Y-m-d', strtotime($date));
    		}
    	}
    
    
    	$ret = $this->db->insertData('ap_patient', $arr_values);
    	return $ret;
    }

}
?>