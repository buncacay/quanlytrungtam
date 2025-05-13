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
    // Kiểm tra xem có idkhoahoc không
    if (isset($_GET['idkhoahoc'])) {
        $idkhoahoc = intval($_GET['idkhoahoc']); // Lấy idkhoahoc từ GET
        $data = $diem->showById($idkhoahoc); // Truy vấn dữ liệu theo idkhoahoc
        echo json_encode($data); // Trả về kết quả dưới dạng JSON
    } 
    // Nếu không có idkhoahoc, kiểm tra idhocvien
    else if (isset($_GET['idhocvien'])) {
        $idhocvien = intval($_GET['idhocvien']); // Lấy idhocvien từ GET
        $data = $diem->readByHocVien($idhocvien); // Truy vấn dữ liệu theo idhocvien
        echo json_encode($data); // Trả về kết quả dưới dạng JSON
    } 
    // Nếu không có cả idkhoahoc và idhocvien, lấy tất cả dữ liệu
    else {
        $data = $diem->readAll(); // Lấy tất cả dữ liệu
        echo json_encode($data); // Trả về kết quả dưới dạng JSON
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
            $response = [
                "idkhoahoc" => $diem->idkhoahoc,
                "kythi" => $diem->kythi,
               
                "idhocvien" => $diem->idhocvien,
                "diemso" => $diem->diemso,
                "ghichu" => $diem->ghichu,
                 "id" => $diem->id
            ];
            echo json_encode($response);
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
