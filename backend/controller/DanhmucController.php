<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Kết nối cơ sở dữ liệu và model
include_once '../config/database.php';
include_once '../models/danhmuc.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    http_response_code(200);
    exit();
}


// Khởi tạo DB và đối tượng DanhMuc
$database = new Database();
$db = $database->getConnection();
$danhmuc = new DanhMuc($db);

// Lấy method từ request
$method = $_SERVER['REQUEST_METHOD'];

// Xử lý route đơn giản
switch ($method) {
   case 'GET':
    if (isset($_GET['iddanhmuc'])) {
        $iddanhmuc = $_GET['iddanhmuc'];  // ✅ Gán giá trị từ GET
        $data = $danhmuc->readByID($iddanhmuc);
        echo json_encode($data);  // ✅ Trả về dữ liệu đơn lẻ
    } else {
        // Đọc tất cả danh mục
        $data = $danhmuc->read();
        echo json_encode($data);  // ✅ Trả về danh sách
    }
    break;


    case 'POST':
    $input = json_decode(file_get_contents("php://input"));

    if (!empty($input->tendanhmuc)) {
        $danhmuc->tendanhmuc = $input->tendanhmuc;

        if ($danhmuc->create()) {
            http_response_code(201); // Created
            echo json_encode(['message' => 'Thêm danh mục thành công']);
        } else {
            http_response_code(500); // Server error
            echo json_encode(['message' => 'Thêm danh mục thất bại']);
        }
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(['message' => 'Thiếu tên danh mục']);
    }
    break;


    case 'PUT':
        $input = json_decode(file_get_contents("php://input"));

        if (!empty($input->iddanhmuc) && !empty($input->tendanhmuc)) {
            $danhmuc->iddanhmuc = $input->iddanhmuc;
            $danhmuc->tendanhmuc = $input->tendanhmuc;

            if ($danhmuc->update()) {
                  http_response_code(201);
                echo json_encode(["status" => true, "message" => "Cập nhật thành công"]);
            } else {
                 http_response_code(500);
                echo json_encode(["status" => false, "message" => "Cập nhật thất bại"]);
            }
        } else {
            http_response_code(400); 
            echo json_encode(["status" => false, "message" => "Thiếu dữ liệu"]);
        }
        break;

    case 'DELETE':
        $input = json_decode(file_get_contents("php://input"));

        if (!empty($input->iddanhmuc)) {
            $danhmuc->iddanhmuc = $input->iddanhmuc;

            if ($danhmuc->delete()) {
                echo json_encode(["status" => true, "message" => "Xoá thành công"]);
            } else {
                echo json_encode(["status" => false, "message" => "Xoá thất bại"]);
            }
        } else {
            echo json_encode(["status" => false, "message" => "Thiếu ID danh mục"]);
        }
        break;

    default:
        echo json_encode(["status" => false, "message" => "Phương thức không được hỗ trợ"]);
        break;
}
?>
