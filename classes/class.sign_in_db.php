<?php 
include_once('class.database.php');

class sign_in_DB{
    private $db;
    public function __construct(){  

    $this->db = new Database();
	
    }
    
    public function getUserID($email,$password){
    	$sql = "SELECT CUSTOMER_USER_ID FROM fd_customer_user 
    			WHERE CUSTOMER_USER_MAIL='".$email."' and CUSTOMER_USER_PWD='".md5($password)."'";
    	$ret = $this->db->fetchAll_sql($sql,null);
    	
    	return $ret;

    }

    public function viewAll($email,$password){
        // print_r($arr_values);
        $table_name = "";
        $whereSql = "";
        
            $table_name = "fd_customer_user";
            $whereSql = "CUSTOMER_USER_MAIL = '".$email."' and CUSTOMER_USER_PWD = '".md5($password)."'";
        

        // echo "test:".$table_name;

        $sql = "SELECT COUNT(*) AS COUNT FROM ".$table_name." WHERE ".$whereSql;
        // echo $sql;
        $ret = $this->db->fetchAll_sql($sql,null);
        
        return $ret;
    }
}
?>