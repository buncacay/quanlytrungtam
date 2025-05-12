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
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        $missingFields = [];

        if (!isset($data->idnhanvien)) $missingFields[] = "idnhanvien";
        if (!isset($data->idkhoahoc)) $missingFields[] = "idkhoahoc";
        // if (!isset($data->thoigianbatdau)) $missingFields[] = "thoigianbatdau";
        // if (!isset($data->thoigianketthuc)) $missingFields[] = "thoigianketthuc";
        if (!isset($data->dongia)) $missingFields[] = "dongia";

        if (!empty($missingFields)) {
            http_response_code(400);
            echo json_encode([
                "message" => "Incomplete data.",
                "missing" => $missingFields
            ]);
            return;
        }

        $nhanvien->idnhanvien = $data->idnhanvien;
        $nhanvien->idkhoahoc = $data->idkhoahoc;
        $nhanvien->thoigianbatdau = $data->thoigianbatdau;
        $nhanvien->thoigianketthuc = $data->thoigianketthuc;
        $nhanvien->dongia = $data->dongia;

        if ($nhanvien->create()) {
            echo json_encode(["message" => "Record created successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to create record."]);
        }
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            "message" => "Unexpected error occurred.",
            "error" => $e->getMessage()
        ]);
    }
}



function updateChiTiet($nhanvien) {
    $data = json_decode(file_get_contents("php://input"));
    
    $missingFields = [];

    if (!isset($data->idnhanvien)) $missingFields[] = "idnhanvien";
    if (!isset($data->idkhoahoc)) $missingFields[] = "idkhoahoc";
    // if (!isset($data->thoigianbatdau)) $missingFields[] = "thoigianbatdau";
    // if (!isset($data->thoigianketthuc)) $missingFields[] = "thoigianketthuc";
    if (!isset($data->dongia)) $missingFields[] = "dongia";

    if (!empty($missingFields)) {
        http_response_code(400);
        echo json_encode([
            "message" => "Incomplete data.",
            "missing" => $missingFields
        ]);
        return;
    }

    $nhanvien->idnhanvien = $data->idnhanvien;
    $nhanvien->idkhoahoc = $data->idkhoahoc;
    $nhanvien->thoigianbatdau = $data->thoigianbatdau;
    $nhanvien->thoigianketthuc = $data->thoigianketthuc;
    $nhanvien->dongia = $data->dongia;

    if ($nhanvien->update()) {
        echo json_encode(["message" => "Record updated successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to update record."]);
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
