<?php
class nhanvien {
    private $conn;
    private $table = "nhanvien";

    public $idnhanvien;
    public $tennhanvien;
    public $trinhdo;
    public $chungchi;
    public $sdt;
    public $diachi;
    public $tienthuong;
    public $tienphat;
    public $chucvu;
    public $tonggioday;
    public $ghichu;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " (tennhanvien, trinhdo, chungchi, sdt, diachi, tienthuong, tienphat, chucvu, tonggioday, ghichu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssssddsds", $this->tennhanvien, $this->trinhdo, $this->chungchi, $this->sdt, $this->diachi, $this->tienthuong, $this->tienphat, $this->chucvu, $this->tonggioday, $this->ghichu);
        return $stmt->execute();
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function update() {
        $query = "UPDATE " . $this->table . " SET tennhanvien = ?, trinhdo = ?, chungchi = ?, sdt = ?, diachi = ?, tienthuong = ?, tienphat = ?, chucvu = ?, tonggioday = ?, ghichu = ? WHERE idnhanvien = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssssddsdss", $this->tennhanvien, $this->trinhdo, $this->chungchi, $this->sdt, $this->diachi, $this->tienthuong, $this->tienphat, $this->chucvu, $this->tonggioday, $this->ghichu, $this->idnhanvien);
        return $stmt->execute();
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE idnhanvien = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->idnhanvien);
        return $stmt->execute();
    }
}
?>