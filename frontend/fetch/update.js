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