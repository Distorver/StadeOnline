<?php
// API config - keep your API key here (server-side)
define('API_BASE', 'https://v3.football.api-sports.io');
// TODO: replace with your real API key and keep file outside VCS if possible
define('API_KEY', '');

function proxy_request($path) {
    $url = API_BASE . $path;

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["x-apisports-key: " . API_KEY]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $resp = curl_exec($ch);
    $err = curl_error($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($resp === false) {
        http_response_code(502);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Upstream request failed', 'details' => $err]);
        exit;
    }

    http_response_code($code ?: 200);
    header('Content-Type: application/json');
    echo $resp;
    exit;
}

?>
