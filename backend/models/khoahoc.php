<?php

class KhoaHoc {
    public $idkhoahoc;
    public $tenkhoahoc;
    public $thoigianhoc;
    public $soluongbuoi;
    public $lichhoc;
    public $diadiemhoc;
    public $mota;
    public $image; // dữ liệu file ảnh tải lên (mảng $_FILES['image'])
    public $images; // đường dẫn lưu ảnh trong DB
    public $giatien;
    public $giamgia;
    public $conn;
    public $ngaybatdau;
    public $ngayketthuc;
    public $table = "khoahoc";

    public function __construct($db) {
        $this->conn = $db;
    }

public function create() {
    // Nếu có ảnh từ $this->image thì xử lý, còn không thì giữ nguyên $this->images đã có
    if (isset($this->image) && is_array($this->image) && isset($this->image['tmp_name'])) {
        $originalName = basename($this->image['name']);
        $newFileName = time() . '_' . $originalName;
        $uploadPath = 'uploads/' . $newFileName;

        if (move_uploaded_file($this->image['tmp_name'], $uploadPath)) {
            $this->images = $newFileName;
        }
    }

    $query = "INSERT INTO " . $this->table . " 
        (tenkhoahoc, thoigianhoc, soluongbuoi, lichhoc, diadiemhoc, mota, images, giatien, giamgia, ngaybatdau, ngayketthuc, trangthai) 
        VALUES (:tenkhoahoc, :thoigianhoc, :soluongbuoi, :lichhoc, :diadiemhoc, :mota, :images, :giatien, :giamgia, :ngaybatdau, :ngayketthuc, 1)";

    $stmt = $this->conn->prepare($query);

    $tenkhoahoc  = $this->tenkhoahoc;
    $thoigianhoc = $this->thoigianhoc;
    $soluongbuoi = $this->soluongbuoi;
    $lichhoc     = $this->lichhoc;
    $diadiemhoc  = $this->diadiemhoc;
    $mota        = $this->mota;
    $images      = $this->images;
    $giatien     = $this->giatien;
    $giamgia     = $this->giamgia;
    $ngaybatdau     = $this->ngaybatdau;
    $ngayketthuc     = $this->ngayketthuc;

    $stmt->bindParam(':tenkhoahoc', $tenkhoahoc);
    $stmt->bindParam(':thoigianhoc', $thoigianhoc);
    $stmt->bindParam(':soluongbuoi', $soluongbuoi, PDO::PARAM_INT);
    $stmt->bindParam(':lichhoc', $lichhoc);
    $stmt->bindParam(':diadiemhoc', $diadiemhoc);
    $stmt->bindParam(':mota', $mota);
    $stmt->bindParam(':images', $images);
    $stmt->bindParam(':giatien', $giatien);
    $stmt->bindParam(':giamgia', $giamgia);
    $stmt->bindParam(':ngaybatdau', $ngaybatdau);
    $stmt->bindParam(':ngayketthuc', $ngayketthuc);

    if ($stmt->execute()) {
        $this->idkhoahoc = $this->conn->lastInsertId();
        return $this->idkhoahoc;
    }

    return null;
}


    public function update() {
    $query = "UPDATE " . $this->table . " SET 
        tenkhoahoc = :tenkhoahoc,
        thoigianhoc = :thoigianhoc,
        soluongbuoi = :soluongbuoi,
        lichhoc = :lichhoc,
        diadiemhoc = :diadiemhoc,
        mota = :mota,
        giatien = :giatien,
        giamgia = :giamgia,
        ngaybatdau = :ngaybatdau,
        ngayketthuc = :ngayketthuc,
        trangthai = :trangthai"
        ;

    // Nếu có ảnh mới thì thêm vào câu truy vấn
    if (isset($this->image) && is_array($this->image) && isset($this->image['tmp_name']) && $this->image['tmp_name'] !== '') {
        $query .= ", images = :images";
    }

    $query .= " WHERE idkhoahoc = :idkhoahoc";

    $stmt = $this->conn->prepare($query);

    // Gán dữ liệu
    $stmt->bindParam(':tenkhoahoc', $this->tenkhoahoc);
    $stmt->bindParam(':thoigianhoc', $this->thoigianhoc);
    $stmt->bindParam(':soluongbuoi', $this->soluongbuoi, PDO::PARAM_INT);
    $stmt->bindParam(':lichhoc', $this->lichhoc);
    $stmt->bindParam(':diadiemhoc', $this->diadiemhoc);
    $stmt->bindParam(':mota', $this->mota);
    $stmt->bindParam(':giatien', $this->giatien);
     $stmt->bindParam(':ngaybatdau', $ngaybatdau);
    $stmt->bindParam(':ngayketthuc', $ngayketthuc);
    $stmt->bindParam(':giamgia', $this->giamgia);
      $stmt->bindParam(':trangthai', $this->trangthai);
    $stmt->bindParam(':idkhoahoc', $this->idkhoahoc, PDO::PARAM_INT);

    // Xử lý ảnh mới (nếu có)
    if (isset($this->image) && is_array($this->image) && isset($this->image['tmp_name']) && $this->image['tmp_name'] !== '') {
        $originalName = basename($this->image['name']);
        $newFileName = time() . '_' . $originalName;
        $uploadPath = 'uploads/' . $newFileName;

        if (move_uploaded_file($this->image['tmp_name'], $uploadPath)) {
            $this->images = $newFileName; // Chỉ lưu tên file
            $stmt->bindParam(':images', $this->images);
        }
    }

    return $stmt->execute();
}


    public function read($limit, $offset) {
        $query = "SELECT * FROM " . $this->table . "  LIMIT :limit OFFSET :offset";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function delete() {
        $query = "UPDATE " . $this->table . " SET trangthai = 0 WHERE idkhoahoc = :idkhoahoc";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc, PDO::PARAM_INT);

        return $stmt->execute();
    }

   public function getKhoaHocById() {
    $query = "SELECT * FROM khoahoc
                  INNER JOIN chitietkhoahoc 
                  ON khoahoc.idkhoahoc = chitietkhoahoc.idkhoahoc
                  WHERE khoahoc.idkhoahoc = :idkhoahoc";
    $stmt = $this->conn->prepare($query);

    $stmt->bindParam(':idkhoahoc', $this->idkhoahoc, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt;
}


    public function getChiTietKhoaHoc($limit, $offset, $search = '') {
        $query = "SELECT * FROM khoahoc
                  INNER JOIN chitietnhanvien 
                  ON khoahoc.idkhoahoc = chitietnhanvien.idkhoahoc
                  INNER JOIN nhanvien 
                  ON nhanvien.idnhanvien = chitietnhanvien.idnhanvien where khoahoc.trangthai=1 ";

        if (!empty($search)) {
            $query .= " and khoahoc.tenkhoahoc LIKE :search OR nhanvien.tennhanvien LIKE :search";
        }

        $query .= " LIMIT :limit OFFSET :offset";
        $stmt = $this->conn->prepare($query);

        if (!empty($search)) {
            $stmt->bindValue(':search', '%' . $search . '%', PDO::PARAM_STR);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateGia() {
        $query = "UPDATE " . $this->table . " SET 
            giatien = :giatien,
            giamgia = :giamgia 
            WHERE idkhoahoc = :idkhoahoc AND trangthai = 1";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':giatien', $this->giatien);
        $stmt->bindParam(':giamgia', $this->giamgia);
        $stmt->bindParam(':idkhoahoc', $this->idkhoahoc, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function countAll() {
        $query = "SELECT COUNT(*) as total FROM " . $this->table . " WHERE trangthai = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

    public function countChiTiet($search = '') {
        $query = "SELECT COUNT(*) as total FROM khoahoc
                  INNER JOIN chitietnhanvien 
                  ON khoahoc.idkhoahoc = chitietnhanvien.idkhoahoc
                  INNER JOIN nhanvien 
                  ON nhanvien.idnhanvien = chitietnhanvien.idnhanvien";

        if (!empty($search)) {
            $query .= " WHERE khoahoc.tenkhoahoc LIKE :search OR nhanvien.tennhanvien LIKE :search";
        }

        $stmt = $this->conn->prepare($query);
        if (!empty($search)) {
            $stmt->bindValue(':search', '%' . $search . '%', PDO::PARAM_STR);
        }

        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }
}

?>
