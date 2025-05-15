import { fetchDonHang } from './get.js';
import {UpdateDonHang} from './update.js';
import {addChiTietHocVien} from './add.js'

const showDonHang = async () => {
    try {
        const donhangList = await fetchDonHang();

        // Kiểm tra nếu không có dữ liệu
        if (donhangList.length === 0) {
            document.getElementById('hocvien-body').innerHTML = '<tr><td colspan="5">Không có dữ liệu</td></tr>';
            return;
        }

        // Xóa dữ liệu cũ trong bảng
        let tableBody = document.getElementById('hocvien-body');
        tableBody.innerHTML = '';

        // Lặp qua từng đơn hàng và thêm vào bảng
        donhangList.forEach(donhang => {
            console.log("asdfasd ", donhang);
            const row = document.createElement('tr');
            
            const tdId = document.createElement('td');
            tdId.textContent = donhang[0].iddonhang;
            row.appendChild(tdId);

            const tdTaiKhoan = document.createElement('td');
            tdTaiKhoan.textContent = donhang[0].idhocvien;  // Giả sử API trả về 'idhocvien'
            row.appendChild(tdTaiKhoan);

            const tdKhoaHoc = document.createElement('td');
            tdKhoaHoc.textContent = donhang[0].idkhoahoc;  // Giả sử API trả về 'idkhoahoc'
            row.appendChild(tdKhoaHoc);

            const tdTrangThai = document.createElement('td');
            const select = document.createElement('select');

            // Tạo các option cho select (dropdown)
            const option1 = document.createElement('option');
            option1.textContent = 'Chờ phê duyệt';
            option1.value = 'Chờ phê duyệt';
            const option2 = document.createElement('option');
            option2.textContent = 'Đã xác nhận';
            option2.value = 'Đã xác nhận';
console.log(donhang[0].trangthai); // Kiểm tra giá trị thực tế của trangthai

            // Chọn giá trị của trạng thái đơn hàng từ donhang
            if (donhang[0].trangthaidon === 'Chờ phê duyệt') {
                option1.selected = true;
            } else if (donhang[0].trangthaidon === 'Đã xác nhận') {
                option2.selected = true;
            }

            select.appendChild(option1);
            select.appendChild(option2);
            tdTrangThai.appendChild(select);
            row.appendChild(tdTrangThai);

            // Tạo nút Cập nhật
            const tdUpdate = document.createElement('td');
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Cập nhật';
            
            // Đăng ký sự kiện click cho nút Cập nhật
            updateButton.addEventListener('click', async () => {
                await capnhat( donhang[0].idkhoahoc,donhang[0].idhocvien )
                alert(`Cập nhật thông tin của đơn hàng với ID: ${donhang[0].iddonhang}`);
                // Thực hiện các hành động khác khi nhấn nút Cập nhật, ví dụ mở form chỉnh sửa
            });

            tdUpdate.appendChild(updateButton);
            row.appendChild(tdUpdate);

            // Thêm row vào bảng
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Lỗi khi hiển thị đơn hàng:', error);
    }
};

// Gọi hàm để hiển thị đơn hàng khi trang được tải
showDonHang();

async function capnhat(idkhoahoc, idhocvien){

}
