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
        $query = "INSERT INTO chitiethocvien (idkhoahoc, idhocvien, tinhtranghocphi, ghichu, ketquahoctap)
                     VALUES (:idkhoahoc, :idhocvien, :tinhtranghocphi, :ghichu, :ketquahoctap)";
                   
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
        ':idkhoahoc' => $this->idkhoahoc,
        ':idhocvien' => $this->idhocvien,
        ':tinhtranghocphi' => $this->tinhtranghocphi,  // Đảm bảo trường này có giá trị
        ':ghichu' => $this->ghichu,
        ':ketquahoctap' => $this->ketquahoctap
        ]); 

    }

    public function read() {
        $query ="SELECT * FROM " . $this->table . " inner join khoahoc on khoahoc.idkhoahoc = chitiethocvien.idkhoahoc inner join hocvien on hocvien.idhocvien = chitiethocvien.idhocvien where hocvien.trangthia=1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function update() {
        $query = "UPDATE " . $this->table . " 
                  SET tinhtranghocphi = :tinhtranghocphi, ketquahoctap = :ketquahoctap, ghichu = :ghichu 
                  WHERE idhocvien = :idhocvien AND idkhoahoc = :idkhoahoc " ;
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':tinhtranghocphi' => $this->tinhtranghocphi,
            ':ketquahoctap' => $this->ketquahoctap,
            ':ghichu' => $this->ghichu,
            ':idhocvien' => $this->idhocvien,
            ':idkhoahoc' => $this->idkhoahoc
            
        ]);
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE idhocvien = :idhocvien AND idkhoahoc = :idkhoahoc";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':idhocvien' => $this->idhocvien,
            ':idkhoahoc' => $this->idkhoahoc
            
        ]);
    }

    public function getById($idhocvien){
        $query = "SELECT * FROM " . $this->table . " inner join khoahoc on khoahoc.idkhoahoc = chitiethocvien.idkhoahoc WHERE idhocvien = :idhocvien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':idhocvien', $idhocvien, PDO::PARAM_INT);
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $results ?: null;
    }

     public function getByIdkhoahoc($idhocvien){
        $query = "SELECT * FROM " . $this->table . " inner join khoahoc on khoahoc.idkhoahoc = chitiethocvien.idkhoahoc inner join hocvien on hocvien.idhocvien = chitiethocvien.idhocvien WHERE khoahoc.idkhoahoc = :idhocvien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':idhocvien', $idhocvien, PDO::PARAM_INT);
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $results ?: null;
    }

 public function getAll($idkhoahoc, $idhocvien) {
    $query = "SELECT * FROM chitiethocvien 
              INNER JOIN khoahoc ON khoahoc.idkhoahoc = chitiethocvien.idkhoahoc 
              INNER JOIN hocvien ON hocvien.idhocvien = chitiethocvien.idhocvien 
              WHERE chitiethocvien.idkhoahoc = :idkhoahoc 
              AND chitiethocvien.idhocvien = :idhocvien and hocvien.trangthia=1";
    
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':idhocvien', $idhocvien, PDO::PARAM_INT);
    $stmt->bindParam(':idkhoahoc', $idkhoahoc, PDO::PARAM_INT);
    $stmt->execute();

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $results ?: null;
}

}
?>
