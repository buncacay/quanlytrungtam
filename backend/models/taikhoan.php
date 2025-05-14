<?php
class taikhoan {
    private $conn;
    private $table = "taikhoan"; // tên bảng trong database

    public $idtaikhoan;
    public $user;
    public $pass;
    public $role;
    public $date;
    public $trangthai;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Tạo tài khoản mới
    public function create() {
        // Kiểm tra xem tài khoản đã tồn tại chưa
        if ($this->exists($this->user)) {
            error_log("Tên đăng nhập đã tồn tại: " . $this->user);
            return false;
        }

        $query = "INSERT INTO " . $this->table . " 
            (username, password, role, created_at, trangthai) 
            VALUES (:username, :password, :role, :created_at, 1)";
        
        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->conn->errorInfo());
            return false;
        }

        $stmt->bindParam(':username', $this->user);
        $stmt->bindParam(':password', $this->pass);
        $stmt->bindParam(':role', $this->role);
        $stmt->bindParam(':created_at', $this->date);

        if (!$stmt->execute()) {
            error_log("Execute failed: " . $stmt->errorInfo());
            return false;
        }
        return true;
    }

    // Kiểm tra sự tồn tại của tài khoản
    public function exists($username) {
        $query = "SELECT COUNT(*) FROM " . $this->table . " WHERE username = :username";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->execute();
        
        // Nếu số lượng tài khoản có tên đăng nhập trùng là > 0, nghĩa là tài khoản đã tồn tại
        $count = $stmt->fetchColumn();
        return $count > 0;
    }

    // Lấy danh sách tài khoản chưa bị xóa
    public function read() {
        $query = "SELECT * FROM " . $this->table . " WHERE trangthai = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getUserByUsername($username) {
        $query = "SELECT * FROM `taikhoan` WHERE `username` = :username";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        
        // Return the result as an associative array
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Cập nhật tài khoản
    public function update() {
        $query = "UPDATE " . $this->table . " SET 
                    username = :username, 
                    password = :password, 
                    role = :role,
                    trangthai = :trangthai
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':username', $this->user);
        $stmt->bindParam(':password', $this->pass);
        $stmt->bindParam(':role', $this->role);
        $stmt->bindParam(':trangthai', $this->trangthai);
        $stmt->bindParam(':id', $this->idtaikhoan, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // Xóa mềm tài khoản: chỉ set trangthai = 0
    public function delete() {
        $query = "UPDATE " . $this->table . " SET trangthai = 0 WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->idtaikhoan, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function hocvien($username) {
        $query = "SELECT * FROM `taikhoan`  inner join hocvien on hocvien.user = taikhoan. username where   `username` = :username";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        
        // Return the result as an associative array
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function giangvien($username) {
        $query = "SELECT * FROM `taikhoan`  inner join nhanvien on nhanvien.user = taikhoan. username where   `username` = :username";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        
        // Return the result as an associative array
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

}
?>
