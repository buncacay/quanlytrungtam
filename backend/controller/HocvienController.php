<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 86400"); // Giữ preflight trong cache 1 ngày
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/database.php';
require_once '../models/hocvien.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db = new Database();
$conn = $db->getConnection();

$hocvien = new hocvien($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['idhocvien'])) {
            $id = intval($_GET['idhocvien']);
            $data = $hocvien->showById($id);
            if ($data) {
                echo json_encode($data);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Record not found."]);
            }
        } else {
            $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
            $offset = ($page - 1) * $limit;
            $total = ceil($hocvien->countAll() / $limit); 
            $result = $hocvien->read($limit, $offset);
           

            echo json_encode([
                "data" => $result,
                "total" => $total,
                "page" => $page,
                "limit" => $limit
            ]);
        }
        break;

    case 'POST':
        createHocVien($hocvien);
        break;

    case 'PUT':
        updateHocVien($hocvien);
        break;

    case 'DELETE':
        deleteHocVien($hocvien);
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
        break;
}



function createHocVien($hocvien) {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->hoten, $data->ngaysinh, $data->sdt)) {
        $hocvien->hoten = $data->hoten;
        $hocvien->ngaysinh = $data->ngaysinh;
        $hocvien->sdt = $data->sdt;
        $hocvien->sdtph = !empty($data->sdtph) ? $data->sdtph : null;
        $hocvien->diachi = !empty($data->diachi) ? $data->diachi : null;

        if ($hocvien->create()) {
            $response = [
                "idhocvien" => $hocvien->idhocvien,
                "hoten" => $hocvien->hoten,
                "ngaysinh" => $hocvien->ngaysinh,
                "sdt" => $hocvien->sdt,
                "sdtph" => $hocvien->sdtph,
                "diachi" => $hocvien->diachi
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

function updateHocVien($hocvien) {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->idhocvien, $data->hoten, $data->ngaysinh, $data->sdt)) {
        $hocvien->idhocvien = $data->idhocvien;
        $hocvien->hoten = $data->hoten;
        $hocvien->ngaysinh = $data->ngaysinh;
        $hocvien->sdt = $data->sdt;
        $hocvien->diachi = isset($data->diachi) ? $data->diachi : null;
        $hocvien->sdtph = isset($data->sdtph) ? $data->sdtph : null;

        if ($hocvien->update()) {
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

function deleteHocVien($hocvien) {
    if (isset($_GET['idhocvien'])) {
        $hocvien->idhocvien = $_GET['idhocvien'];

        if ($hocvien->delete()) {
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


