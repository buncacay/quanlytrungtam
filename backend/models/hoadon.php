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

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  (thoigianlap, tenhoadon,  giamgia, thanhtien, idhocvien, idkhoahoc) 
                  VALUES (:thoigianlap, :tenhoadon, :giamgia, :thanhtien, :idhocvien, :idkhoahoc)";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':thoigianlap' => $this->thoigianlap,
            ':tenhoadon' => $this->tenhoadon,
            ':idkhoahoc' => $this->idkhoahoc,
            ':idhocvien' => $this->idhocvien,
            // ':soluongmua' => $this->soluongmua,
            // ':dongia' => $this->dongia,
            ':giamgia' => $this->giamgia,
            ':thanhtien' => $this->thanhtien
        ]);
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table . " INNER join hocvien on hoadon.idhocvien=hocvien.idhocvien INNER JOIN khoahoc on khoahoc.idkhoahoc=hoadon.idkhoahoc where hoadon.trangthai=1";
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
                      thoigianlap = :thoigianlap 
                  WHERE idhoadon = :idhoadon";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':tenhoadon' => $this->tenhoadon,
            ':nguoilap' => $this->nguoilap,
            // ':soluongmua' => $this->soluongmua,
            // ':dongia' => $this->dongia,
            ':giamgia' => $this->giamgia,
            ':thanhtien' => $this->thanhtien,
            ':thoigianlap' => $this->thoigianlap,
            ':idhoadon' => $this->idhoadon
        ]);
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
}
?>
