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
    console.log(response);
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

// Hiển thị danh sách tài khoản
async function renderTaiKhoan(data) {
    const tbody = document.getElementById('account-list');
    tbody.innerHTML = '';

    // Dùng for...of để xử lý async/await trong vòng lặp
    for (let acc of data) {
        let chucVuText = '';
        // Kiểm tra vai trò và gán giá trị text tương ứng
        switch (parseInt(acc.role)) {
            case 0:
                chucVuText = 'Học sinh';
                break;
            case 1:
                chucVuText = 'Giảng viên';
                break;
            case 3:
                chucVuText = 'Quản trị viên';
                break;
            default:
                chucVuText = 'Không xác định';
        }

        // In giá trị role ra console để kiểm tra
        const role = acc.role;
        console.log(acc.role);

        // Kiểm tra nếu là học viên
        if (parseInt(acc.role) === 0) {
            const res = await fetchTaiKhoanHocvien(acc.username); // Gọi API lấy thông tin học viên
            // Xử lý nếu có kết quả trả về từ API
            if (res) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${res[0].hoten}</td>
                    <td>${acc.username}</td>
                    <td>${chucVuText}</td>
                    <td>
                       <button onclick="editTaiKhoan('${acc.username}', ${role})">Sửa</button>
                        <button onclick="removeTaiKhoan('${acc.username}')">Xóa</button>
                    </td>
                `;
                tbody.appendChild(row);
            }
        } else {
            // Nếu là giảng viên
            const res = await fetchTaiKhoanGiangVien(acc.username); // Gọi API lấy thông tin giảng viên
            // Xử lý nếu có kết quả trả về từ API
            if (res) {
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${res[0].tennhanvien}</td>
                    <td>${acc.username}</td>
                    <td>${chucVuText}</td>
                    <td>
                     <button onclick="editTaiKhoan('${acc.username}', ${role})">Sửa</button>

                        <button onclick="removeTaiKhoan('${acc.username}')">Xóa</button>
                    </td>
                `;
                tbody.appendChild(row);
            }
        }
    }
}



// Sửa tài khoản: chuyển sang trang qltaikhoan.html
function editTaiKhoan(id,role) {
    
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

// Phân trang
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
