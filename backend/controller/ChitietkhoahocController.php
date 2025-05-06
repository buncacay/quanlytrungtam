<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/database.php';
require_once '../models/chitietkhoahoc.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db = new Database();
$conn = $db->getConnection();

$chitiet = new chitietkhoahoc($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['idkhoahoc'])) {
            $chitiet->idkhoahoc = $_GET['idkhoahoc']; // dùng đúng biến $chitiet
    
            $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
            $offset = ($page - 1) * $limit;
    
            $result = $chitiet->read($limit, $offset);
    
            echo json_encode([
                "data" => $result,
                "page" => $page,
                "limit" => $limit
            ]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Missing idkhoahoc"]);
        }
        break;
    
        

    case 'POST':
        createBaiHoc($chitiet);
        break;

    case 'PUT':
        updateBaiHoc($chitiet);
        break;

        case 'DELETE':
            if (isset($_GET['idbaihoc'])) {
                deleteBaiHoc($chitiet);
            } else {
                deleteKhoaHoc($chitiet);
            }
            break;
        

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
        break;
}

function createBaiHoc($chitiet) {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->idkhoahoc, $data->tenbaihoc, $data->link, $data->idbaihoc)) {
        $chitiet->idkhoahoc = $data->idkhoahoc;
        $chitiet->idbaihoc = $data->idbaihoc;
        $chitiet->tenbaihoc = $data->tenbaihoc;
        $chitiet->link = $data->link;

        if ($chitiet->create()) {
            echo json_encode([
                "idkhoahoc" => $chitiet->idkhoahoc,
                "idbaihoc" => $chitiet->idbaihoc,
                "tenbaihoc" => $chitiet->tenbaihoc,
                "link" => $chitiet->link
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to create record."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
}

function updateBaiHoc($chitiet) {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->idkhoahoc, $data->idbaihoc, $data->tenbaihoc, $data->link)) {
        $chitiet->idkhoahoc = $data->idkhoahoc;
        $chitiet->idbaihoc = $data->idbaihoc;
        $chitiet->tenbaihoc = $data->tenbaihoc;
        $chitiet->link = $data->link;

        if ($chitiet->update()) {
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

function deleteBaiHoc($chitiet) {
    if (isset($_GET['idkhoahoc'], $_GET['idbaihoc'])) {
        $chitiet->idkhoahoc = $_GET['idkhoahoc'];
        $chitiet->idbaihoc = $_GET['idbaihoc'];

        if ($chitiet->delete()) {
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

function deleteKhoaHoc($chitiet) {
    if (isset($_GET['idkhoahoc'])) {
        $chitiet->idkhoahoc = $_GET['idkhoahoc'];

        if ($chitiet->deletekhoahoc()) {
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

