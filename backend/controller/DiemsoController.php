<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/database.php';
require_once '../models/diemso.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db = new Database();
$conn = $db->getConnection();

$diem = new diemso($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['idhocvien'])) {
            $id = intval($_GET['idhocvien']);
            $data = $diem->readByHocVien($id);
            echo json_encode($data);
        } else {
            $data = $diem->readAll();
            echo json_encode($data);
        }
        break;

    case 'POST':
        createDiem($diem);
        break;

    case 'PUT':
        updateDiem($diem);
        break;

    case 'DELETE':
        deleteDiem($diem);
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
        break;
}

function createDiem($diem) {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->idkhoahoc, $data->idhocvien, $data->kythi, $data->diemso)) {
        $diem->idkhoahoc = $data->idkhoahoc;
        $diem->idhocvien = $data->idhocvien;
        $diem->kythi = $data->kythi;
        $diem->diemso = $data->diemso;
        $diem->ghichu = isset($data->ghichu) ? $data->ghichu : null;

        if ($diem->create()) {
            echo json_encode(["message" => "Score record created successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to create score record."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
}

function updateDiem($diem) {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->id, $data->idkhoahoc, $data->idhocvien, $data->kythi, $data->diemso)) {
        $diem->id = $data->id;
        $diem->idkhoahoc = $data->idkhoahoc;
        $diem->idhocvien = $data->idhocvien;
        $diem->kythi = $data->kythi;
        $diem->diemso = $data->diemso;
        $diem->ghichu = isset($data->ghichu) ? $data->ghichu : null;

        if ($diem->update()) {
            echo json_encode(["message" => "Score updated successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update score."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
}

function deleteDiem($diem) {
    if (isset($_GET['id'])) {
        $diem->id = $_GET['id'];

        if ($diem->delete()) {
            echo json_encode(["message" => "Score deleted successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to delete score."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Missing ID."]);
    }
}
