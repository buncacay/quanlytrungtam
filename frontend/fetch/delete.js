export async function RemoveKhoaHoc(id){
    const res=await fetch(`http://localhost/quanlytrungtam/backend/controller/KhoahocController.php?idkhoahoc=${id}`,{
        method : 'DELETE'
    });
    if (!res.ok){
        throw new Error(await res.text());
        return false;
    }
    return true;
    
}
export async function RemoveHocvien(id){
    const res=await fetch(`http://localhost/quanlytrungtam/backend/controller/KhoahocController.php?idkhoahoc=${id}`,{
        method : 'DELETE'
    });
    if (!res.ok){
        throw new Error(await res.text());
        return false;
    }
    return true;
    
}
export async function RemoveHoaDon(id){
    const res=await fetch(`http://localhost/quanlytrungtam/backend/controller/HoaDonController.php?idhoadon=${id}`,{
        method : 'DELETE'
    });
    if (!res.ok){
        throw new Error(await res.text());
        return false;
    }
    return true;
    
}


export async function RemoveTaiKhoan(id){
    const res=await fetch(`http://localhost/quanlytrungtam/backend/controller/TaiKhoanController.php?user=${id}`,{
        method : 'DELETE'
    });
    if (!res.ok){
        throw new Error(await res.text());
        return false;
    }
    return true;
    
}

export async function RemoveDiem(id){
    const res=await fetch(`http://localhost/quanlytrungtam/backend/controller/DiemsoController.php?id=${id}`,{
        method : 'DELETE'
    });
    if (!res.ok){
        throw new Error(await res.text());
        return false;
    }
    return true;
    
}

export async function RemoveNhanVien(id){
    const res=await fetch(`http://localhost/quanlytrungtam/backend/controller/NhanVienController.php?idnhanvien=${id}`,{
        method : 'DELETE'
    });
    if (!res.ok){
        throw new Error(await res.text());
        return false;
    }
    return true;
    
}

export async function removeChiTietNhanVien(data) {
    try {
        const res = await fetch('http://localhost/quanlytrungtam/backend/controller/ChitietnhanvienController.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Lỗi từ server:', errorText);
            throw new Error(errorText);
        }

        const result = await res.json();
        
        
        return result;
    } catch (err) {
        console.error('Lỗi:', err);
    }
}

export async function removeChiTietHocvien(data) {
    try {
        const res = await fetch('http://localhost/quanlytrungtam/backend/controller/ChitiethocvienController.php?idhocvien=50&idkhoahoc=197', {
            method: 'DELETE',
           
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Lỗi từ server:', errorText);
            throw new Error(errorText);
        }

        const result = await res.json();
        
        
        return result;
    } catch (err) {
        console.error('Lỗi:', err);
    }
}