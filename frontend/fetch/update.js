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