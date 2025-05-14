import { fetchAllTaiKhoan, fetchTaiKhoanHocvien, fetchTaiKhoanGiangVien } from './get.js';
import { RemoveTaiKhoan } from './delete.js';

let currentPage = 1;
let totalPages = 1;
let currentFilteredData = [];

// Khi trang vừa load
document.addEventListener('DOMContentLoaded', async () => {
    await loadTaiKhoan();
    document.getElementById('search-name').addEventListener('input', filterTaiKhoan);
    document.getElementById('role-filter').addEventListener('change', filterTaiKhoan);
});

// Tải danh sách tài khoản từ API
async function loadTaiKhoan(page = 1) {
    currentPage = page;

    const response = await fetchAllTaiKhoan(); // giả định trả về toàn bộ
    currentFilteredData = response.data;
    alert(currentFilteredData.length);
    // Tính lại số trang dựa trên số lượng tài khoản
    totalPages = Math.ceil(currentFilteredData.length / 5);
    
    // Nếu trang hiện tại vượt quá tổng số trang, đặt lại về trang cuối cùng
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }

    const paginated = paginate(currentFilteredData, currentPage, 5);
    renderTaiKhoan(paginated);
    renderPagination(currentPage, totalPages);
}

// Lọc theo tên + chức vụ
function filterTaiKhoan() {
    const search = document.getElementById('search-name').value.toLowerCase();
    const role = document.getElementById('role-filter').value;

    const filtered = currentFilteredData.filter(acc => {
        const matchName = acc.hoten.toLowerCase().includes(search);
        const matchRole = role ? acc.chucvu === role : true;
        return matchName && matchRole;
    });

    // Cập nhật tổng số trang sau khi lọc
    totalPages = Math.ceil(filtered.length / 5);
    
    // Giới hạn trang nếu có ít dữ liệu
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }

    const paginated = paginate(filtered, currentPage, 5);
    renderTaiKhoan(paginated);
    renderPagination(currentPage, totalPages);
}

// Phân trang mảng
function paginate(array, page, size) {
    const start = (page - 1) * size;
    return array.slice(start, start + size);
}

function getChucVuText(role) {
    switch (parseInt(role)) {
        case 0: return 'Học sinh';
        case 1: return 'Giảng viên';
        case 3: return 'Quản trị viên';
        default: return 'Không xác định';
    }
}

async function renderTaiKhoan(data) {
    const tbody = document.getElementById('account-list');
    tbody.innerHTML = '';

    // Tạo danh sách promise gọi API cho từng tài khoản
    const fetchPromises = data.map(acc => {
        if (!acc.role || !acc.username) return null;

        const isHocVien = parseInt(acc.role) === 0;
        const fetchFunc = isHocVien ? fetchTaiKhoanHocvien : fetchTaiKhoanGiangVien;

        return fetchFunc(acc.username)
            .then(res => ({
                acc,
                userData: res && res[0] ? res[0] : null,
                isHocVien
            }))
            .catch(error => {
                console.error(`Lỗi khi fetch tài khoản ${acc.username}:`, error);
                return null;
            });
    });

    // Đợi tất cả promise hoàn tất
    const results = await Promise.all(fetchPromises.filter(p => p !== null));

    // Xử lý kết quả và hiển thị
 for (const item of results) {
    if (!item || !item.userData) continue;
console.log("uia ", item.userData[0].tennhanvien);  // Kiểm tra dữ liệu của user

    const acc = item.acc;
    const role = acc.role;  // Đây là giá trị 'role' mà bạn cần chuyển thành tên chức vụ
    const chucVuText = getChucVuText(role);  // Lấy tên chức vụ từ hàm getChucVuText
    const tenNguoiDung = item.isHocVien ? item.userData[0].hoten : item.userData[0].tennhanvien;
    const id = item.isHocVien ? item.userData[0].idhocvien : item.userData[0].idnhanvien; // Lấy ID từ dữ liệu
    console.log(id);
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${id}</td> <!-- Hiển thị ID -->
        <td>${tenNguoiDung}</td>
        <td>${acc.username}</td>
        <td>${chucVuText}</td> <!-- Hiển thị chức vụ -->
        <td>
            <button onclick="editTaiKhoan('${acc.username}', ${role})">Sửa</button>
            <button onclick="removeTaiKhoan('${acc.username}')">Xóa</button>
           
        </td>
    `;
    tbody.appendChild(row);
}

}

// Sửa tài khoản: chuyển sang trang qltaikhoan.html
function editTaiKhoan(id, role) {
    window.location.href = `qltaikhoan.html?user=${id}&role=${role}`;
}
window.editTaiKhoan = editTaiKhoan;

// Xóa tài khoản
async function removeTaiKhoan(id) {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
        const result = await RemoveTaiKhoan(id);
        if (result) {
            alert('Đã xóa thành công');
            await loadTaiKhoan(currentPage);
        } else {
            alert('Xóa thất bại!');
        }
    }
}
window.removeTaiKhoan = removeTaiKhoan;

async function chitiet(id) {
    window.location.href = `tthocvien.html?id=${id}`;
}
window.chitiet = chitiet;

// Phân trang
function renderPagination(current, total) {
    const container = document.getElementById('pagination');
    container.innerHTML = '';

    // Nếu không có tài khoản, không hiển thị phân trang
    if (total === 0) {
        return;
    }

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '« Trước';
    prevBtn.disabled = current === 1;
    prevBtn.onclick = () => loadTaiKhoan(current - 1);
    container.appendChild(prevBtn);

    for (let i = 1; i <= total; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = (i === current) ? 'active' : '';
        btn.onclick = () => loadTaiKhoan(i);
        container.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Sau »';
    nextBtn.disabled = current === total;
    nextBtn.onclick = () => loadTaiKhoan(current + 1);
    container.appendChild(nextBtn);
}
