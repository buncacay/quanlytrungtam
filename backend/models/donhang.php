<?php
class donhang {
    private $conn;
    private $table = "them";

    public $iddonhang;
    public $idhocvien;
    public $idkhoahoc;
    public $trangthaidon;
    public $thoigiandat;
    public $ghichu;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  (idhocvien, idkhoahoc, trangthaidon, thoigiandat) 
                  VALUES (:idhocvien, :idkhoahoc, :trangthaidon, :thoigiandat)";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':idhocvien' => $this->idhocvien,
            ':idkhoahoc' => $this->idkhoahoc,
            ':trangthaidon' => $this->trangthaidon,
            ':thoigiandat' => $this->thoigiandat,
            
        ]);
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table . " 
                  
                  INNER JOIN khoahoc ON them.idkhoahoc = khoahoc.idkhoahoc 
                  WHERE khoahoc.trangthai = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

public function update() {
    // Câu lệnh SQL với các tham số
    $sql = "UPDATE " . $this->table . " 
            SET 
                trangthaidon = :trangthaidon,
                thoigiandat = :thoigiandat
            WHERE idhocvien = :idhocvien AND idkhoahoc = :idkhoahoc";
    
    // Chuẩn bị câu lệnh SQL
    $stmt = $this->conn->prepare($sql);
    
    // Liên kết các tham số với giá trị thực tế
    $stmt->bindParam(':trangthaidon', $this->trangthaidon);
    $stmt->bindParam(':thoigiandat', $this->thoigiandat);
    $stmt->bindParam(':idhocvien', $this->idhocvien);
    $stmt->bindParam(':idkhoahoc', $this->idkhoahoc);

    // Thực thi câu lệnh SQL và trả về kết quả
    return $stmt->execute();  // trả về true nếu thành công, false nếu thất bại
}


    public function delete() {
        $query = "UPDATE " . $this->table . " SET trangthaidon = 0 WHERE iddonhang = :iddonhang";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':iddonhang', $this->iddonhang, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function showById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE iddonhang = :id AND trangthaidon = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function showByHocvienId($id) {
        $query = "SELECT * FROM " . $this->table . " 
                  WHERE idhocvien = :id AND trangthaidon = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
