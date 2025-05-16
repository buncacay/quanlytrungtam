<?php
class DanhMuc {
    private $conn;
    private $table = "danhmuc";

    public $iddanhmuc;
    public $tendanhmuc;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Tạo mới danh mục
    public function create() {
        $query = "INSERT INTO " . $this->table . " (tendanhmuc) VALUES (:tendanhmuc)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':tendanhmuc', $this->tendanhmuc);

        return $stmt->execute();
    }

    // Đọc tất cả danh mục
    public function read() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY iddanhmuc DESC";
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
        $query = "DELETE FROM " . $this->table . " WHERE iddanhmuc = :iddanhmuc";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':iddanhmuc', $this->iddanhmuc, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // Hiển thị danh mục theo ID
    public function showById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE iddanhmuc = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => $id]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
