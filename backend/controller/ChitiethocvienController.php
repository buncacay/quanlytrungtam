<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 86400"); // Giữ preflight trong cache 1 ngày
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/database.php';
require_once '../models/chitiethocvien.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
} 
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
    if (isset($data->idhocvien, $data->idkhoahoc,$data->tinhtranghocphi,$data->ketquahoctap)) {
        $hocvien->idhocvien = $data->idhocvien;
        $hocvien->idkhoahoc = $data->idkhoahoc;
        $hocvien->tinhtranghocphi = $data->tinhtranghocphi;
        $hocvien->ketquahoctap = $data->ketquahoctap;
      
        if ($hocvien->create()) {
            echo json_encode(["message" => "Record created successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to create record."]);
        }
    } else {
        http_response_code(400);
        
        echo json_encode(["message" => "Incomplete data."]);
        if (!isset($data->idhocvien)) {
            echo json_encode(["message" => "idhocvien data."]);
        }
        if (!isset($data->idkhoahoc)) {
            echo json_encode(["message" => "idkhoahoc data."]);

        }
    }
}

function updateChiTiet($hocvien) {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->idhocvien, $data->idkhoahoc)) {
        $hocvien->idhocvien = $data->idhocvien;
        $hocvien->idkhoahoc = $data->idkhoahoc;
        
       

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
    if (isset($data->idhocvien, $data->idkhoahoc)) {
        $hocvien->idhocvien = $data->idhocvien;
        $hocvien->idkhoahoc = $data->idkhoahoc;
     

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