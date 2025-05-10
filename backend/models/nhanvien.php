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
        $query = "INSERT INTO " . $this->table . " (tennhanvien, trinhdo, chungchi, sdt, diachi, tienthuong, tienphat, chucvu, tonggioday, ghichu,trangthai) 
                  VALUES (:tennhanvien, :trinhdo, :chungchi, :sdt, :diachi, :tienthuong, :tienphat, :chucvu, :tonggioday, :ghichu, 1)";
        $stmt = $this->conn->prepare($query);

        // Bind parameters
        $stmt->bindParam(':tennhanvien', $this->tennhanvien);
        $stmt->bindParam(':trinhdo', $this->trinhdo);
        $stmt->bindParam(':chungchi', $this->chungchi);
        $stmt->bindParam(':sdt', $this->sdt);
        $stmt->bindParam(':diachi', $this->diachi);
        $stmt->bindParam(':tienthuong', $this->tienthuong, PDO::PARAM_INT);
        $stmt->bindParam(':tienphat', $this->tienphat, PDO::PARAM_INT);
        $stmt->bindParam(':chucvu', $this->chucvu);
        $stmt->bindParam(':tonggioday', $this->tonggioday, PDO::PARAM_INT);
        $stmt->bindParam(':ghichu', $this->ghichu);

        return $stmt->execute();
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table . " WHERE trangthai = 1";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        // Fetch all rows
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function update() {
        $query = "UPDATE " . $this->table . " SET 
                  tennhanvien = :tennhanvien, 
                  trinhdo = :trinhdo, 
                  chungchi = :chungchi, 
                  sdt = :sdt, 
                  tienthuong = :tienthuong, 
                  tienphat = :tienphat, 
                  chucvu = :chucvu, 
                  tonggioday = :tonggioday, 
                  ghichu = :ghichu ,
                   trangthai = :trangthai 
                  WHERE idnhanvien = :idnhanvien";
        $stmt = $this->conn->prepare($query);

        // Bind parameters
        $stmt->bindParam(':tennhanvien', $this->tennhanvien);
        $stmt->bindParam(':trinhdo', $this->trinhdo);
        $stmt->bindParam(':chungchi', $this->chungchi);
        $stmt->bindParam(':sdt', $this->sdt);
       
        $stmt->bindParam(':tienthuong', $this->tienthuong, PDO::PARAM_INT);
        $stmt->bindParam(':tienphat', $this->tienphat, PDO::PARAM_INT);
        $stmt->bindParam(':chucvu', $this->chucvu);
        $stmt->bindParam(':tonggioday', $this->tonggioday, PDO::PARAM_INT);
        $stmt->bindParam(':ghichu', $this->ghichu);
        $stmt->bindParam(':idnhanvien', $this->idnhanvien, PDO::PARAM_INT);
         $stmt->bindParam(':trangthai', $this->trangthai);

        return $stmt->execute();
    }

    public function delete() {
   $query = "UPDATE " . $this->table . " SET trangthai = 0 WHERE idnhanvien = :idnhanvien";

        $stmt = $this->conn->prepare($query);

        // Bind parameters
        $stmt->bindParam(':idnhanvien', $this->idnhanvien, PDO::PARAM_INT);

        return $stmt->execute();
    }
    
    public function CapNhatTongGioDay() {
        $sql = "UPDATE nhanvien n
                JOIN (
                    SELECT idnhanvien, SUM(sogioday) AS total_hours
                    FROM chitietnhanvien
                    GROUP BY idnhanvien
                ) c ON n.idnhanvien = c.idnhanvien
                SET n.tonggioday = c.total_hours";
    
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
    }
    
}
?>
