<?php
class khoahoc {
    public $idkhoahoc;
    public $tenkhoahoc;
    public $thoigianhoc;
    public $soluongbuoi;

    public $conn;
    public $table = "khoahoc";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " (tenkhoahoc, thoigianhoc, soluongbuoi, lichhoc) VALUES (:tenkhoahoc, :thoigianhoc, :soluongbuoi, :lichhoc)";
        $stmt = $this->conn->prepare($query);

        // Bind parameters
        $stmt->bindParam(':tenkhoahoc', $this->tenkhoahoc);
        $stmt->bindParam(':thoigianhoc', $this->thoigianhoc);
        $stmt->bindParam(':soluongbuoi', $this->soluongbuoi, PDO::PARAM_INT);
        $stmt->bindParam(':lichhoc', $this->lichhoc);

        $success = $stmt->execute();
        if ($success) {
            $this->idkhoahoc = $this->conn->lastInsertId(); 
            return $this->idkhoahoc;
        }
        return null;
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        // Fetch all rows
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function update() {
        $query = "UPDATE " . $this->table . " SET tenkhoahoc = :tenkhoahoc, thoigianhoc = :thoigianhoc, soluongbuoi = :soluongbuoi, lichhoc= :lichhoc WHERE idkhoahoc = :idkhoahoc";
        $stmt = $this->conn->prepare($query);

        // Bind parameters
        $stmt->bindParam(':tenkhoahoc', $this->tenkhoahoc);
        $stmt->bindParam(':thoigianhoc', $this->thoigianhoc);
        $stmt->bindParam(':soluongbuoi', $this->soluongbuoi, PDO::PARAM_INT);
        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc, PDO::PARAM_INT);
        $stmt->bindParam(':lichhoc', $this->lichhoc);

        return $stmt->execute();
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE idkhoahoc = :idkhoahoc";
        $stmt = $this->conn->prepare($query);

        // Bind parameters
        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function getChiTietKhoaHoc(){
        
            $query = "SELECT * 
                      FROM nhanvien 
                      INNER JOIN chitietnhanvien ON nhanvien.idnhanvien = chitietnhanvien.idnhanvien 
                      INNER JOIN khoahoc ON khoahoc.idkhoahoc = chitietnhanvien.idkhoahoc";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
        
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
