<?php
class Database {
    private $servername = "localhost";
    private $username = "root";
    private $password = "";
    private $dbname = "language_center";
    private $charset = "utf8mb4";
    public $conn;

    public function getConnection() {
        try {
            $dsn = "mysql:host={$this->servername};dbname={$this->dbname};charset={$this->charset}";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            
           
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // echo "thanh cong";
            return $this->conn;
        } catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }
}
?>
