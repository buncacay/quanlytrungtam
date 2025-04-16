async function fetchKhoaHoc() {
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/KhoahocController.php');
    if (!res.ok) {
        throw new Error(await res.text());
    }
    const data = await res.json();
    return data;
}

async function addKhoaHoc(data){
    try {
        const res = await fetch('http://localhost/quanlytrungtam/backend/controller/KhoahocController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok){
            throw new Error('Lỗi: ' + await res.text());
        }

        const result = await res.json();
       
        console.log("Kết quả trả về:", result);

        return result;
    } catch (error){
        alert("Lỗi khi thêm khóa học: " + error.message);
    }
}

async function HienThiThongTin(data) {
    const all = document.getElementById('course-list-section');
    all.innerHTML = `
        <h3>Danh Sách Khóa Học</h3>
        <table class="course-list">
            <thead>
                <tr>
                    <th>Tên Khóa Học</th>
                    <th>Thời gian học</th>
                    <th>Số lượng buổi</th>
                    <th>Lịch học</th>
                </tr>
            </thead>
            <tbody id="body-details"></tbody>
        </table>
    `;

    const body = document.getElementById('body-details');
    body.innerHTML = ""; // reset lại
    data.forEach(khoahoc => {
        body.innerHTML += `
            <tr>
                <td>${khoahoc.tenkhoahoc}</td>
                <td>${khoahoc.thoigianhoc}</td>
                <td>${khoahoc.soluongbuoi}</td>
                <td>${khoahoc.lichhoc}</td>
            </tr>`;
    });
}

async function them(event){
    event.preventDefault();
    const ten = document.getElementById('course-name').value;
    const soluongbuoi = document.getElementById('soluongbuoi').value;
    const thoigianhoc = document.getElementById('thoigianhoc').value;
    const lichhoc = document.getElementById('lichhoc').value;
    const idnhanvien = document.getElementById('instructor').value;
    // alert(idnhanvien);
    const data = {
        tenkhoahoc: ten,
        thoigianhoc: thoigianhoc,
        soluongbuoi: soluongbuoi,
        lichhoc: lichhoc
    };
    // alert(ten + " " + soluongbuoi + " " + thoigianhoc + " " + lichhoc);
    console.log("Dữ liệu gửi đi:", data);
    const kq = await addKhoaHoc(data);

    if (kq) {
    //    alert(kq.idkhoahoc);
       const data2 = {
        idnhanvien: idnhanvien,
        idkhoahoc: kq.idkhoahoc,
        tinhtranggiangday: "dang day",
        sogioday: 0,
        dongia: 4.3,
        thanhtien: 10
       }
       await addGiangVien(data2);
    }
    else {
        alert ("them hong");
    }
    
  
}

async function fetchGiangVien(){
    const select = document.getElementById('instructor');
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/NhanVienController.php');

    if (!res.ok) {
        throw new Error(await res.text());
    }

    const data = await res.json();
    console.log("Danh sách giảng viên:", data);
    data.forEach(nhanvien => {
        const option = document.createElement('option');
        option.value = nhanvien.idnhanvien;
        option.textContent = nhanvien.tennhanvien;
        select.appendChild(option);
    });
}

async function addGiangVien(data){
    try {
        const res = await fetch('http://localhost/quanlytrungtam/backend/controller/ChiTietNhanVienController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok){
            throw new Error('Lỗi: ' + await res.text());
        }

        const result = await res.json();
       
        console.log("Kết quả trả về:", result);
        // alert("cuc cu");

       
    } catch (error){
        alert("Lỗi khi thêm chi tiet nhan vien: " + error.message);
    }
}

document.addEventListener('DOMContentLoaded', async function(){
    const data = await fetchKhoaHoc();
    await HienThiThongTin(data);
    await fetchGiangVien();

});

