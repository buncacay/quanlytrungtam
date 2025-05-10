<?php
class ChiTietNhanVien {
    private $conn;
    private $table = "chitietnhanvien";

    public $idnhanvien;
    public $idkhoahoc;
    public $tinhtranggiangday;
    public $thoigianketthuc;
    public $dongia;
    public $thoigianbatdau;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  (idnhanvien, idkhoahoc, thoigianketthuc, dongia, thoigianbatdau) 
                  VALUES (:idnhanvien, :idkhoahoc, :thoigianketthuc, :dongia, :thoigianbatdau)";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':idnhanvien' => $this->idnhanvien,
            ':idkhoahoc' => $this->idkhoahoc,
            ':thoigianketthuc' => $this->thoigianketthuc,
            ':dongia' => $this->dongia,
            ':thoigianbatdau' => $this->thoigianbatdau
        ]);
    }

    public function read() {
    $query = "SELECT * 
          FROM chitietnhanvien ct
          INNER JOIN nhanvien n ON ct.idnhanvien = n.idnhanvien
          INNER JOIN khoahoc ON khoahoc.idkhoahoc = ct.idkhoahoc
          WHERE n.trangthai = 1";


        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function update() {
        $query = "UPDATE " . $this->table . " 
                  SET  
                      thoigianketthuc = :thoigianketthuc, 
                      dongia = :dongia, 
                      thoigianbatdau = :thoigianbatdau 
                  WHERE idnhanvien = :idnhanvien AND idkhoahoc = :idkhoahoc ";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':thoigianketthuc' => $this->thoigianketthuc,
            ':dongia' => $this->dongia,
            ':thoigianbatdau' => $this->thoigianbatdau,
            ':idnhanvien' => $this->idnhanvien,
            ':idkhoahoc' => $this->idkhoahoc
        ]);
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table . " 
                  WHERE idnhanvien = :idnhanvien AND idkhoahoc = :idkhoahoc";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':idnhanvien' => $this->idnhanvien,
            ':idkhoahoc' => $this->idkhoahoc
        ]);
    }
}
?>
