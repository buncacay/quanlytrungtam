<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Method: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


require_once '../config/database.php';
require_once '../models/khoahoc.php';

$db= new Database();
$conn= $db->getConnection();

$khoahoc = new khoahoc($conn);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET'){
    $kq = $khoahoc ->read();
     
    // echo " ua cai gi vai";
    echo json_encode($kq);
}
elseif ($method ==='POST'){
$data = json_decode(file_get_contents("php://input"));

if (isset($data->soluongbuoi) && isset($data->tenkhoahoc) && isset($data->thoigianhoc)) {
    $khoahoc->soluongbuoi = $data->soluongbuoi;
    $khoahoc->tenkhoahoc = $data->tenkhoahoc;
    $khoahoc->thoigianhoc = $data->thoigianhoc;

    if ($khoahoc->create()) {
        echo "oke nha";
    } else {
        http_response_code(500);
        echo "loi j ay";
    }
} else {
    http_response_code(400);
    echo "thieu du lieu ne";
}

}
elseif ($method === 'PUT'){
    $data= json_encode(file_get_contents("php://input"));
    if (isset($data->soluongbuoi) && isset($data->tenkhoahoc) && isset($data->thoigianhoc)){
        $khoahoc->soluongbuoi=$data->soluongbuoi;
        $khoahoc->tenkhoahoc=$data->tenkhoahoc;
        $khoahoc->thoigianhoc=$data->thoigianhoc;

        if ($khoahoc->update()){
            echo "oke nha";
        }
        else {
            http_response_code(500);
            echo "loi j ay";
        }

    }
    else {
        http_response_code(400);
        echo "thieu du lieu ne";
    }
}
elseif ($method === 'DELETE'){
    $data= json_encode(file_get_contents("php://input"));
    if (isset($data->idkhoahoc)){
       
        $khoahoc->idkhoahoc=$data->idkhoahoc;

        if ($khoahoc->delete()){
            echo "oke nha";
        }
        else {
            http_response_code(500);
            echo "loi j ay";
        }

    }
    else {
        http_response_code(400);
        echo "thieu du lieu ne";
    }
}
?>