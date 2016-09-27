<?php 
include_once('class.database.php');

class patient_update_db{
    private $db;
    public function __construct(){  

    $this->db = new Database();
	
    }
    
    
    public function update($arr_values){


    	$where =" id = ".$arr_values['patientID'];
    	unset($arr_values["patientID"]);
    	
    	//update dob
    	foreach($arr_values as $k=>$v){
    		if($k == "dob"){
    			$date = str_replace('/', '-', $v);
    			$arr_values[$k] =date('Y-m-d', strtotime($date));
    		}
    	}
    

    	$ret = $this->db->updateData('ap_patient', $arr_values, $where);
    	return $ret;
    }

}
?>