import { fetchKhoaHoc } from './get.js';
import { addTaiKhoan, addStudent, addThongTinGiangVien, addChiTietHocVien} from './add.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    const data = await fetchKhoaHoc();
    const select = document.getElementById('course');
    data.forEach(k => {
        const option = document.createElement('option');
        option.value = k.idkhoahoc;
        option.textContent = k.tenkhoahoc;
        select.appendChild(option);
    });

    // Gắn sự kiện submit
    document.getElementById('add-form').addEventListener('submit', handleFormSubmit);
});

async function handleFormSubmit(e) {
    try {
        e.preventDefault();

        const username = document.getElementById('name').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const role = document.querySelector('input[name="role"]:checked')?.value;

        if (!role) return alert("Vui lòng chọn chức vụ");
        if (!username || !password) return alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
        if (password !== confirmPassword) return alert("Mật khẩu không khớp");

        const taikhoanData = {
            user: username,
            pass: password,
            role: role,
            created_at: new Date().toISOString().slice(0, 10),
            trangthai: 1
        };

        const response = await addTaiKhoan(taikhoanData);

        // Nếu user đã tồn tại
        if (response.status === 409) {
            const res = await response.json();
            alert(res.message || "Tên đăng nhập đã tồn tại");
            return;
        }

        // Nếu lỗi khác
        if (!response.ok) {
            const res = await response.json();
            alert(res.message || "Đã xảy ra lỗi khi tạo tài khoản");
            return;
        }

        // Nếu thành công
        const result = await response.json();
        console.log(result);

        if (role === 'student') {
            await handleaddStudent(username);
        } else if (role === 'teacher') {
            await handleAddNhanVien(username);
        }

        alert("Tạo tài khoản thành công!");
        // Có thể reset form tại đây nếu cần
        // document.getElementById('add-form').reset();

    } catch (error) {
        console.error("Lỗi:", error);
        alert("Đã xảy ra lỗi hệ thống.");
    }
}


async function handleaddStudent(user) {
    const hoten = document.getElementById('fullname').value;
    const sdt = document.getElementById('sdt-student').value;
    const ngaysinh = document.getElementById('birth').value;
    const idkhoahoc = document.getElementById('course').value;

    const hv = {
        hoten : hoten,
        sdt : sdt,
        ngaysinh: ngaysinh,
        user : user
    };
    console.log(hv);


    const res = await addStudent(hv);
    if (res && res.idhocvien) {
        const ct = {
            idhocvien: res.idhocvien,
            idkhoahoc :idkhoahoc,
            ketquahoctap: "Chưa có",
            tinhtranghocphi: "Chưa đóng"
        };
        await addChiTietHocVien(ct);
    }
}

async function handleAddNhanVien(user) {
    const tennhanvien = document.getElementById('teacher-name').value;
    const trinhdo = document.getElementById('trinhdo').value;
    const chungchi = document.getElementById('chungchi').value;
    const sdt = document.getElementById('sdt-teacher').value;
    const chucvu = document.getElementById('chucvu').value;
    const ghichu = document.getElementById('ghichu').value;

    const nv = {
        tennhanvien,
        trinhdo,
        chungchi,
        sdt,
        chucvu,
        ghichu,
        diachi: "",
        tienthuong: 0,
        tienphat: 0,
        tonggioday: 0,
        user
    };

    await addThongTinGiangVien(nv);
}
