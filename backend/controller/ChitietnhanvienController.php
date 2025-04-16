<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config/database.php';
require_once '../models/chitietnhanvien.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    http_response_code(200);
    exit();
}



$db = new Database();
$conn = $db->getConnection();

$nhanvien = new chitietnhanvien($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        readChiTiet($nhanvien);
        break;

    case 'POST':
        createChiTiet($nhanvien);
        break;

    case 'PUT':
        updateChiTiet($nhanvien);
        break;

    case 'DELETE':
        deleteChiTiet($nhanvien);
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
        break;
}


function readChiTiet($nhanvien) {
    $result = $nhanvien->read();
    echo json_encode($result);
}

function createChiTiet($nhanvien) {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->thanhtien, $data->idnhanvien, $data->idkhoahoc, $data->tinhtranggiangday, $data->sogioday, $data->dongia)) {
        $nhanvien->idnhanvien = $data->idnhanvien;
        $nhanvien->idkhoahoc = $data->idkhoahoc;
        $nhanvien->tinhtranggiangday = $data->tinhtranggiangday;
        $nhanvien->sogioday = $data->sogioday;
        $nhanvien->dongia = $data->dongia;
        $nhanvien->thanhtien = $data->thanhtien;

        if ($nhanvien->create()) {
            echo json_encode(["message" => "Record created successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to create record."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
}

function updateChiTiet($nhanvien) {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->thanhtien, $data->idnhanvien, $data->idkhoahoc, $data->tinhtranggiangday, $data->sogioday, $data->dongia)) {
        $nhanvien->idnhanvien = $data->idnhanvien;
        $nhanvien->idkhoahoc = $data->idkhoahoc;
        $nhanvien->tinhtranggiangday = $data->tinhtranggiangday;
        $nhanvien->sogioday = $data->sogioday;
        $nhanvien->dongia = $data->dongia;
        $nhanvien->thanhtien = $data->thanhtien;

        if ($nhanvien->update()) {
            echo json_encode(["message" => "Record updated successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to update record."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
}

function deleteChiTiet($nhanvien) {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->idkhoahoc, $data->idnhanvien)) {
        $nhanvien->idkhoahoc = $data->idkhoahoc;
        $nhanvien->idnhanvien = $data->idnhanvien;

        if ($nhanvien->delete()) {
            echo json_encode(["message" => "Record deleted successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to delete record."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
}
