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
        $result = $hocvien->read();
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (isset($data->idhocvien) && isset($data->idkhoahoc) && isset($data->idhoadon) && isset($data->tinhtranghocphi) && isset($data->ketquahoctap )) {
            $hocvien->idhocvien = $data->idhocvien;
            $hocvien->idkhoahoc = $data->idkhoahoc;
            $hocvien->idhoadon = $data->idhoadon;
            $hocvien->tinhtranghocphi = $data->tinhtranghocphi;
            $hocvien->ketquahoctap  = $data->ketquahoctap ;
            $hocvien->ghichu = $data->ghichu;

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
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if (isset($data->idhocvien) && isset($data->idhocvien) && isset($data->idkhoahoc) && isset($data->idhoadon) && isset($data->tinhtranghocphi) && isset($data->ketquahoctap )) {
            $hocvien->idhocvien = $data->idhocvien;
            $hocvien->ghichu = $data->ghichu;
            $hocvien->idkhoahoc = $data->idkhoahoc;
            $hocvien->idhoadon = $data->idhoadon;
            $hocvien->tinhtranghocphi = $data->tinhtranghocphi;
            $hocvien->ketquahoctap  = $data->ketquahoctap ;


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
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        if (isset($data->idhocvien) && isset($data->idkhoahoc) && isset($data->idhoadon)) {
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
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
        break;
}
?>