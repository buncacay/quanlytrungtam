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
        
        // Check if the 'username' parameter is provided
        if (isset($_GET['username'])) {
            // If 'username' is provided, get the user by username
            $user = $_GET['username'];
            $result = $taikhoan->getUserByUsername($user);  // Call the function to fetch user by username

            // If the user is found, return the user data as JSON
            if ($result) {
                echo json_encode([ $result ]);
            } else {
                // If no user is found, return an error message
                echo json_encode([
                    'status' => 'error',
                    'message' => 'User not found'
                ]);
            }
        } else {
            // If no 'username' parameter is provided, return all users
            $result = $taikhoan->read();  // Call the function to fetch all users
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        }
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

  
       
        
    // Kiểm tra dữ liệu bắt buộc
    $missing_fields = [];
    if (empty($data->user)) $missing_fields[] = "user";
    if (empty($data->pass)) $missing_fields[] = "pass";
    if (!isset($data->role) || $data->role === '') $missing_fields[] = "role";


    if (!empty($missing_fields)) {
        http_response_code(400);
        echo json_encode([
            "message" => "Dữ liệu không đầy đủ", 
            "missing_fields" => $missing_fields
        ]);
        return;
    }

    // Gán giá trị
    $taikhoan->user = $data->user;
    $taikhoan->pass = $data->pass;
    $taikhoan->role = $data->role;
    $taikhoan->date = date('Y-m-d H:i:s');

    // Kiểm tra trùng user
    if ($taikhoan->exists($taikhoan->user)) {
        http_response_code(409); // Conflict
        echo json_encode(["message" => "Tên đăng nhập đã tồn tại"]);
        return;
    }

    // Gọi hàm create
    if ($taikhoan->create()) {
        http_response_code(201); // Created
        echo json_encode([
            "role" => $taikhoan->role ?? null,
            "pass" => $taikhoan->pass ?? null,
            "user" => $taikhoan->user ?? null,
            "created_at" => $taikhoan->date ?? null,
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Không thể tạo tài khoản"]);
    }
}

function updateTaiKhoan($taikhoan) {
    $data = json_decode(file_get_contents("php://input"));

    // Kiểm tra dữ liệu bắt buộc
    $missing_fields = [];
    if (empty($data->user)) $missing_fields[] = "user";
    if (empty($data->pass)) $missing_fields[] = "pass";
    if (!isset($data->role) || $data->role === '') $missing_fields[] = "role";

    if (!empty($missing_fields)) {
        http_response_code(400);
        echo json_encode([
            "message" => "Dữ liệu không đầy đủ",
            "missing_fields" => $missing_fields
        ]);
        return;
    }

    if (isset( $data->user, $data->pass)) {
       
        $taikhoan->user = $data->user;
        $taikhoan->pass = $data->pass;
        $taikhoan->role = $data->role;
        $taikhoan->trangthai = isset($data->trangthai) ? $data->trangthai : 1;

        if ($taikhoan->update()) {
            http_response_code(200);
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
    if (isset($_GET['user'])) {
        $taikhoan->user = $_GET['user'];

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
?>
