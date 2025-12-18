<?php
require_once __DIR__ . '/config.php';

$date = isset($_GET['date']) ? $_GET['date'] : null;
$team = isset($_GET['team']) ? intval($_GET['team']) : null;
$league = isset($_GET['league']) ? intval($_GET['league']) : null;
$season = isset($_GET['season']) ? intval($_GET['season']) : 2023;

if ($date) {
    $path = "/fixtures?date={$date}";
} elseif ($team) {
    $path = "/fixtures?team={$team}&season={$season}";
    if ($league) $path .= "&league={$league}";
} elseif ($league) {
    $path = "/fixtures?league={$league}&season={$season}";
} else {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'date or team or league parameter required']);
    exit;
}

proxy_request($path);

?>
