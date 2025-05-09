<?php
class ChiTietNhanVien {
    private $conn;
    private $table = "chitietnhanvien";

    public $idnhanvien;
    public $idkhoahoc;
    public $tinhtranggiangday;
    public $sogioday;
    public $dongia;
    public $thanhtien;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  (idnhanvien, idkhoahoc, tinhtranggiangday, sogioday, dongia, thanhtien) 
                  VALUES (:idnhanvien, :idkhoahoc, :tinhtranggiangday, :sogioday, :dongia, :thanhtien)";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':idnhanvien' => $this->idnhanvien,
            ':idkhoahoc' => $this->idkhoahoc,
            ':tinhtranggiangday' => $this->tinhtranggiangday,
            ':sogioday' => $this->sogioday,
            ':dongia' => $this->dongia,
            ':thanhtien' => $this->thanhtien
        ]);
    }

    public function read() {
    $query = "SELECT * 
          FROM chitietnhanvien ct
          INNER JOIN nhanvien n ON ct.idnhanvien = n.idnhanvien
          WHERE n.trangthai = 1";


        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function update() {
        $query = "UPDATE " . $this->table . " 
                  SET tinhtranggiangday = :tinhtranggiangday, 
                      sogioday = :sogioday, 
                      dongia = :dongia, 
                      thanhtien = :thanhtien 
                  WHERE idnhanvien = :idnhanvien AND idkhoahoc = :idkhoahoc ";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':tinhtranggiangday' => $this->tinhtranggiangday,
            ':sogioday' => $this->sogioday,
            ':dongia' => $this->dongia,
            ':thanhtien' => $this->thanhtien,
            ':idnhanvien' => $this->idnhanvien,
            ':idkhoahoc' => $this->idkhoahoc
        ]);
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table . " 
                  WHERE idnhanvien = :idnhanvien AND idkhoahoc = :idkhoahoc";
        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':idnhanvien' => $this->idnhanvien,
            ':idkhoahoc' => $this->idkhoahoc
        ]);
    }
}
?>
