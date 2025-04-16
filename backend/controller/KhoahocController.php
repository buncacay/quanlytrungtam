<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config/database.php';
require_once '../models/khoahoc.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db = new Database();
$conn = $db->getConnection();

$khoahoc = new khoahoc($conn);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getKhoaHoc($khoahoc);
        break;

    case 'POST':
        createKhoaHoc($khoahoc);
        break;

    case 'PUT':
        updateKhoaHoc($khoahoc);
        break;

    case 'DELETE':
        deleteKhoaHoc($khoahoc);
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}


function getKhoaHoc($khoahoc) {
    if (isset($_GET['action']) && $_GET['action'] === 'chitiet') {
        $result = $khoahoc->getChiTietKhoaHoc();
    } else {
        $result = $khoahoc->read();
    }
    echo json_encode($result);
}

function createKhoaHoc($khoahoc) {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->soluongbuoi, $data->tenkhoahoc, $data->thoigianhoc,$data->lichhoc)) {
        $khoahoc->soluongbuoi = $data->soluongbuoi;
        $khoahoc->tenkhoahoc = $data->tenkhoahoc;
        $khoahoc->thoigianhoc = $data->thoigianhoc;
        $khoahoc->lichhoc = $data->lichhoc;

        if ($khoahoc->create()) {
           
                $response = [
                    "idkhoahoc" => $khoahoc->idkhoahoc,
                    "tenkhoahoc" => $khoahoc->tenkhoahoc,
                    "thoigianhoc" => $khoahoc->thoigianhoc,
                    "lichhoc" => $khoahoc->lichhoc
                   
                ];
                echo json_encode($response);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to create record."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
}

function updateKhoaHoc($khoahoc) {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->idkhoahoc, $data->soluongbuoi, $data->tenkhoahoc, $data->thoigianhoc, $data->lichhoc)) {
        $khoahoc->idkhoahoc = $data->idkhoahoc;
        $khoahoc->soluongbuoi = $data->soluongbuoi;
        $khoahoc->tenkhoahoc = $data->tenkhoahoc;
        $khoahoc->thoigianhoc = $data->thoigianhoc;
        $khoahoc->lichhoc = $data->lichhoc;

        if ($khoahoc->update()) {
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

function deleteKhoaHoc($khoahoc) {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->idkhoahoc)) {
        $khoahoc->idkhoahoc = $data->idkhoahoc;

        if ($khoahoc->delete()) {
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
