<?php
/**
 * PHP Proxy for Rice Mill API
 * This handles CORS and proxies requests from HTTPS frontend to HTTP backend
 * Required when hosting on shared hosting without mod_proxy support
 */

// Backend API URL
$BACKEND_URL = 'https://sameerarice.cloud/api';

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the endpoint from the request
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

// Remove endpoint from query string for forwarding
$queryParams = $_GET;
unset($queryParams['endpoint']);
$queryString = http_build_query($queryParams);

// Build the full backend URL
$url = $BACKEND_URL . '/' . $endpoint;
if (!empty($queryString)) {
    $url .= '?' . $queryString;
}

// Get request body for POST/PUT/PATCH
$requestBody = file_get_contents('php://input');

// Get request headers to forward
$headers = [];
$headersToForward = ['Content-Type', 'Authorization'];
foreach ($headersToForward as $headerName) {
    $serverKey = 'HTTP_' . strtoupper(str_replace('-', '_', $headerName));
    if (isset($_SERVER[$serverKey])) {
        $headers[] = $headerName . ': ' . $_SERVER[$serverKey];
    }
}

// If Content-Type not set but we have body, default to JSON
if (!empty($requestBody) && !in_array('Content-Type', array_map(function($h) {
    return explode(':', $h)[0];
}, $headers))) {
    $headers[] = 'Content-Type: application/json';
}

// Initialize cURL
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Set method-specific options
switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $requestBody);
        break;
    case 'PUT':
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $requestBody);
        break;
    case 'PATCH':
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $requestBody);
        break;
    case 'DELETE':
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        break;
}

// Get response headers
$responseHeaders = [];
curl_setopt($ch, CURLOPT_HEADERFUNCTION, function($curl, $header) use (&$responseHeaders) {
    $len = strlen($header);
    $header = explode(':', $header, 2);
    if (count($header) < 2) {
        return $len;
    }
    $responseHeaders[strtolower(trim($header[0]))] = trim($header[1]);
    return $len;
});

// Execute request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Handle cURL errors
if ($error) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Proxy error: ' . $error]);
    exit();
}

// Forward response code
http_response_code($httpCode);

// Forward Content-Type header
if (isset($responseHeaders['content-type'])) {
    header('Content-Type: ' . $responseHeaders['content-type']);
} else {
    header('Content-Type: application/json');
}

// Output response
echo $response;

