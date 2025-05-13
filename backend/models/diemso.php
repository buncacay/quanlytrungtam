<?php
class diemso {
    private $conn;
    private $table = "diemso";

    public $id;
    public $idkhoahoc;
    public $idhocvien;
    public $kythi;
    public $diemso;
    public $ghichu;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Thêm điểm
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  (idkhoahoc, idhocvien, kythi, diemso, ghichu) 
                  VALUES (:idkhoahoc, :idhocvien, :kythi, :diemso, :ghichu)";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc);
        $stmt->bindParam(':idhocvien', $this->idhocvien);
        $stmt->bindParam(':kythi', $this->kythi);
        $stmt->bindParam(':diemso', $this->diemso);
        $stmt->bindParam(':ghichu', $this->ghichu);

        return $stmt->execute();
    }

    // Lấy toàn bộ điểm
    public function readAll() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Lấy điểm theo ID học viên
    public function readByHocVien($idhocvien) {
        $query = "SELECT * FROM " . $this->table . " WHERE idhocvien = :idhocvien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':idhocvien', $idhocvien);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Cập nhật điểm
    public function update() {
        $query = "UPDATE " . $this->table . " SET 
                    idkhoahoc = :idkhoahoc,
                    idhocvien = :idhocvien,
                    kythi = :kythi,
                    diemso = :diemso,
                    ghichu = :ghichu
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc);
        $stmt->bindParam(':idhocvien', $this->idhocvien);
        $stmt->bindParam(':kythi', $this->kythi);
        $stmt->bindParam(':diemso', $this->diemso);
        $stmt->bindParam(':ghichu', $this->ghichu);

        return $stmt->execute();
    }

    // Xóa điểm
    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        return $stmt->execute();
    }
}
?>
