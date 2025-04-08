<?php
class khoahoc{
    public $idkhoahoc;
    public $tenkhoahoc;
    public $thoigianhoc;
    public $soluongbuoi;

    public $conn;
    public $table = "khoahoc";

    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){
        $query = "INSERT INTO " . $this->table. "(tenkhoahoc, thoigianhoc, soluongbuoi) values (?,?,?)";
        $stmt = $this->conn-> prepare($query);
        $stmt->bind_param("ssi", $this->tenkhoahoc, $this->thoigianhoc, $this->soluongbuoi);
        return $stmt->execute();
    }


      public function read() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function update(){
        $query = "UPDATE ". $this->table . "set tenkhoahoc = ?, thoigianhoc = ?, soluongbuoi =? where idkhoahoc = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssii", $this->tenkhoahoc, $this->thoigianhoc, $this->soluongbuoi, $this->idkhoahoc);
        return $stmt->execute();
    }

    public function delete(){
        $query = "DELETE FROM ". $this->table." where idkhoahoc =?";
        $stmt = $this->conn->prepare($query);
        $stmt.bind_param("i", $this->idkhoahoc);
        return $stmt->execute();
    }
}

?>