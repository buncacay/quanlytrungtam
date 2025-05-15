<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config/database.php';
require_once '../models/donhang.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db = new Database();
$conn = $db->getConnection();

$donhang = new donhang($conn);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            // Gọi phương thức showById để lấy thông tin theo ID
            $result = $donhang->showById($id);

            if ($result) {
                echo json_encode([$result]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Không tìm thấy đơn hàng'
                ]);
            }
        } else {
            // Gọi phương thức read để lấy tất cả đơn hàng
            $result = $donhang->read();
            echo json_encode([$result]);
        }
        break;

    case 'POST':
        createDonhang($donhang);
        break;

  case 'PUT':
    // Lấy dữ liệu JSON từ body request
    $data = json_decode(file_get_contents("php://input"));

    // Kiểm tra xem dữ liệu có được truyền đến hay không
    if ($data) {
        // Kiểm tra và gán giá trị từ dữ liệu JSON
        $donhang->idhocvien = isset($data->idhocvien) ? $data->idhocvien : null;
        $donhang->idkhoahoc = isset($data->idkhoahoc) ? $data->idkhoahoc : null;
        $donhang->trangthaidon = isset($data->trangthaidon) ? $data->trangthaidon : null;
        $donhang->thoigiandat = isset($data->thoigiandat) ? $data->thoigiandat : null;

        // Kiểm tra xem có đầy đủ thông tin không
        if ($donhang->idhocvien && $donhang->idkhoahoc && $donhang->trangthaidon) {
            // Cập nhật trong cơ sở dữ liệu
            $result = $donhang->update();

            if ($result) {
                echo json_encode(["message" => "Cập nhật đơn hàng thành công."]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Cập nhật đơn hàng thất bại"]);
            }
        } else {
            // Nếu thiếu thông tin quan trọng, trả về lỗi
            http_response_code(400);
            echo json_encode(["message" => "Dữ liệu thiếu hoặc không hợp lệ"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Dữ liệu JSON không hợp lệ."]);
    }
    break;



    case 'DELETE':
        deleteDonhang($donhang);
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
        break;
}

function createDonhang($donhang) {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->idhocvien, $data->idkhoahoc, $data->trangthaidon, $data->thoigiandat)) {
        $donhang->idhocvien = $data->idhocvien;
        $donhang->idkhoahoc = $data->idkhoahoc;
        $donhang->trangthaidon = $data->trangthaidon ?? 1;
        $donhang->thoigiandat = $data->thoigiandat;

        if ($donhang->create()) {
            http_response_code(200);
            echo json_encode([
                "message" => "Đơn hàng đã được tạo thành công.",
                "success" => true
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "message" => "Không thể tạo đơn hàng.",
                "success" => false
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "message" => "Dữ liệu không đầy đủ.",
            "success" => false
        ]);
    }
}


function deleteDonhang($donhang) {
    if (isset($_GET['iddonhang'])) {
        $donhang->iddonhang = $_GET['iddonhang'];

        if ($donhang->delete()) {
            echo json_encode(["message" => "Đơn hàng đã được xóa thành công."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Không thể xóa đơn hàng."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Dữ liệu không đầy đủ: thiếu iddonhang."]);
    }
}
?>
