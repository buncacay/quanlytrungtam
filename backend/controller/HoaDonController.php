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
        if (isset($_GET['idhoadon'])) {
            $id = $_GET['idhoadon'];
            $result = $hoadon->showById($id);
            if ($result) {
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Invoice not found."]);
            }
        } else {
            echo json_encode($hoadon->read());
        }
        break;

    case 'POST':
        handleCreate($hoadon);
        break;

    case 'PUT':
        handleUpdate($hoadon);
        break;

    case 'DELETE':
        handleDelete($hoadon);
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
        break;
}



function handleCreate($hoadon) {
    $data = json_decode(file_get_contents("php://input"));
    if (validateInvoiceData($data)) {
        assignInvoiceData($hoadon, $data);
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
}

function handleUpdate($hoadon) {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->idhoadon) && validateInvoiceData($data)) {
        assignInvoiceData($hoadon, $data);
        $hoadon->idhoadon = $data->idhoadon;
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
}

function handleDelete($hoadon) {
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
}

function validateInvoiceData($data) {
    return isset($data->tenhoadon, $data->thoigianlap, $data->nguoilap, $data->soluongmua, $data->dongia, $data->giamgia, $data->thanhtien);
}

function assignInvoiceData($hoadon, $data) {
    $hoadon->tenhoadon = $data->tenhoadon;
    $hoadon->thoigianlap = $data->thoigianlap;
    $hoadon->nguoilap = $data->nguoilap;
    $hoadon->soluongmua = $data->soluongmua;
    $hoadon->dongia = $data->dongia;
    $hoadon->giamgia = $data->giamgia;
    $hoadon->thanhtien = $data->thanhtien;
}


?>
