<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config/database.php';
require_once '../models/hoadon.php';

IF ($_SERVER['REQUEST_METHOD']==='OPTIONS'){
    http_response_code(200);
    exit();
}

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
                // http_response_code(404);
                echo json_encode([]);

            }
        } else  
        if (isset($_GET['idhocvien'])) {
            $id = $_GET['idhocvien'];
            $result = $hoadon->showByIdhocvien($id);
            if ($result) {
                echo json_encode($result);
            } else {
                // http_response_code(404);
                echo json_encode([]);

            }
        }
        else{
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

$requiredFields = ['thoigianlap', 'idkhoahoc', 'idhocvien', 'thanhtien'];
$missingFields = [];

foreach ($requiredFields as $field) {
    if (!isset($data->$field)) {
        $missingFields[] = $field;
    }
}

if (empty($missingFields)) {
    $hoadon->thoigianlap = $data->thoigianlap;
    $hoadon->idkhoahoc = $data->idkhoahoc;
    $hoadon->loai = $data->loai ?? null;
    $hoadon->idhocvien = $data->idhocvien;
    $hoadon->giamgia = !empty($data->giamgia) ? $data->giamgia : null;
    $hoadon->thanhtien = $data->thanhtien;

    if ($hoadon->create()) {
        $response = [
            "thoigianlap" => $hoadon->thoigianlap,
            "tenhoadon" => $hoadon->tenhoadon,
            "idkhoahoc" => $hoadon->idkhoahoc,
            "idhocvien" => $hoadon->idhocvien,
            "giamgia" => $hoadon->giamgia ?? null,
            "thanhtien" => $hoadon->thanhtien,
            "loai" => $hoadon->loai
        ];
        echo json_encode($response);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to create record."]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "message" => "Incomplete data.",
        "missing_fields" => $missingFields
    ]);
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
    if (isset($_GET['idhoadon'])) {
        $hoadon->idhoadon = $_GET['idhoadon'];

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
    return isset(
        $data->tenhoadon, 
        $data->thoigianlap, 
        $data->giamgia, 
        $data->thanhtien, 
        $data->idhoadon, 
        $data->idhocvien, 
        $data->idkhoahoc
    );
}

function assignInvoiceData($hoadon, $data) {
    $hoadon->tenhoadon = $data->tenhoadon;
    $hoadon->thoigianlap = $data->thoigianlap;
    $hoadon->giamgia = $data->giamgia;
    $hoadon->thanhtien = $data->thanhtien;
    $hoadon->idhoadon = $data->idhoadon;
    $hoadon->idhocvien = $data->idhocvien;
    $hoadon->idkhoahoc = $data->idkhoahoc;
    $hoadon->loai = $data->loai ?? null; // nếu có dùng trường 'loai'
}



?>
