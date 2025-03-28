<?php
class hoadon {
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
        $query = "INSERT INTO " . $this->table . " (thoigianlap, tenhoadon, nguoilap, soluongmua, dongia, giamgia, thanhtien) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("siiddds", $this->tenhoadon, $this->nguoilap, $this->soluongmua, $this->dongia, $this->giamgia, $this->thanhtien, $this->thoigianlap);
        return $stmt->execute();
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function update() {
        $query = "UPDATE " . $this->table . " SET tenhoadon = ?, nguoilap = ?, soluongmua = ?, dongia = ?, giamgia = ?, thanhtien = ?, thoigianlap = ? WHERE idhoadon = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssiidddi",$this->thoigianlap, $this->tenhoadon, $this->nguoilap, $this->soluongmua, $this->dongia, $this->giamgia, $this->thanhtien, $this->idhoadon);
        return $stmt->execute();
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE idhoadon = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->idhoadon);
        return $stmt->execute();
    }
}
?>