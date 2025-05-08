<?php

class KhoaHoc {
    public $idkhoahoc;
    public $tenkhoahoc;
    public $thoigianhoc;
    public $soluongbuoi;
    public $lichhoc;
    public $diadiemhoc;
    public $mota;
    public $image; // Ảnh tải lên
    public $conn;
    public $table = "khoahoc";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " 
            (tenkhoahoc, thoigianhoc, soluongbuoi, lichhoc, diadiemhoc,mota, images, giatien, giamgia) 
            VALUES (:tenkhoahoc, :thoigianhoc, :soluongbuoi, :lichhoc, :diadiemhoc, :mota,  :images, :giatien, :giamgia)";
        
        $stmt = $this->conn->prepare($query);
    
        // Gán dữ liệu
        $stmt->bindParam(':tenkhoahoc', $this->tenkhoahoc);
        $stmt->bindParam(':thoigianhoc', $this->thoigianhoc);
        $stmt->bindParam(':soluongbuoi', $this->soluongbuoi, PDO::PARAM_INT);
        $stmt->bindParam(':lichhoc', $this->lichhoc);
        $stmt->bindParam(':diadiemhoc', $this->diadiemhoc);
        $stmt->bindParam(':mota', $this->mota);
        $stmt->bindParam(':giatien', $this->giatien);
        $stmt->bindParam(':giamgia', $this->giamgia);
        // Xử lý ảnh
        if (isset($this->image) && move_uploaded_file($this->image['tmp_name'], 'uploads/' . $this->image['name'])) {
            $this->images = 'uploads/' . $this->image['name']; // Lưu đường dẫn vào biến images
        } else {
            $this->images = "not found"; // hoặc gán 1 ảnh mặc định nếu cần
        }
    
        $stmt->bindParam(':images', $this->images);
    
        // Thực thi và trả kết quả
        if ($stmt->execute()) {
            $this->idkhoahoc = $this->conn->lastInsertId();
            return $this->idkhoahoc;
        }
    
        return null;
    }
    
    public function countAll() {
        $query = "SELECT COUNT(*) as total FROM khoahoc";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }
    

    public function update() {
        $query = "UPDATE " . $this->table . " SET 
                  tenkhoahoc = :tenkhoahoc, 
                  thoigianhoc = :thoigianhoc, 
                  soluongbuoi = :soluongbuoi, 
                  lichhoc = :lichhoc, 
                  mota = :mota,
                  images = :images,
                  giatien = :giatien,
                  giamgia = :giamgia 
                  WHERE idkhoahoc = :idkhoahoc and trangthai = 1";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':tenkhoahoc', $this->tenkhoahoc);
        $stmt->bindParam(':thoigianhoc', $this->thoigianhoc);
        $stmt->bindParam(':soluongbuoi', $this->soluongbuoi, PDO::PARAM_INT);
        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc, PDO::PARAM_INT);
        $stmt->bindParam(':lichhoc', $this->lichhoc);
        $stmt->bindParam(':mota', $this->mota);
        $stmt->bindParam(':giatien', $this->giatien);
        $stmt->bindParam(':giamgia', $this->giamgia);
        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc);
        if (isset($this->image) && move_uploaded_file($this->image['tmp_name'], 'uploads/' . $this->image['name'])) {
            $imagePath = 'uploads/' . $this->image['name'];  // Đường dẫn ảnh
            $stmt->bindParam(':images', $imagePath);  // Bind đường dẫn ảnh
        } else {
            $stmt->bindParam(':images', $nullValue = NULL, PDO::PARAM_NULL);
        }

        return $stmt->execute();
    }

    public function read($limit, $offset) {
        $query = "SELECT * FROM " . $this->table . " where trangthai = 1 LIMIT :limit OFFSET :offset";
        $stmt = $this->conn->prepare($query);
    
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function delete() {
      // 1 la con 
      // 0 la da bi xoa


        $query = "UPDATE " . $this->table . " SET trangthai = 0 WHERE idkhoahoc = :idkhoahoc";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function getChiTietKhoaHoc($limit, $offset, $search) {
        $query = "SELECT * FROM `khoahoc`
                  INNER JOIN chitietnhanvien 
                  ON khoahoc.idkhoahoc = chitietnhanvien.idkhoahoc
                  INNER JOIN nhanvien ON nhanvien.idnhanvien = chitietnhanvien.idnhanvien ";
    
        $conditions = [];
        if (!empty($search)) {
            $conditions[] = "(khoahoc.tenkhoahoc LIKE :search OR chitietnhanvien.tennhanvien LIKE :search)";
        }
    
        if (count($conditions) > 0) {
            $query .= " WHERE " . implode(" AND ", $conditions);
        }
    
        if ($limit && $offset) {
            $query .= " LIMIT :limit OFFSET :offset";
        }
    
        $stmt = $this->conn->prepare($query);
    
        if (!empty($search)) {
            $stmt->bindValue(':search', '%' . $search . '%', PDO::PARAM_STR);
        }
        
        if ($limit && $offset) {
            $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int) $offset, PDO::PARAM_INT);
        }
    
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateGia() {
        $query = "UPDATE " . $this->table . " SET 
                  giatien = :giatien,
                  giamgia = :giamgia 
                  WHERE idkhoahoc = :idkhoahoc and trangthai = 1";
        $stmt = $this->conn->prepare($query);
    
        // Đảm bảo tên tham số trong bindParam khớp với tên trong câu truy vấn SQL
        $stmt->bindParam(':giatien', $this->giatien);
        $stmt->bindParam(':giamgia', $this->giamgia);
        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc); // Thêm idkhoahoc nếu cần
    
        return $stmt->execute();
    }
    
    public function countChiTiet(){
        function countAll() {
            $query = "SELECT COUNT(*) as total FROM SELECT * FROM `khoahoc`
                  INNER JOIN chitietnhanvien 
                  ON khoahoc.idkhoahoc = chitietnhanvien.idkhoahoc
                  INNER JOIN nhanvien ON nhanvien.idnhanvien = chitietnhanvien.idnhanvien ";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row['total'];
        }
    }
   
    
}

?>
