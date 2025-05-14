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

    totalPages = Math.ceil(currentFilteredData.length / 5);
    const paginated = paginate(currentFilteredData, page, 5);
    renderTaiKhoan(paginated);
    renderPagination(page, totalPages);
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

    totalPages = Math.ceil(filtered.length / 5);
    const paginated = paginate(filtered, 1, 5);
    renderTaiKhoan(paginated);
    renderPagination(1, totalPages);
}

// Phân trang mảng
function paginate(array, page, size) {
    const start = (page - 1) * size;
    return array.slice(start, start + size);
}

// Lấy tên chức vụ
function getChucVuText(role) {
    switch (parseInt(role)) {
        case 0: return 'Học sinh';
        case 1: return 'Giảng viên';
        case 3: return 'Quản trị viên';
        default: return 'Không xác định';
    }
}

// Render danh sách tài khoản
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

        const acc = item.acc;
        const role = acc.role;
        const chucVuText = getChucVuText(role);
        const tenNguoiDung = item.isHocVien ? item.userData.hoten : item.userData.tennhanvien;
        const id = item.isHocVien ? item.userData.idhocvien : item.userData.idnhanvien; // Lấy ID từ dữ liệu

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${id}</td> <!-- Hiển thị ID -->
          <td>${tenNguoiDung}</td>
          <td>${acc.username}</td>
          <td>${chucVuText}</td>
          <td>
            <button onclick="editTaiKhoan('${acc.username}', ${role})">Sửa</button>
            <button onclick="removeTaiKhoan('${acc.username}')">Xóa</button>
            <button onclick="chitiet('${id}')">Xem</button> <!-- Sử dụng ID ở đây -->
          </td>
        `;
        tbody.appendChild(row);
    }
}

// Render phân trang
function renderPagination(current, total) {
    const container = document.getElementById('pagination');
    container.innerHTML = '';

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

// Sửa tài khoản: chuyển sang trang qltaikhoan.html
function editTaiKhoan(id, role) {
    window.location.href = `qltaikhoan.html?user=${id}&role=${role}`;
}
window.editTaiKhoan = editTaiKhoan;

// Xem chi tiết tài khoản
function chitiet(id) {
    window.location.href = `tthocvien.html?id=${id}`;
}
window.chitiet = chitiet;
