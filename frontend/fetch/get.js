



export async function fetchGiangVien() {
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/NhanVienController.php');
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data);
    return data;
}

export async function fetchChiTiethocvien(id) {
    const url = `http://localhost/quanlytrungtam/backend/controller/chitiethocvienController.php?idhocvien=${id}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    console.log(data);
    return data;
}

export async function fetchChiTiethocvienKhongid() {
    const url = `http://localhost/quanlytrungtam/backend/controller/chitiethocvienController.php`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    console.log(data);
    return data;
}

export async function fetchChiTiethocvienVoiIdKhocHoc(id) {
    const url = `http://localhost/quanlytrungtam/backend/controller/chitiethocvienController.php?idkhoahoc=${id}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    console.log(data);
    return data;
}

export async function fetchTaiKhoan(user) {
    const url = `http://localhost/quanlytrungtam/backend/controller/taikhoanController.php?username=${user}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data);
    return data;
}

export async function fetchTaiKhoanHocvien(user) {
    const url = `http://localhost/quanlytrungtam/backend/controller/HocvienController.php?user=${user}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data);
    return data;
}
export async function fetchTaiKhoanGiangVien(user) {
    const url = `http://localhost/quanlytrungtam/backend/controller/NhanVienController.php?user=${user}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data);
    return data;
}

export async function fetchAllTaiKhoan() {
    const url = `http://localhost/quanlytrungtam/backend/controller/taikhoanController.php`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data);
    return data;
}

export async function fetchKhoaHoc() {
    const url = `http://localhost/quanlytrungtam/backend/controller/KhoahocController.php`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data.data);
    return data.data;
}

export async function fetchKhoaHocVoiId(id) {
    const url = `http://localhost/quanlytrungtam/backend/controller/KhoahocController.php?idkhoahoc=${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data);
    return data;
}

export async function fetchDiemSovoiIdHocvien(id) {
    const url = `http://localhost/quanlytrungtam/backend/controller/DiemsoController.php?idhocvien=${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data);
    return data;
}
// pages = 1, limit = 5
export async function fetchKhoaHocPhanTrang(pages, limit) {
    const url = `http://localhost/quanlytrungtam/backend/controller/KhoaHocController.php?pages=${pages}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
}

export async function fetchKhoaHocWithSearch(pages, limit, search = null) {
    let url ="";
    if (search!=null){
        url = `http://localhost/quanlytrungtam/backend/controller/KhoahocController.php?action=chitiet&pages=${pages}&limit=${limit}&search=${search}`;

    }
    else {
        url = `http://localhost/quanlytrungtam/backend/controller/KhoahocController.php?action=chitiet&pages=${pages}&limit=${limit}`;

    }
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(await res.text());
    }
    const data = await res.json();
    console.log("huhu " , data);
    return data;
}





export async function fetchChiTietKhoaHoc(id) {
    const url = `http://localhost/quanlytrungtam/backend/controller/ChitietkhoahocController.php?idkhoahoc=${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data);
    return data;
}

export async function fetchDiem(id) {
    const url = `http://localhost/quanlytrungtam/backend/controller/DiemsoController.php?idkhoahoc=${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data);
    return data;
}

export async function fetchDiemvoihocvien(id) {
    const url = `http://localhost/quanlytrungtam/backend/controller/DiemsoController.php?idhocvien=${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data);
    return data;
}

export async function fetchChiTietNhanVien() {
    const url = `http://localhost/quanlytrungtam/backend/controller/ChitietnhanvienController.php`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data);
    return data;
}






export async function fetchHocVien(id){
    const res= await fetch(`http://localhost/quanlytrungtam/backend/controller/HocvienController.php?idhocvien=${id}`);
    if (!res.ok){
        throw new Error(await res.text());
    }
    const data = await res.json();
    console.log("data " + data);
    return data;
}

export async function fetchDonHang(){
    const res= await fetch(`http://localhost/quanlytrungtam/backend/controller/DonhangController.php`);
    if (!res.ok){
        throw new Error(await res.text());
    }
    const data = await res.json();
    console.log("data " + data);
    return data;
}



export async function fetchAllHocVien(page = 1, limit=5) {
    const res = await fetch(`http://localhost/quanlytrungtam/backend/controller/HocvienController.php?page=${page}&limit=${limit}`);
    if (!res.ok) {
        throw new Error(await res.text());
    }

    const data = await res.json();
    return data;
}


 export async function fetchHoaDon(){
    const res = await fetch(`http://localhost/quanlytrungtam/backend/controller/HoaDonController.php`);
    if (!res.ok) {
        throw new Error(await res.text());
    }

    const data = await res.json();
    return data;
}
 

export async function fetchHoaDonWithId(id){
    const res = await fetch(`http://localhost/quanlytrungtam/backend/controller/HoaDonController.php?idhoadon=${id}`);
    if (!res.ok) {
        throw new Error(await res.text());
    }

    const data = await res.json();
    return data;
}

export async function fetchHoaDonWithIdhocvien(id){
    const res = await fetch(`http://localhost/quanlytrungtam/backend/controller/HoaDonController.php?idhocvien=${id}`);
    if (!res.ok) {
        throw new Error(await res.text());
    }

    const data = await res.json();
    return data;
}