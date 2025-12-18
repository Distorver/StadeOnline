<?php
require_once __DIR__ . '/config.php';

$league = isset($_GET['league']) ? intval($_GET['league']) : null;
$season = isset($_GET['season']) ? intval($_GET['season']) : 2025;

if (!$league) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'league parameter required']);
    exit;
}

$path = "/players/topassists?league={$league}&season={$season}";
proxy_request($path);

?>
