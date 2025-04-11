<?php
class ChiTietHocVien {
    private $conn;
    private $table = "chitiethocvien";

    public $idhocvien;
    public $idkhoahoc;
    public $idhoadon;
    public $tinhtranghocphi;
    public $ketquahoctap;
    public $ghichu;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " (idhocvien, idkhoahoc, idhoadon, tinhtranghocphi, ketquahoctap, ghichu) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iiissss", $this->idhocvien, $this->idkhoahoc, $this->idhoadon, $this->tinhtranghocphi, $this->ketquahoctap, $this->ghichu);
        return $stmt->execute();
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function update() {
        $query = "UPDATE " . $this->table . " SET tinhtranghocphi = ?, ketquahoctap = ?, ghichu = ? WHERE idhocvien = ? AND idkhoahoc = ? AND idhoadon = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssiii", $this->tinhtranghocphi, $this->ketquahoctap, $this->ghichu, $this->idhocvien, $this->idkhoahoc, $this->idhoadon);
        return $stmt->execute();
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE idhocvien = ? AND idkhoahoc = ? AND idhoadon = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iii", $this->idhocvien, $this->idkhoahoc, $this->idhoadon);
        return $stmt->execute();
    }
}
?>