<?php
	header("Content-type: text/html; charset=utf-8"); 
	ini_set("memory_limit","1024M");
	require_once "HttpClient.class.php";

	$url =$_GET['url'];
	
	$htmlStr = HttpClient::quickGet($url);
	
	$charset = "utf-8";
	preg_match( '/(charset=[\"\'][^\"\']+[\"\'])/', $htmlStr, $matches);
	if(!empty($matches[-1])){
		$charset = substr($matches[0],9,-1);
	}else{
		preg_match( '/(charset=[^\"\']+[\"\'\s]{1})/', $htmlStr, $matches);
		if(!empty($matches[0])){
			$charset = substr($matches[0],8,-1);
		}
	}
	
	if(strtolower($charset)=="gb2312"){
		$charset = "GBK";
	}

	$htmlStr = preg_replace('/src=/','fishfork-src=',$htmlStr);
	$htmlStr = iconv($charset,"utf-8",$htmlStr);
	// $htmlStr = addslashes($htmlStr);
	
	echo $htmlStr;
 ?>