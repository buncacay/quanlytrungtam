<?php

class chitietkhoahoc {
    public $idkhoahoc;
    public $idbaihoc;
    public $tenbaihoc;
    public $link;
   
    public $table = "chitietkhoahoc";
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " (idkhoahoc, idbaihoc, tenbaihoc, link) VALUES (:idkhoahoc, :idbaihoc, :tenbaihoc, :link)";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc, PDO::PARAM_INT);
        $stmt->bindParam(':idbaihoc', $this->idbaihoc, PDO::PARAM_INT);
        $stmt->bindParam(':tenbaihoc', $this->tenbaihoc);
        $stmt->bindParam(':link', $this->link);

       
        return $stmt->execute();
    }

    public function update() {
        $query = "UPDATE " . $this->table . " SET tenbaihoc = :tenbaihoc, link = :link WHERE idkhoahoc = :idkhoahoc AND idbaihoc = :idbaihoc";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':tenbaihoc', $this->tenbaihoc);
        $stmt->bindParam(':link', $this->link);
        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc, PDO::PARAM_INT);
        $stmt->bindParam(':idbaihoc', $this->idbaihoc, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function read($limit, $offset) {
        $query = "SELECT * FROM `khoahoc` INNER join chitietnhanvien on khoahoc.idkhoahoc=chitietnhanvien.idkhoahoc 
INNER join nhanvien on chitietnhanvien.idnhanvien=nhanvien.idnhanvien
INNER JOIN chitietkhoahoc on khoahoc.idkhoahoc=chitietkhoahoc.idkhoahoc  where khoahoc.idkhoahoc=:idkhoahoc 
                  LIMIT :limit OFFSET :offset";
        $stmt = $this->conn->prepare($query);
    
        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc, PDO::PARAM_INT);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    

    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE idkhoahoc = :idkhoahoc AND idbaihoc = :idbaihoc";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc, PDO::PARAM_INT);
        $stmt->bindParam(':idbaihoc', $this->idbaihoc, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function deletekhoahoc() {
        $query = "DELETE FROM  " . $this->table . " WHERE idkhoahoc = :idkhoahoc";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc);
        return $stmt->execute();
    }
    

}
?>
