<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config/database.php';
require_once '../models/chitiethocvien.php';

$db = new Database();
$conn = $db->getConnection();

$hocvien = new chitiethocvien($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
            if (isset($_GET['idhocvien'])) {
                $id = $_GET['idhocvien'];
                $result = $hocvien->getById($id);
                if ($result) {
                    echo json_encode($result);
                } else {
                    http_response_code(404);
                    echo json_encode(["message" => "khong co hoc vien nha."]);
                }
            } else {
                $result = $hocvien->read();
                echo json_encode($result);
            }
            break;
        

    case 'POST':
        createChiTiet($hocvien);
        break;

    case 'PUT':
        updateChiTiet($hocvien);
        break;

    case 'DELETE':
        deleteChiTiet($hocvien);
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
        break;
}


function createChiTiet($hocvien) {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->idhocvien, $data->idkhoahoc, $data->idhoadon, $data->tinhtranghocphi, $data->ketquahoctap)) {
        $hocvien->idhocvien = $data->idhocvien;
        $hocvien->idkhoahoc = $data->idkhoahoc;
        $hocvien->idhoadon = $data->idhoadon;
        $hocvien->tinhtranghocphi = $data->tinhtranghocphi;
        $hocvien->ketquahoctap = $data->ketquahoctap;
        $hocvien->ghichu = isset($data->ghichu) ? $data->ghichu : null;

        if ($hocvien->create()) {
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

function updateChiTiet($hocvien) {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->idhocvien, $data->idkhoahoc, $data->idhoadon, $data->tinhtranghocphi, $data->ketquahoctap)) {
        $hocvien->idhocvien = $data->idhocvien;
        $hocvien->idkhoahoc = $data->idkhoahoc;
        $hocvien->idhoadon = $data->idhoadon;
        $hocvien->tinhtranghocphi = $data->tinhtranghocphi;
        $hocvien->ketquahoctap = $data->ketquahoctap;
        $hocvien->ghichu = isset($data->ghichu) ? $data->ghichu : null;

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

function deleteChiTiet($hocvien) {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->idhocvien, $data->idkhoahoc, $data->idhoadon)) {
        $hocvien->idhocvien = $data->idhocvien;
        $hocvien->idkhoahoc = $data->idkhoahoc;
        $hocvien->idhoadon = $data->idhoadon;

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


?>