<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config/database.php';
require_once '../models/khoahoc.php';

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
    $result = $khoahoc->read();
    echo json_encode($result);
}

function createKhoaHoc($khoahoc) {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->soluongbuoi, $data->tenkhoahoc, $data->thoigianhoc)) {
        $khoahoc->soluongbuoi = $data->soluongbuoi;
        $khoahoc->tenkhoahoc = $data->tenkhoahoc;
        $khoahoc->thoigianhoc = $data->thoigianhoc;

        if ($khoahoc->create()) {
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

function updateKhoaHoc($khoahoc) {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->idkhoahoc, $data->soluongbuoi, $data->tenkhoahoc, $data->thoigianhoc)) {
        $khoahoc->idkhoahoc = $data->idkhoahoc;
        $khoahoc->soluongbuoi = $data->soluongbuoi;
        $khoahoc->tenkhoahoc = $data->tenkhoahoc;
        $khoahoc->thoigianhoc = $data->thoigianhoc;

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
