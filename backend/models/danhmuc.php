<?php
class DanhMuc {
    private $conn;
    private $table = "danhmuc";

    public $iddanhmuc;
    public $tendanhmuc;
    public $trangthai;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Tạo mới danh mục
    public function create() {
        $query = "INSERT INTO " . $this->table . " (tendanhmuc, trangthai) VALUES (:tendanhmuc, 1)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':tendanhmuc', $this->tendanhmuc);

        return $stmt->execute();
    }

    // Đọc tất cả danh mục
    public function read() {
        $query = "SELECT * FROM " . $this->table . " where trangthai=1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Cập nhật danh mục
    public function update() {
        $query = "UPDATE " . $this->table . " SET tendanhmuc = :tendanhmuc WHERE iddanhmuc = :iddanhmuc";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':tendanhmuc', $this->tendanhmuc);
        $stmt->bindParam(':iddanhmuc', $this->iddanhmuc, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // Xoá danh mục (xoá mềm nếu có trạng thái, xoá cứng nếu không có)
    public function delete() {
        $query = "UPDATE " . $this->table . " SET trangthai = 0 WHERE iddanhmuc = :iddanhmuc";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':iddanhmuc', $this->iddanhmuc, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function readById($iddanhmuc) {
    $query = "SELECT * FROM " . $this->table . " WHERE iddanhmuc = :iddanhmuc AND trangthai = 1";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':iddanhmuc', $iddanhmuc, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

}
?>
