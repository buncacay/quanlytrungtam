<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config/database.php'; 
require_once '../models/nhanvien.php'; 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db = new Database();
$conn = $db->getConnection();

$nhanvien = new nhanvien($conn);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getNhanVien($nhanvien);
        break;

    case 'POST':
        createNhanVien($nhanvien);
        break;

    case 'PUT':
        updateNhanVien($nhanvien);
        break;

    case 'DELETE':
        deleteNhanVien($nhanvien);
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
        break;
}


function getNhanVien($nhanvien) {
    $result = $nhanvien->read();
    echo json_encode($result);
}

function createNhanVien($nhanvien) {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->ghichu, $data->tonggioday, $data->tienphat, $data->chucvu,
              $data->tienthuong, $data->tennhanvien, $data->trinhdo,
              $data->sdt, $data->chungchi)) {

        $nhanvien->tennhanvien  = $data->tennhanvien;
        $nhanvien->trinhdo      = $data->trinhdo;
        $nhanvien->sdt          = $data->sdt;
       
        $nhanvien->chungchi     = $data->chungchi;
        $nhanvien->tienthuong   = $data->tienthuong;
        $nhanvien->tienphat     = $data->tienphat;
        $nhanvien->chucvu       = $data->chucvu;
        $nhanvien->tonggioday   = $data->tonggioday;
        $nhanvien->ghichu       = $data->ghichu;
        $nhanvien->trangthai       = $data->trangthai;

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

function updateNhanVien($nhanvien) {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->idnhanvien, $data->ghichu, $data->tonggioday, $data->tienphat, $data->chucvu,
              $data->tienthuong, $data->tennhanvien, $data->trinhdo,
              $data->sdt,  $data->chungchi, $data->trangthai)) {

        $nhanvien->idnhanvien   = $data->idnhanvien;
        $nhanvien->tennhanvien  = $data->tennhanvien;
        $nhanvien->trinhdo      = $data->trinhdo;
        $nhanvien->sdt          = $data->sdt;
        $nhanvien->chungchi     = $data->chungchi;
        $nhanvien->tienthuong   = $data->tienthuong;
        $nhanvien->tienphat     = $data->tienphat;
        $nhanvien->chucvu       = $data->chucvu;
        $nhanvien->tonggioday   = $data->tonggioday;
        $nhanvien->ghichu       = $data->ghichu;
        $nhanvien->trangthai       = $data->trangthai;

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

function deleteNhanVien($nhanvien) {
    if (isset($_GET['idnhanvien'])) {
        $nhanvien->idnhanvien = $_GET['idnhanvien'];

        if ($nhanvien->delete()) {
            echo json_encode(["message" => "Record deleted successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to delete record."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data: missing idnhanvien."]);
    }
}
