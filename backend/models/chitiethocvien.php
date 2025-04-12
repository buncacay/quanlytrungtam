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
        $query = "INSERT INTO " . $this->table . " 
                  (idhocvien, idkhoahoc, idhoadon, tinhtranghocphi, ketquahoctap, ghichu) 
                  VALUES (:idhocvien, :idkhoahoc, :idhoadon, :tinhtranghocphi, :ketquahoctap, :ghichu)";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':idhocvien' => $this->idhocvien,
            ':idkhoahoc' => $this->idkhoahoc,
            ':idhoadon' => $this->idhoadon,
            ':tinhtranghocphi' => $this->tinhtranghocphi,
            ':ketquahoctap' => $this->ketquahoctap,
            ':ghichu' => $this->ghichu
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
                  SET tinhtranghocphi = :tinhtranghocphi, ketquahoctap = :ketquahoctap, ghichu = :ghichu 
                  WHERE idhocvien = :idhocvien AND idkhoahoc = :idkhoahoc AND idhoadon = :idhoadon";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':tinhtranghocphi' => $this->tinhtranghocphi,
            ':ketquahoctap' => $this->ketquahoctap,
            ':ghichu' => $this->ghichu,
            ':idhocvien' => $this->idhocvien,
            ':idkhoahoc' => $this->idkhoahoc,
            ':idhoadon' => $this->idhoadon
        ]);
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table . " 
                  WHERE idhocvien = :idhocvien AND idkhoahoc = :idkhoahoc AND idhoadon = :idhoadon";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':idhocvien' => $this->idhocvien,
            ':idkhoahoc' => $this->idkhoahoc,
            ':idhoadon' => $this->idhoadon
        ]);
    }

    public function getById($idhocvien){
        $query = "SELECT * FROM " . $this->table . " WHERE idhocvien = :idhocvien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':idhocvien', $idhocvien, PDO::PARAM_INT);
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $results ?: null;
    }
}
?>
