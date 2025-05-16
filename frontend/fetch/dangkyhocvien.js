import { fetchKhoaHoc, fetchTaiKhoan, fetchTaiKhoanHocvien, fetchTaiKhoanGiangVien } from './get.js';
import { addTaiKhoan, addStudent, addThongTinGiangVien, addChiTietHocVien} from './add.js';
import {UpdateHocVien, UpdateNhanVien, UpdateTaiKhoan} from './update.js';
// DOMContentLoaded event để lấy các thông tin từ URL và load form tương ứng


let id="";
let user="";
document.addEventListener('DOMContentLoaded', async () => {
    // alert("t dang dung ne");
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    user = params.get('user'); // lấy user từ URL
    if (user) {
        document.getElementById('submit-btn').textContent="Lưu chỉnh sửa";
        const res = await fetchTaiKhoan(user); // gọi API như bạn muốn

    // Điền dữ liệu mặc định vào form
    document.getElementById('name').value = res[0].username;
    document.getElementById('password').value = res[0].password;
    document.getElementById('confirm-password').value = res[0].password;

    const radio = document.querySelector(`input[name="role"][value="${res[0].role}"]`);
    if (radio) {
        radio.checked = true;
        toggleForm(); // Hiển thị form học viên/giảng viên
    }

    const data = await fetchKhoaHoc();
    // Kiểm tra role để fetch dữ liệu học viên hoặc giảng viên
    if (role == 0) { // Học viên
        const huhu = await fetchTaiKhoanHocvien(user);
        id = huhu[0].idhocvien;

        console.log("Thông tin học viên: ", id);

        // Điền dữ liệu vào form học viên
        document.getElementById('fullname').value = huhu[0].hoten || ''; 
        document.getElementById('sdt-student').value = huhu[0].sdt || ''; 
        document.getElementById('birth').value = huhu[0].ngaysinh || ''; 
    } else { // Giảng viên
        const huhu = await fetchTaiKhoanGiangVien(user);
       
        id = huhu[0][0].idnhanvien;
         console.log("Thông tin giảng viên: ", id);
        // Điền dữ liệu vào form giảng viên
        document.getElementById('teacher-name').value = huhu[0][0].tennhanvien || ''; 
        document.getElementById('trinhdo').value = huhu[0][0].trinhdo || ''; 
        document.getElementById('chungchi').value = huhu[0][0].chungchi || ''; 
        document.getElementById('sdt-teacher').value = huhu[0][0].sdt || ''; 
        document.getElementById('ghichu').value = huhu[0][0].ghichu || ''; 
    }

    console.log("Thông tin học viên: ", id);
    }
    

    // Gắn sự kiện submit
    document.getElementById('add-form').addEventListener('submit', handleFormSubmit);
});

// Toggle form khi chọn role học viên/giảng viên
function toggleForm() {
    if ($('#student').is(':checked')) {
        $('#student-form').slideDown();
        $('#teacher-form').slideUp();
    } else  {
        $('#teacher-form').slideDown();
        $('#student-form').slideUp();
    } 
}

// Hàm xử lý submit form
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
        console.log(taikhoanData);
        // alert("dads", user);
        let response;
        if (user) {
            // alert("chay update tai khoan");
            // Cập nhật tài khoản nếu có user trong URL
            response = await UpdateTaiKhoan(taikhoanData);
        } else {
            // alert("chay tao tai khoan");
            // Tạo tài khoản mới nếu không có user
            response = await addTaiKhoan(taikhoanData);
        }

       
        if (response){
            alert("cap nhat tai khoan thanh cong");
        }
        
        // Kiểm tra role và gọi hàm tương ứng
        if (role === '0') {  // Học viên
            if (user) {
                 alert("chay update tai khoan");
                await handleUpdateStudent(username); // Cập nhật học viên
            } else {
                  alert("chay tao tai khoan");
                await handleaddStudent(username); // Thêm mới học viên
            }
        } else {  // Giảng viên hoặc vai trò khác
            if (user) {
                await handleUpdateNhanVien(username); // Cập nhật giảng viên
            } else {
                await handleAddNhanVien(username); // Thêm mới giảng viên
            }
        }
       
        // alert("Tạo tài khoản thành công!");
        // Có thể reset form tại đây nếu cần
        // document.getElementById('add-form').reset();

    } catch (error) {
        console.error("Lỗi:", error);
        alert("Đã xảy ra lỗi hệ thống.");
    }
}


// Hàm thêm mới học viên
async function handleaddStudent(user) {
    const hoten = document.getElementById('fullname').value;
    const sdt = document.getElementById('sdt-student').value;
    const ngaysinh = document.getElementById('birth').value;

    const hv = {
        hoten: hoten,
        sdt: sdt,
        ngaysinh: ngaysinh,
        user: user,
        idhocvien: id,
        trangthia : 1
    };
    console.log(hv);

    const res = await addStudent(hv);  // Thêm học viên
    if (res) {
        alert("Tạo tài khoản thành công");
         window.location.href = "../admin/dangnhap.html";
    }
}

// Hàm cập nhật học viên
async function handleUpdateStudent(user) {
    const hoten = document.getElementById('fullname').value;
    const sdt = document.getElementById('sdt-student').value;
    const ngaysinh = document.getElementById('birth').value;

    const hv = {
        hoten: hoten,
        sdt: sdt,
        ngaysinh: ngaysinh,
        user: user,
        idhocvien: id,
        trangthia : 1
    };
    console.log(hv);

    const res = await UpdateHocVien(hv);  // Cập nhật học viên
}

// Hàm thêm mới giảng viên
async function handleAddNhanVien(user) {
    const tennhanvien = document.getElementById('teacher-name').value;
    const trinhdo = document.getElementById('trinhdo').value;
    const chungchi = document.getElementById('chungchi').value;
    const sdt = document.getElementById('sdt-teacher').value;

    const ghichu = document.getElementById('ghichu').value;

    const nv = {
        tennhanvien,
        trinhdo,
        chungchi,
        sdt,
        chucvu: document.querySelector('input[name="role"]:checked')?.value,
        ghichu,
        diachi: "",
        tienthuong: 0,
        tienphat: 0,
        tonggioday: 0,
        user,
        trangthai: 1,
        idnhanvien: id
    };
    console.log(nv);
    const res = await addThongTinGiangVien(nv);  // Thêm giảng viên
    if (res){
        alert("Tạo tài khoản thành công");
         window.location.href = "../admin/dangnhap.html";
    }

}

// Hàm cập nhật giảng viên
async function handleUpdateNhanVien(user) {
    const tennhanvien = document.getElementById('teacher-name').value;
    const trinhdo = document.getElementById('trinhdo').value;
    const chungchi = document.getElementById('chungchi').value;
    const sdt = document.getElementById('sdt-teacher').value;

    const ghichu = document.getElementById('ghichu').value;

    const nv = {
        tennhanvien,
        trinhdo,
        chungchi,
        sdt,
        chucvu: document.querySelector('input[name="role"]:checked')?.value,
        ghichu,
        diachi: "",
        tienthuong: 0,
        tienphat: 0,
        tonggioday: 0,
        user,
        trangthai: 1,
        idnhanvien: id
    };
    console.log(nv);
    await UpdateNhanVien(nv);  // Cập nhật giảng viên
}
