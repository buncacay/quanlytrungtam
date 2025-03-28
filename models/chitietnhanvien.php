<?php
class ChiTietNhanVien {
    private $conn;
    private $table = "chitietnhanvien";

    public $idnhanvien;
    public $idkhoahoc;
    public $tinhtranggiangday;
    public $sogioday;
    public $dongia;
    public $thanhtien;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " (idnhanvien, idkhoahoc, tinhtranggiangday, sogioday, dongia, thanhtien) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iissdd", $this->idnhanvien, $this->idkhoahoc, $this->tinhtranggiangday, $this->sogioday, $this->dongia, $this->thanhtien);
        return $stmt->execute();
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function update() {
        $query = "UPDATE " . $this->table . " SET tinhtranggiangday = ?, sogioday = ?, dongia = ?, thanhtien = ? WHERE idnhanvien = ? AND idkhoahoc = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssddii", $this->tinhtranggiangday, $this->sogioday, $this->dongia, $this->thanhtien, $this->idnhanvien, $this->idkhoahoc);
        return $stmt->execute();
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE idnhanvien = ? AND idkhoahoc = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $this->idnhanvien, $this->idkhoahoc);
        return $stmt->execute();
    }
}
?>