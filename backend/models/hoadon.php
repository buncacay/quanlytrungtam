<?php
class Hoadon {
    private $conn;
    private $table = "hoadon";

    public $idhoadon;
    public $tenhoadon;
    public $nguoilap;
    public $soluongmua;
    public $dongia;
    public $giamgia;
    public $thanhtien;
    public $thoigianlap;
    public $loai;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  (thoigianlap, tenhoadon,  giamgia, thanhtien, idhocvien, idkhoahoc, loai) 
                  VALUES (:thoigianlap, :tenhoadon, :giamgia, :thanhtien, :idhocvien, :idkhoahoc, :loai)";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':thoigianlap' => $this->thoigianlap,
            ':tenhoadon' => $this->tenhoadon,
            ':idkhoahoc' => $this->idkhoahoc,
            ':idhocvien' => $this->idhocvien,
            // ':soluongmua' => $this->soluongmua,
            // ':dongia' => $this->dongia,
            ':giamgia' => $this->giamgia,
            ':thanhtien' => $this->thanhtien,
             ':loai' => $this->loai
        ]);
    }

    public function read() {
        $query = " 
SELECT 
    hoadon.idhoadon, 
    hoadon.tenhoadon, 
    hoadon.thanhtien, 
    hoadon.thoigianlap, 
    hoadon.loai, 
    IF(hoadon.loai = 0, nhanvien.tennhanvien, hocvien.hoten) AS hoten, 
    IF(hoadon.loai = 0, '0', IF(hoadon.loai = 1 AND khoahoc.idkhoahoc IS NOT NULL, khoahoc.tenkhoahoc, '')) AS tenkhoahoc
FROM hoadon
LEFT JOIN nhanvien ON hoadon.idhocvien = nhanvien.idnhanvien
LEFT JOIN hocvien ON hoadon.idhocvien = hocvien.idhocvien
LEFT JOIN khoahoc ON hoadon.idkhoahoc = khoahoc.idkhoahoc -- LEFT JOIN với khoahoc để xử lý cả trường hợp loai = 1
WHERE hoadon.trangthai = 1;



";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

 public function update() {
    $query = "UPDATE " . $this->table . " 
              SET tenhoadon = :tenhoadon, 
                  idkhoahoc = :idkhoahoc,
                  idhocvien = :idhocvien,
                  giamgia = :giamgia, 
                  thanhtien = :thanhtien, 
                  thoigianlap = :thoigianlap,
                  loai = :loai 
              WHERE idhoadon = :idhoadon";

    $stmt = $this->conn->prepare($query);

    $result = $stmt->execute([
        ':tenhoadon' => $this->tenhoadon,
        ':idkhoahoc' => $this->idkhoahoc,
        ':idhocvien' => $this->idhocvien,
        ':giamgia' => $this->giamgia,
        ':thanhtien' => $this->thanhtien,
        ':thoigianlap' => $this->thoigianlap,
        ':idhoadon' => $this->idhoadon,
        ':loai' => $this->loai
    ]);

    if (!$result) {
        print_r($stmt->errorInfo()); // Xem thông báo lỗi chi tiết
    }

    return $result;
}

    public function delete() {
        // 1 la con 
        // 0 la da bi xoa
  
  
          $query = "UPDATE " . $this->table . " SET trangthai = 0 WHERE idhoadon = :idhoadon";
          $stmt = $this->conn->prepare($query);
  
          $stmt->bindParam(':idhoadon', $this->idhoadon, PDO::PARAM_INT);
  
          return $stmt->execute();
      }

    public function showById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE idhoadon = :id and trangthai=1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? $result : null;
    }
    
   public function showByIdhocvien($id) {
    $query = "SELECT * FROM " . $this->table . " WHERE idhocvien = :id and trangthai = 1";
    $stmt = $this->conn->prepare($query);
    $stmt->execute([':id' => $id]);

    // Dùng fetchAll để lấy tất cả kết quả
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Kiểm tra nếu có dữ liệu trả về
    return $result ? $result : null;
}

}
?>
