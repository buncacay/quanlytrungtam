<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


require_once '../config/database.php'; 
require_once '../models/chitietnhanvien.php'; 


$db = new Database();
$conn = $db->getConnection();

$nhanvien = new chitietnhanvien($conn);


$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $nhanvien->read();
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (isset($data->thanhtien ) && isset($data->idnhanvien ) && isset($data->idkhoahoc ) && isset($data->tinhtranggiangday) && isset($data->sogioday) && isset($data->dongia )) {
            $nhanvien->idnhanvien  = $data->idnhanvien ;
            $nhanvien->idkhoahoc  = $data->idkhoahoc ;
            $nhanvien->tinhtranggiangday = $data->tinhtranggiangday;
            $nhanvien->sogioday = $data->sogioday;
            $nhanvien->dongia  = $data->dongia ;
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
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if (isset($data->thanhtien ) && isset($data->idnhanvien ) && isset($data->idkhoahoc ) && isset($data->tinhtranggiangday) && isset($data->sogioday) && isset($data->dongia )) {
            $nhanvien->thanhtien = $data->thanhtien;
            $nhanvien->idnhanvien  = $data->idnhanvien ;
            $nhanvien->idkhoahoc  = $data->idkhoahoc ;
            $nhanvien->tinhtranggiangday = $data->tinhtranggiangday;
            $nhanvien->sogioday = $data->sogioday;
            $nhanvien->dongia  = $data->dongia ;

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
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        if (isset($data->idkhoahoc) && isset($data->idhoadon)) {
            $nhanvien->idkhoahoc = $data->idkhoahoc;
            $nhanvien->idhoadon = $data->idhoadon;

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
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
        break;
}
?>