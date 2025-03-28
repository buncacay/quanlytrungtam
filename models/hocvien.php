<?php
class hocvien {
    public $idhocvien;
    public $hoten;
    public $ngaysinh;
    public $sdt;
    public $diachi;
    public $sdtph;

    public $conn;
    public $table = "hocvien";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " (hoten, ngaysinh, sdt, diachi, sdtph) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssss", $this->hoten, $this->ngaysinh, $this->sdt, $this->diachi, $this->sdtph);

        return $stmt->execute();
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function update() {
        $query = "UPDATE " . $this->table . " SET hoten = ?, ngaysinh = ?, sdt = ?, diachi = ?, sdtph = ? WHERE idhocvien = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssssi", $this->hoten, $this->ngaysinh, $this->sdt, $this->diachi, $this->sdtph, $this->idhocvien);

        return $stmt->execute();
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE idhocvien = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->idhocvien);

        return $stmt->execute();
    }
}
?>