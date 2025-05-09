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
    $data = json_decode(file_get_contents("php://input"), true); // Decode thành mảng

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(["message" => "Dữ liệu gửi lên phải là một mảng bài học."]);
        return;
    }

    $results = [];

    foreach ($data as $index => $item) {
        $missingFields = [];

        // Kiểm tra từng trường bắt buộc
        if (!isset($item['idkhoahoc'])) $missingFields[] = 'idkhoahoc';
        if (!isset($item['idbaihoc']))  $missingFields[] = 'idbaihoc';
        if (!isset($item['tenbaihoc'])) $missingFields[] = 'tenbaihoc';
        if (!isset($item['link']))      $missingFields[] = 'link';

        if (!empty($missingFields)) {
            $results[] = [
                "index" => $index,
                "error" => "Thiếu trường: " . implode(', ', $missingFields),
                "data" => $item
            ];
            continue;
        }

        // Gán dữ liệu vào đối tượng
        $chitiet->idkhoahoc = $item['idkhoahoc'];
        $chitiet->idbaihoc  = $item['idbaihoc'];
        $chitiet->tenbaihoc = $item['tenbaihoc'];
        $chitiet->link      = $item['link'];

        if ($chitiet->create()) {
            $results[] = [
                "index" => $index,
                "status" => "Thêm thành công",
                "data" => $item
            ];
        } else {
            $results[] = [
                "index" => $index,
                "error" => "Không thể thêm vào CSDL",
                "data" => $item
            ];
        }
    }

    // Trả về toàn bộ kết quả
    echo json_encode($results, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
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

