export async function UpdateHocVien(data) {
    alert("Đang gửi dữ liệu cập nhật...");
    const res = await fetch("http://localhost/quanlytrungtam/backend/controller/HocVienController.php", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    alert("Cập nhật thành công!");
    return true;
}
export async function UpdateNhanVien(data) {
    alert("Đang gửi dữ liệu cập nhật...");

    try {
        const res = await fetch("http://localhost/quanlytrungtam/backend/controller/nhanviencontroller.php", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // Kiểm tra phản hồi từ server
        if (!res.ok) {
            // Nếu không thành công, ném lỗi để xử lý
            throw new Error(await res.text());
        }

        // Nếu server trả về thành công, đọc JSON
        const result = await res.json();
        
        // Kiểm tra xem kết quả có chứa message là 'Record updated successfully.'
        if (result.message === "Record updated successfully.") {
            alert("Cập nhật thành công!");
            return true; // Trả về true khi cập nhật thành công
        } else {
            // Nếu không phải thông điệp thành công, trả về false
            console.error("Cập nhật không thành công:", result.message);
            return false;
        }
    } catch (error) {
        // Xử lý lỗi
        console.error("Lỗi khi cập nhật:", error);
        alert("Đã xảy ra lỗi khi cập nhật!");
        return false; // Trả về false khi gặp lỗi
    }
}



export async function UpdateGiaKhoaHoc(data){
    alert("chay alrt");
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/KhoahocController.php?action=gia',{
        method:'PUT',
        headers:{
             "Content-Type": "application/json"
        },
        body: JSON.stringify(data)

    });
    if (!res.ok) {
        throw new Error(await res.text());
    }

    alert("Cập nhật thành công!");
    return true;
} 

export async function UpdateDiem(data){
    alert("chay alrt");
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/DiemsoController.php',{
        method:'PUT',
        headers:{
             "Content-Type": "application/json"
        },
        body: JSON.stringify(data)

    });
    if (!res.ok) {
        throw new Error(await res.text());
    }

    alert("Cập nhật thành công!");
    return true;
} 

export async function UpdateTaiKhoan(data) {
    try {
        alert("Chạy alert"); // Kiểm tra nếu hàm được gọi
        const res = await fetch('http://localhost/quanlytrungtam/backend/controller/taikhoancontroller.php', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // Kiểm tra phản hồi của API
        if (!res.ok) {
            throw new Error(await res.text()); // Nếu không thành công, báo lỗi
        }

        // Nếu thành công, trả về "success"
        return 'success';
        
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        alert("Đã xảy ra lỗi khi cập nhật tài khoản.");
        return 'fail'; // Trả về "fail" nếu có lỗi
    }
}


export async function UpdateHoaDon(data){
    alert("chay alrt");
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/HoaDonController.php',{
        method:'PUT',
        headers:{
             "Content-Type": "application/json"
        },
        body: JSON.stringify(data)

    });
    if (!res.ok) {
        throw new Error(await res.text());
    }

    alert("Cập nhật thành công!");
    return true;
} 


export async function UpdateKhoaHoc(data){
    alert("chay alrt");
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/KhoaHocController.php',{
        method:'PUT',
        headers:{
             "Content-Type": "application/json"
        },
        body: JSON.stringify(data)

    });
    if (!res.ok) {
        throw new Error(await res.text());
    }

    alert("Cập nhật thành công!");
    return true;
} 

export async function UpdateChiTietKhoaHoc(data){
    alert("chay alrt");
    console.log(data);
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/ChitietkhoahocController.php',{
        method:'PUT',
        headers:{
             "Content-Type": "application/json"
        },
        body: JSON.stringify(data)

    });
    if (!res.ok) {
        throw new Error(await res.text());
    }

    alert("Cập nhật thành công!");
    return true;
} 


export async function UpdateGiangVien(data){
    alert("chay alrt");
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/NhanVienController.php',{
        method:'PUT',
        headers:{
             "Content-Type": "application/json"
        },
        body: JSON.stringify(data)

    });
    if (!res.ok) {
        throw new Error(await res.text());
    }

    alert("Cập nhật thành công!");
    return true;
} 


export async function UpdateChiTietNhanVien(data) {
    alert("Đang gửi dữ liệu cập nhật...");
    const res = await fetch("http://localhost/quanlytrungtam/backend/controller/ChitietnhanvienController.php", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    alert("Cập nhật thành công!");
    return true;
}