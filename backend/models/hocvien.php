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
        $query = "INSERT INTO " . $this->table . " (hoten, ngaysinh, sdt, diachi, sdtph) 
                  VALUES (:hoten, :ngaysinh, :sdt, :diachi, :sdtph)";
        $stmt = $this->conn->prepare($query);
    
        $success = $stmt->execute([
            ':hoten' => $this->hoten,
            ':ngaysinh' => $this->ngaysinh,
            ':sdt' => $this->sdt,
            ':diachi' => $this->diachi,
            ':sdtph' => $this->sdtph
        ]);
    
        if ($success) {
            $this->idhocvien = $this->conn->lastInsertId(); 
            return true;
        }
    
        return false;
    }
    
    public function countAll() {
        $query = "SELECT COUNT(*) as total FROM hocvien";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }
    

    public function read($limit, $offset) {
        $query = "SELECT * FROM " . $this->table . " LIMIT :limit OFFSET :offset";
        $stmt = $this->conn->prepare($query);
    
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    

    public function update() {
        $query = "UPDATE " . $this->table . " 
                  SET hoten = :hoten, ngaysinh = :ngaysinh, sdt = :sdt, diachi = :diachi, sdtph = :sdtph 
                  WHERE idhocvien = :idhocvien";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            ':hoten' => $this->hoten,
            ':ngaysinh' => $this->ngaysinh,
            ':sdt' => $this->sdt,
            ':diachi' => $this->diachi,
            ':sdtph' => $this->sdtph,
            ':idhocvien' => $this->idhocvien
        ]);
    }

    public function delete() {
        $query1 = "DELETE FROM chitiethocvien WHERE idhocvien = :idhocvien";
        $stmt1 = $this->conn->prepare($query1);
        $stmt1->execute([':idhocvien' => $this->idhocvien]);

        $query = "DELETE FROM " . $this->table . " WHERE idhocvien = :idhocvien";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([':idhocvien' => $this->idhocvien]);
    }

    public function showById($id) {
        // $query = "SELECT * FROM chitiethocvien c 
        //           INNER JOIN hocvien h ON c.idhocvien = h.idhocvien 
        //           INNER JOIN khoahoc kh ON kh.idkhoahoc = c.idkhoahoc
        //           INNER JOIN hoadon hd ON hd.idhocvien = h.idhocvien
        //           WHERE c.idhocvien = :id";
    
        $query = "SELECT * FROM chitiethocvien c 
                    INNER JOIN khoahoc kh ON kh.idkhoahoc = c.idkhoahoc 
                    INNER JOIN hocvien h ON c.idhocvien = h.idhocvien 
                    WHERE c.idhocvien = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
    
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
}
?>
