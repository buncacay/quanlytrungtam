import { fetchKhoaHoc , fetchHocVien,  } from './get.js';
import {addStudent, addKhoaHoc} from './add.js';
import {UpdateHocVien} from './update.js';

document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fullname = document.getElementById('fullname').value;
    const phone = document.getElementById('sdt').value;
    const date = document.getElementById('birth').value;
    const course = document.getElementById('course').value;

    const data = {
        hoten: fullname,
        sdt: phone,
        ngaysinh: date
       
    };

    console.log("day la data ", JSON.stringify(data)); // Kiểm tra trước khi gửi
    
    const kq = await addStudent(data);
    console.log("day la kq ", kq);
    const id = kq.idhocvien;
    console.log("id " + id);
    const data2 = {
        idhocvien: id,
        idkhoahoc : course,
        ketquahoctap : "chua co",
        tinhtranghocphi : "chua co"
    }
    addKhoaHoc(data2);

});

document.addEventListener('DOMContentLoaded', async function () {
    const data = await fetchKhoaHoc();
    const select = document.getElementById('course');
    data.forEach(khoahoc => {
        const otp = document.createElement('option');
        otp.value = khoahoc.idkhoahoc;
        otp.textContent = khoahoc.tenkhoahoc;
        select.appendChild(otp);
    });
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        await EditHocVien(id);
    } else {
        alert("Thiếu ID học viên");
    }
});

async function EditHocVien(id) {
    const formdky = document.getElementById('registrationForm');
    formdky.innerHTML = `
        <div class="form-group">
            <label for="fullname">Họ và tên:</label>
            <input type="text" id="fullname" name="fullname" placeholder="Nhập họ và tên" required>
        </div>
        <div class="form-group">
            <label for="sdt">Số điện thoại:</label>
            <input type="tel" id="sdt" name="sdt" placeholder="Nhập số điện thoại" pattern="[0-9]{10}" required>
        </div>
        <div class="form-group">
            <label for="birth">Ngày sinh:</label>
            <input type="date" id="birth" name="birth" required>
        </div>
        <button type="button" id="btn">Lưu chỉnh sửa</button>
    `;

    const data = await fetchHocVien(id);

    const hoten = document.getElementById('fullname');
    const sdt = document.getElementById('sdt');
    const sn = document.getElementById('birth');
    const btn = document.getElementById('btn');

    hoten.value = data[0]['hoten'];
    sdt.value = data[0]['sdt'];
    sn.value = data[0]['ngaysinh'];

    btn.addEventListener('click', async function () {
        const dlieu = {
            idhocvien: data[0]['idhocvien'],
            hoten: hoten.value,
            sdt: sdt.value,
            ngaysinh: sn.value
        };

        try {
            const success = await UpdateHocVien(dlieu);
            if (success) {
                alert("Đã lưu thông tin sau khi chỉnh sửa");
                // Ví dụ chuyển hướng:
                window.location.href = "danhsachhocvien.html";
            }
        } catch (err) {
            alert("Lỗi khi cập nhật: " + err.message);
        }
    });
}







