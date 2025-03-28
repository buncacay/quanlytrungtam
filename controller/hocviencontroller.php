<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


require_once '../config/database.php'; 
require_once '../models/hocvien.php'; 


$db = new Database();
$conn = $db->getConnection();

$hocvien = new hocvien($conn);


$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $hocvien->read();
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (isset($data->hoten) && isset($data->ngaysinh) && isset($data->sdt) && isset($data->diachi) && isset($data->sdtph)) {
            $hocvien->hoten = $data->hoten;
            $hocvien->ngaysinh = $data->ngaysinh;
            $hocvien->sdt = $data->sdt;
            $hocvien->diachi = $data->diachi;
            $hocvien->sdtph = $data->sdtph;

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
        if (isset($data->idhocvien) && isset($data->hoten) && isset($data->ngaysinh) && isset($data->sdt) && isset($data->diachi) && isset($data->sdtph)) {
            $hocvien->idhocvien = $data->idhocvien;
            $hocvien->hoten = $data->hoten;
            $hocvien->ngaysinh = $data->ngaysinh;
            $hocvien->sdt = $data->sdt;
            $hocvien->diachi = $data->diachi;
            $hocvien->sdtph = $data->sdtph;

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
        if (isset($data->idhocvien)) {
            $hocvien->idhocvien = $data->idhocvien;

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