<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


require_once '../config/database.php'; 
require_once '../models/hoadon.php'; 


$db = new Database();
$conn = $db->getConnection();

$hoadon = new hoadon($conn);


$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $hoadon->read();
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (isset($data->giamgia) && isset($data->thanhtien) && isset($data->tenhoadon) && isset($data->thoigianlap) && isset($data->nguoilap) && isset($data->soluongmua) && isset($data->dongia )) {
            $hoadon->tenhoadon = $data->tenhoadon;
            $hoadon->thoigianlap = $data->thoigianlap;
            $hoadon->nguoilap = $data->nguoilap;
            $hoadon->soluongmua = $data->soluongmua;
            $hoadon->dongia  = $data->dongia ;

            $hoadon->giamgia = $data->giamgia;
            $hoadon->thanhtien  = $data->thanhtien ;

            if ($hoadon->create()) {
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
        if (isset($data->giamgia) && isset($data->thanhtien) && isset($data->tenhoadon) && isset($data->thoigianlap) && isset($data->nguoilap) && isset($data->soluongmua) && isset($data->dongia )) {
            $hoadon->tenhoadon = $data->tenhoadon;
            $hoadon->thoigianlap = $data->thoigianlap;
            $hoadon->nguoilap = $data->nguoilap;
            $hoadon->soluongmua = $data->soluongmua;
            $hoadon->dongia  = $data->dongia ;

            $hoadon->giamgia = $data->giamgia;
            $hoadon->thanhtien  = $data->thanhtien ;

            if ($hoadon->update()) {
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
        if (isset($data->idhoadon)) {
            $hoadon->idhoadon = $data->idhoadon;

            if ($hoadon->delete()) {
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