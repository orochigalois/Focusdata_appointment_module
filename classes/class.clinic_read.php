<?php
//include_once ('class.clinic_read_db.php');
header('Content-Type: application/json');
class clinic_read
{
	//private $clinic_read_db;


	public function __construct()
	{
		session_start ();
		//$this->clinic_read_db = new clinic_read_db();


		

		$this->viewAll ();
		
	}
	



	public function viewAll()
	{
		$response  = array();
	

		//$ret= $this->clinic_read_db->viewAll ($this->ID);
		

		$response["meta"] = "";
		$response["objects"] = array();
		
		$response["objects"][0]['has_long_appointment_new']=false;
		$response["objects"][0]['privacy_policy_validation_message']="We cannot complete your booking until you indicate that you have read and agree to the terms of our Privacy Policy. If you do not agree to these terms and wish to progress with your booking, please call our reception on (03) 9579 3522.";
		$response["objects"][0]['enabled']=true;
		$response["objects"][0]['preferred_name']="";
		$response["objects"][0]['has_extended_registration']=false;
		$response["objects"][0]['has_expired_medicare_card']=false;
		$response["objects"][0]['id']=1;
		$response["objects"][0]['display_name']="Focusdata Clinic";
		$response["objects"][0]['has_medicare_demographic']=false;
		$response["objects"][0]['privacy_policy_confirmation_message']="I have read the Eastbound Family Practice Privacy Policy and agree to the handling of my personal information as outlined above and in the Eastbound Family Practice Privacy Policy.";
		$response["objects"][0]['has_inclinic_checkin_demographics']=false;
		$response["objects"][0]['new_patient_default_appointment_type']=null;
		$response["objects"][0]['has_appointment_types']=false;
		$response["objects"][0]['checkin_mins_early']=120;
		$response["objects"][0]['latitude']=0;
		$response["objects"][0]['email']="";
		$response["objects"][0]['practitioner_title']="Doctor";
		$response["objects"][0]['notice']="";
		$response["objects"][0]['privacy_policy']="<p>USE AND DISCLOSURE OF INFORMATION COLLECTED</p> <p>Eastbound Family Practice will not disclose information about your individual visits to our website or any of the personal information that you provide such as your name, address, telephone number, e-mail address or credit/debit card details to any outside parties without your consent except when required by law to do so.</p> <p>Eastbound Family Practice will only record your e-mail address if you send us a message. Your e-mail address will only be used or disclosed for the purpose for which you have provided it and it will not be added to a mailing list or used or disclosed for any other purpose without your consent unless you specifically request such action.</p> <p>Users are advised that there are inherent risks transmitting information across the internet.</p> <p>LINKS TO OTHER SITES</p> <p>Eastbound Family Practice may offer links to sites that are not operated or managed by Eastbound Family Practice. If you visit one of these inked sites, you should review their privacy and other policies. We are not responsible for the policies and practices of other companies.</p> <p>If you require further information, please contact Eastbound Family Practice on (03) 9579 3522.</p>";
		$response["objects"][0]['has_address_demographic']=false;
		$response["objects"][0]['has_contact_demographic']=false;
		$response["objects"][0]['phone']="(03) 1234 5678";
		$response["objects"][0]['has_inclinic_checkin']=false;
		$response["objects"][0]['address']="1 Whitehorse Road, Box Hill";
		$response["objects"][0]['name']="Focusdata Clinic";
		$response["objects"][0]['suburb']="Box Hill";
		$response["objects"][0]['url']="https://www.google.com";
		$response["objects"][0]['checkin_mins_late']=120;
		$response["objects"][0]['send_sms']=true;
		$response["objects"][0]['longitude']=0;
		$response["objects"][0]['has_nok_demographic']=false;
		$response["objects"][0]['appointment_type']=array();
		$response["objects"][0]['has_emergency_demographic']=false;
		$response["objects"][0]['order']=0;
		$response["objects"][0]['has_long_appointment']=false;
	

		
		echo json_encode ( $response);
	}

}

$clinic_read = new clinic_read();
?>

