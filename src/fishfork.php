<?php
	require_once "HttpClient.class.php";

	$url = $_GET['url'];
	$us  = $_GET['ua'];
	
    $bits = parse_url($url);
    $host = $bits['host'];
    $port = isset($bits['port']) ? $bits['port'] : 80;
    $path = isset($bits['path']) ? $bits['path'] : '/';
    if (isset($bits['query'])) {
        $path .= '?'.$bits['query'];
    }
    $client = new HttpClient($host, $port);
	$client->setDebug(true);
	$client->setUserAgent( $ua );

    if (!$client->get($path)) {
        // echo '{"fishfork":"fail"}';
    } else {
		echo getallheaders['content-type'];
        echo $client->getContent();
    }

        // $headers = array();
        // $headers[] = "{$this->method} {$this->path} HTTP/1.0"; // Using 1.1 leads to all manner of problems, such as "chunked" encoding
        // $headers[] = "Host: {$this->host}";
        // $headers[] = "User-Agent: {$this->user_agent}";
        // $headers[] = "Accept: {$this->accept}";
        // if ($this->use_gzip) {
        //     $headers[] = "Accept-encoding: {$this->accept_encoding}";
        // }
        // $headers[] = "Accept-language: {$this->accept_language}";
        // if ($this->referer) {
        //     $headers[] = "Referer: {$this->referer}";
        // }
        // // Cookies
        // if ($this->cookies) {
        //     $cookie = 'Cookie: ';
        //     foreach ($this->cookies as $key => $value) {
        //         $cookie .= "$key=$value; ";
        //     }
        //     $headers[] = $cookie;
        // }
        // // Basic authentication
        // if ($this->username && $this->password) {
        //     $headers[] = 'Authorization: BASIC '.base64_encode($this->username.':'.$this->password);
        // }
        // // If this is a POST, set the content type and length
        // if ($this->postdata) {
        //     $headers[] = 'Content-Type: application/x-www-form-urlencoded';
        //     $headers[] = 'Content-Length: '.strlen($this->postdata);
        // }
        // $request = implode("\r\n", $headers)."\r\n\r\n".$this->postdata;
        // return $request;
 ?>