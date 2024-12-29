<?php
require_once 'config.php';

header('Content-Type: application/json');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Error de conexión: ' . $conn->connect_error]));
}

$sql = "SELECT * FROM songs";
$result = $conn->query($sql);

$songs = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $songs[] = array(
            'title' => $row['title'],
            'name' => $row['artist'],
            'source' => $row['file_path'],
            'cover' => $row['cover_path']
        );
    }
}

$conn->close();
echo json_encode($songs);