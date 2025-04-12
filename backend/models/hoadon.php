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
                  (thoigianlap, tenhoadon, nguoilap, soluongmua, dongia, giamgia, thanhtien) 
                  VALUES (:thoigianlap, :tenhoadon, :nguoilap, :soluongmua, :dongia, :giamgia, :thanhtien)";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':thoigianlap' => $this->thoigianlap,
            ':tenhoadon' => $this->tenhoadon,
            ':nguoilap' => $this->nguoilap,
            ':soluongmua' => $this->soluongmua,
            ':dongia' => $this->dongia,
            ':giamgia' => $this->giamgia,
            ':thanhtien' => $this->thanhtien
        ]);
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function update() {
        $query = "UPDATE " . $this->table . " 
                  SET tenhoadon = :tenhoadon, 
                      nguoilap = :nguoilap, 
                      soluongmua = :soluongmua, 
                      dongia = :dongia, 
                      giamgia = :giamgia, 
                      thanhtien = :thanhtien, 
                      thoigianlap = :thoigianlap 
                  WHERE idhoadon = :idhoadon";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':tenhoadon' => $this->tenhoadon,
            ':nguoilap' => $this->nguoilap,
            ':soluongmua' => $this->soluongmua,
            ':dongia' => $this->dongia,
            ':giamgia' => $this->giamgia,
            ':thanhtien' => $this->thanhtien,
            ':thoigianlap' => $this->thoigianlap,
            ':idhoadon' => $this->idhoadon
        ]);
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE idhoadon = :idhoadon";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([':idhoadon' => $this->idhoadon]);
    }

    public function showById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE idhoadon = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? $result : null;
    }
}
?>
