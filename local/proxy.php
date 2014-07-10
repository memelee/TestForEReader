<?php
	
	$action = $_GET["action"];
	$host = "ereaderweb.williamoneil.com";
	// $host = "172.22.136.45";

	$request = getallheaders();
	$request["Host"] = $host;
	
	$headers = "";
	foreach ($request as $key => $value) {
		$headers .= $key.":".$value."\r\n";
	}

	$options = array (
		"http" => array (
			"method" => $_SERVER['REQUEST_METHOD'],
			"header" => $headers
		)
	);
	$context = stream_context_create($options);

	switch ($action) {
		case "pub":
			echo file_get_contents("http://".$host."/rb2/u/pub/list.json", false, $context);
			break;
		case "pro":
			$book = $_GET["book"];
			echo file_get_contents("http://".$host."/rb2/u/pub/detail.json?book=".$book, false, $context);
			break;
		case "sgi":
			echo file_get_contents("http://".$host."/rb2/u/signin", false, $context);
			break;
		case "sgo":
			echo file_get_contents("http://".$host."/rb2/u/signout", false, $context);
			break;
		case "myl":
			echo file_get_contents("http://".$host."/rb2/bk/list.json", false, $context);
			break;
		case "req":
			$book = $_GET["book"];
			$email = $_GET["email"];
			$company = $_GET["company"];
			$name = $_GET["name"];
			$phone = $_GET["phone"];
			echo file_get_contents("http://".$host."/rb2/u/pub/reqsvc.json?book=".$book."&email=".$email."&company=".$company."&name=".$name."&phone=".$phone, false, $context);
			break;
	}

?>