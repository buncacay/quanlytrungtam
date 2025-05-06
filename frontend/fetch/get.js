



export async function fetchGiangVien() {
    const select = document.getElementById('instructor');
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/NhanVienController.php');
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log("giang vien " + data);
    select.innerHTML = "";
    data.forEach(nhanvien => {
        const option = document.createElement('option');
        option.value = nhanvien.idnhanvien;
        option.textContent = nhanvien.tennhanvien;
        select.appendChild(option);
    });
}




export async function fetchKhoaHoc() {
    const url = `http://localhost/quanlytrungtam/backend/controller/KhoahocController.php`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data.data);
    return data.data;
}



export async function fetchChiTietKhoaHoc(id) {
    const url = `http://localhost/quanlytrungtam/backend/controller/ChitietkhoahocController.php?idkhoahoc=${id}`;
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
