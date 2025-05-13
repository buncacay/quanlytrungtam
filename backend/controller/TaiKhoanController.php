<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/database.php';
require_once '../models/taikhoan.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db = new Database();
$conn = $db->getConnection();

$taikhoan = new taikhoan($conn);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $taikhoan->read();
        echo json_encode($result);
        break;

    case 'POST':
        createTaiKhoan($taikhoan);
        break;

    case 'PUT':
        updateTaiKhoan($taikhoan);
        break;

    case 'DELETE':
        deleteTaiKhoan($taikhoan);
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
        break;
}

// Tạo tài khoản mới
function createTaiKhoan($taikhoan) {
    $raw_input = file_get_contents("php://input");
    $data = json_decode($raw_input);

    if (!$data) {
        http_response_code(400);
        echo json_encode([
            "message" => "Không đọc được dữ liệu JSON", 
            "raw_input" => $raw_input
        ]);
        return;
    }

    // Kiểm tra xem các trường dữ liệu bắt buộc có được cung cấp không
    $missing_fields = [];

    if (empty($data->user)) {
        $missing_fields[] = "user";
    }
    if (empty($data->pass)) {
        $missing_fields[] = "pass";
    }
    if (empty($data->role)) {
        $missing_fields[] = "role";
    }

    if (!empty($missing_fields)) {
        http_response_code(400);
        echo json_encode([
            "message" => "Dữ liệu không đầy đủ", 
            "missing_fields" => $missing_fields
        ]);
        return;
    }

    // Gán giá trị nếu đầy đủ
    $taikhoan->user = $data->user;
    $taikhoan->pass = $data->pass;
    $taikhoan->role = $data->role;
    $taikhoan->date = date('Y-m-d H:i:s');

    // Gọi hàm create
    if ($taikhoan->create()) {
        http_response_code(201); // Created
        echo json_encode(["message" => "tai khoan da duoc tao"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "khong the tao tai khoan"]);
    }
}


// Cập nhật tài khoản
function updateTaiKhoan($taikhoan) {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->id, $data->user, $data->pass, $data->role)) {
        $taikhoan->idtaikhoan = $data->id;
        $taikhoan->user = $data->user;
        $taikhoan->pass = $data->pass;
        $taikhoan->role = $data->role;
        $taikhoan->trangthai = isset($data->trangthai) ? $data->trangthai : 1;

        if ($taikhoan->update()) {
            echo json_encode(["message" => "Tài khoản đã được cập nhật."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Cập nhật thất bại."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Dữ liệu không đầy đủ."]);
    }
}

// Xóa mềm tài khoản
function deleteTaiKhoan($taikhoan) {
    if (isset($_GET['id'])) {
        $taikhoan->idtaikhoan = $_GET['id'];

        if ($taikhoan->delete()) {
            echo json_encode(["message" => "Tài khoản đã được xóa (mềm)."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Xóa tài khoản thất bại."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Thiếu ID."]);
    }
}
