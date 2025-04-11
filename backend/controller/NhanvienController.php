<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


require_once '../config/database.php'; 
require_once '../models/nhanvien.php'; 


$db = new Database();
$conn = $db->getConnection();

$nhanvien = new nhanvien($conn);


$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $nhanvien->read();
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (isset($data->ghichu ) && isset($data->tonggioday ) && isset($data->tienphat) && isset($data->chucvu) && isset($data->tienthuong ) && isset($data->tennhanvien ) && isset($data->trinhdo ) && isset($data->sdt) && isset($data->diachi) && isset($data->chungchi )) {
            $nhanvien->tennhanvien  = $data->tennhanvien ;
            $nhanvien->trinhdo  = $data->trinhdo ;
            $nhanvien->sdt = $data->sdt;
            $nhanvien->diachi = $data->diachi;
            $nhanvien->chungchi  = $data->chungchi ;
            $nhanvien->tienthuong  = $data->tienthuong ;
            $nhanvien->tienphat  = $data->tienphat ;
            $nhanvien->chucvu = $data->chucvu;
            $nhanvien->tonggioday = $data->tonggioday;
            $nhanvien->ghichu  = $data->ghichu ;

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
        if (isset($data->ghichu ) && isset($data->tonggioday ) && isset($data->tienphat) && isset($data->chucvu) && isset($data->tienthuong ) && isset($data->tennhanvien ) && isset($data->trinhdo ) && isset($data->sdt) && isset($data->diachi) && isset($data->chungchi )) {
            $nhanvien->tennhanvien  = $data->tennhanvien ;
            $nhanvien->trinhdo  = $data->trinhdo ;
            $nhanvien->sdt = $data->sdt;
            $nhanvien->diachi = $data->diachi;
            $nhanvien->chungchi  = $data->chungchi ;
            $nhanvien->tienthuong  = $data->tienthuong ;
            $nhanvien->tienphat  = $data->tienphat ;
            $nhanvien->chucvu = $data->chucvu;
            $nhanvien->tonggioday = $data->tonggioday;
            $nhanvien->ghichu  = $data->ghichu ;
            $nhanvien->idnhanvien = $data->idnhanvien;

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
        if (isset($data->idnhanvien)) {
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
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
        break;
}
?>