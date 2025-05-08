<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config/database.php';
require_once '../models/khoahoc.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db = new Database();
$conn = $db->getConnection();

$khoahoc = new khoahoc($conn);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getKhoaHoc($khoahoc);
        break;

    case 'POST':
        createKhoaHoc($khoahoc);
        break;

    case 'PUT':
        if (isset($_GET['action']) && $_GET['action'] === 'gia') {
            updateGiaKhoaHoc($khoahoc);  // Cập nhật giá khoá học
        } else {
            updateKhoaHoc($khoahoc);  // Cập nhật khoá học
        }
        break;

    case 'DELETE':
        deleteKhoaHoc($khoahoc);
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function getKhoaHoc($khoahoc) {
    $page = isset($_GET['pages']) ? intval($_GET['pages']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
    $offset = ($page - 1) * $limit;
   
    $search = isset($_GET['search']) ? $_GET['search'] : null;

    if (isset($_GET['action']) && $_GET['action'] === 'chitiet') {
        $result = $khoahoc->getChiTietKhoaHoc($limit, $offset, $search);
        $total = ceil($khoahoc->countChiTiet()/$limit);
    } else {
        $result = $khoahoc->read($limit, $offset);
        $total = ceil($khoahoc->countAll()/$limit);
    }

    echo json_encode([
        "data" => $result,
        "total" => $total,
        "page" => $page,
        "limit" => $limit
    ]);
}

function createKhoaHoc($khoahoc) {
    // Nếu gửi bằng FormData (có file) thì $_FILES sẽ có dữ liệu
    if (isset($_FILES['image'])) {
       
        // Lưu file ảnh
        if (!is_dir('../upload')) {
            mkdir('../upload', 0777, true);
        }

        $fileTmp = $_FILES['image']['tmp_name'];
        $fileName = 'khoahoc_' . uniqid() . '.jpg';
        $filePath = '../upload/' . $fileName;

        if (move_uploaded_file($fileTmp, $filePath)) {
            $khoahoc->images = $fileName;
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Upload ảnh thất bại."]);
            return;
        }

        // Ngoài ảnh, cần đọc thêm thông tin khác từ FormData
        $data = json_decode($_POST['data']);
    } else {
        // Nếu không có file thì nhận JSON bình thường
        $data = json_decode(file_get_contents("php://input"));
        $khoahoc->images = $data->images ?? null; // nếu không có cũng không lỗi
    }

    if (isset($data->tenkhoahoc, $data->thoigianhoc, $data->soluongbuoi, $data->lichhoc, $data->diadiemhoc, $data->giatien)) {
        $khoahoc->tenkhoahoc = $data->tenkhoahoc;
        $khoahoc->thoigianhoc = $data->thoigianhoc;
        $khoahoc->soluongbuoi = $data->soluongbuoi;
        $khoahoc->lichhoc = $data->lichhoc;
        $khoahoc->diadiemhoc = $data->diadiemhoc;
        $khoahoc->giatien = $data->giatien;
        $khoahoc->giamgia = $data->giamgia ?? null;
        $khoahoc->mota = $data->mota ?? null;

        if ($khoahoc->create()) {
            $response = [
                "idkhoahoc" => $khoahoc->idkhoahoc,
                "tenkhoahoc" => $khoahoc->tenkhoahoc,
                "thoigianhoc" => $khoahoc->thoigianhoc,
                "lichhoc" => $khoahoc->lichhoc,
                "diadiemhoc" => $khoahoc->diadiemhoc,
                "mota" => $khoahoc->mota,
                "images" => $khoahoc->images,
                "giatien" => $khoahoc->giatien,
                "giamgia" => $khoahoc->giamgia
            ];
            echo json_encode($response);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Không thể tạo khoá học."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Thiếu dữ liệu khoá học."]);
    }
}

function updateKhoaHoc($khoahoc) {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->idkhoahoc, $data->soluongbuoi, $data->tenkhoahoc, $data->thoigianhoc, $data->lichhoc,  $data->giatien)) {
        $khoahoc->idkhoahoc = $data->idkhoahoc;
        $khoahoc->soluongbuoi = $data->soluongbuoi;
        $khoahoc->tenkhoahoc = $data->tenkhoahoc;
        $khoahoc->thoigianhoc = $data->thoigianhoc;
        $khoahoc->diadiemhoc = $data->diadiemhoc;
        $khoahoc->lichhoc = $data->lichhoc;
        $khoahoc->mota = $data->mota ?? null;
        $khoahoc->images = $data->images ?? null;
        $khoahoc->giatien = $data->giatien;
        $khoahoc->giamgia = $data->giamgia ?? null;

        if ($khoahoc->update()) {
            echo json_encode(["message" => "Cập nhật khoá học thành công."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Không thể cập nhật khoá học."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Thiếu dữ liệu cập nhật."]);
    }
}

function deleteKhoaHoc($khoahoc) {
    if (isset($_GET['idkhoahoc'])) {
        $khoahoc->idkhoahoc = $_GET['idkhoahoc'];

        if ($khoahoc->delete()) {
            echo json_encode(["message" => "Xóa khoá học thành công."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Không thể xóa khoá học."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Thiếu idkhoahoc trên URL."]);
    }
}

function updateGiaKhoaHoc($khoahoc) {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->idkhoahoc, $data->giatien)) {
        $khoahoc->idkhoahoc = $data->idkhoahoc;
        $khoahoc->giatien = $data->giatien;
        $khoahoc->giamgia = $data->giamgia ?? null;

        if ($khoahoc->updateGia()) {
            echo json_encode(["message" => "Cập nhật khoá học thành công."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Không thể cập nhật khoá học."]);
        }
    } else {
        http_response_code(400);
     
        echo json_encode(["message" => "Thiếu dữ liệu cập nhật."]);
    }
}
?>
