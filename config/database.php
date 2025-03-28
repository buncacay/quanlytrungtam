<?php
class Database {
    private $servername = "localhost"; 
    private $username = "root"; 
    private $password = ""; 
    private $dbname = "language_center"; 
    public $conn;

    public function getConnection() {
        // Create connection
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);

        // Check connection
        if ($this->conn->connect_error) {
            die('Connection failed: ' . $this->conn->connect_error);
        }
        else {
            // echo 'succesfucc';
        }
        return $this->conn;
    }
}