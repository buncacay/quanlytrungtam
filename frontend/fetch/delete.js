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