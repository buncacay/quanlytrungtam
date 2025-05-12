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
    if (isset($_GET['idkhoahoc'])) {
        $khoahoc->idkhoahoc = $_GET['idkhoahoc']; // Gán vào thuộc tính đối tượng
        $stmt = $khoahoc->getKhoaHocById(); // Gọi hàm không truyền tham số
        $num = $stmt->rowCount();

        if ($num > 0) {
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($data);
        } else {
            echo json_encode([]);
        }
    } else {
        $stmt = getKhoaHoc($khoahoc);
       
    }
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
        // Nếu có tìm kiếm, truyền tham số $search vào countChiTiet
        $result = $khoahoc->getChiTietKhoaHoc($limit, $offset, $search);
        $total = ceil($khoahoc->countChiTiet($search) / $limit);  // Chỉnh sửa ở đây
    } else {
        $result = $khoahoc->read($limit, $offset);
        $total = ceil($khoahoc->countAll() / $limit);  // Tổng số bản ghi khi không có tìm kiếm
    }

    echo json_encode([
        "data" => $result,
        "total" => $total,
        "page" => $page,
        "limit" => $limit
    ]);
}


function createKhoaHoc($khoahoc) {
    $data = null;
    $newFileName = null;
    $uploadPath = null;

    // Nếu có file ảnh trong FormData
    if (isset($_FILES['image'])) {
        if (!is_dir('../upload')) {
            mkdir('../upload', 0777, true);
        }

        $fileTmp = $_FILES['image']['tmp_name'];
        $newFileName = 'khoahoc_' . uniqid() . '.jpg';
        $uploadPath = '../upload/' . $newFileName;

        if (move_uploaded_file($fileTmp, $uploadPath)) {
            $khoahoc->images = $newFileName;
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Upload ảnh thất bại."]);
            return;
        }
    }

    // Lấy phần dữ liệu text từ FormData
    if (isset($_POST['data'])) {
        $data = json_decode($_POST['data']);
    } else {
        // Nếu không gửi bằng FormData thì fallback sang JSON raw
        $data = json_decode(file_get_contents("php://input"));
        if ($data && isset($data->images)) {
            $khoahoc->images = $data->images;
        }
    }

    if (!$data) {
        http_response_code(400);
        echo json_encode(["message" => "Không nhận được dữ liệu khoá học."]);
        return;
    }

    // Kiểm tra các trường bắt buộc
    $requiredFields = ['tenkhoahoc', 'thoigianhoc', 'soluongbuoi', 'lichhoc', 'diadiemhoc', 'giatien'];
    $missingFields = [];

    foreach ($requiredFields as $field) {
        if (!isset($data->$field)) {
            $missingFields[] = $field;
        }
    }

    if (!empty($missingFields)) {
        http_response_code(400);
        echo json_encode([
            "message" => "Thiếu dữ liệu khoá học.",
            "missing_fields" => $missingFields
        ]);
        return;
    }

    // Gán dữ liệu vào đối tượng khoá học
    $khoahoc->tenkhoahoc = $data->tenkhoahoc;
    $khoahoc->thoigianhoc = $data->thoigianhoc;
    $khoahoc->soluongbuoi = $data->soluongbuoi;
    $khoahoc->lichhoc = $data->lichhoc;
    $khoahoc->diadiemhoc = $data->diadiemhoc;
    $khoahoc->giatien = $data->giatien;
    $khoahoc->giamgia = $data->giamgia ?? null;
    $khoahoc->mota = $data->mota ?? null;

    if ($khoahoc->create()) {
        echo json_encode([
           
           
                "idkhoahoc" => $khoahoc->idkhoahoc,
                "tenkhoahoc" => $khoahoc->tenkhoahoc,
                "thoigianhoc" => $khoahoc->thoigianhoc,
                "lichhoc" => $khoahoc->lichhoc,
                "diadiemhoc" => $khoahoc->diadiemhoc,
                "mota" => $khoahoc->mota,
                "images" => $khoahoc->images,
                "giatien" => $khoahoc->giatien,
                "giamgia" => $khoahoc->giamgia
            
           
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Không thể tạo khoá học."]);
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
