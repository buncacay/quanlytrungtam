import { RemoveKhoaHoc } from './delete.js';
import { fetchKhoaHocPhanTrang } from './get.js';

let currentPage = 1;
let totalPages = 1;

// Gọi ban đầu khi load trang
document.addEventListener('DOMContentLoaded', async function () {
    await ShowAll();
});

// Thêm phần tìm kiếm
document.getElementById('search').addEventListener('input', async function () {
    await filterSchedule();
});

document.getElementById('startDate').addEventListener('input', async function () {
    await filterSchedule();
});

document.getElementById('endDate').addEventListener('input', async function () {
    await filterSchedule();
});

document.getElementById('status').addEventListener('change', async function () {
    await filterSchedule();
});

// Lấy dữ liệu lọc từ giao diện
async function ShowAll(page = 1, filters = {}) {
    const response = await fetchKhoaHocPhanTrang(page, 5, filters);

    const students = response.data;
    currentPage = response.page || 1;
    totalPages = Math.ceil(response.total / 5) || 1;

    await HienThiThongTin(currentPage, totalPages, students);
}

function getFilters() {
    const search = document.getElementById('search')?.value || '';  // Tìm kiếm theo tên khóa học
    const startDate = document.getElementById('startDate')?.value || '';  // Ngày bắt đầu
    const endDate = document.getElementById('endDate')?.value || '';  // Ngày kết thúc
    const status = document.getElementById('status')?.value || '';  // Trạng thái

    return { search, startDate, endDate, status };
}

async function filterSchedule() {
    const filters = getFilters(); // Lấy các giá trị bộ lọc từ giao diện

    // Gọi API lấy dữ liệu khóa học theo phân trang (2 tham số: trang và số lượng mỗi trang)
    const response = await fetchKhoaHocPhanTrang(1, 1000); // Lấy hết dữ liệu (không phân trang) để lọc

    let filteredData = response.data;

    // Sử dụng filter để lọc theo điều kiện
    filteredData = filteredData.filter(khoahoc => {
        const matchesSearch = khoahoc.tenkhoahoc.toLowerCase().includes(filters.search.toLowerCase());
        const matchesStartDate = filters.startDate ? new Date(khoahoc.ngaybatdau) >= new Date(filters.startDate) : true;
        const matchesEndDate = filters.endDate ? new Date(khoahoc.ngayketthuc) <= new Date(filters.endDate) : true;
        const matchesStatus = filters.status ? khoahoc.trangthai == filters.status : true;

        return matchesSearch && matchesStartDate && matchesEndDate && matchesStatus;
    });

    // Reset về trang 1 khi thay đổi bộ lọc
    currentPage = 1;

    // Cập nhật lại số lượng trang
    totalPages = Math.ceil(filteredData.length / 5);

    // Hiển thị kết quả sau khi lọc
    await HienThiThongTin(currentPage, totalPages, filteredData);
}

window.filterSchedule = filterSchedule;

// Hiển thị thông tin khóa học
async function HienThiThongTin(page, total, data) {
    console.log(data);
    const all = document.getElementById('course-list-section');
    all.innerHTML = `
        <h3>Danh Sách Khóa Học</h3>
        <table class="course-list">
            <thead>
                <tr>
                    <th>Tên Khóa Học</th>
                    <th>Ngày Bắt Đầu</th>
                    <th>Ngày Kết Thúc</th>
                    <th>Trạng Thái</th>
                    <th>Số lượng buổi</th>
                    <th>Lịch học</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody id="body-details"></tbody>
        </table>
    `;
    const body = document.getElementById('body-details');
    body.innerHTML = "";

    data.forEach(khoahoc => {
        let statusText = "";  // Khai báo statusText trước khi sử dụng

        // Kiểm tra trạng thái và gán giá trị cho statusText
        if (khoahoc.trangthai === 1 || khoahoc.trangthai === '1') {
            statusText = "Đang giảng dạy";
        } else if (khoahoc.trangthai === 2 || khoahoc.trangthai === '2') {
            statusText = "Đã hoàn thành";
        } else {
            statusText = "Đã xóa";
        }

        body.innerHTML += `
            <tr>
                <td>${khoahoc.tenkhoahoc}</td>
                <td>${formatDate(khoahoc.ngaybatdau)}</td>  
                <td>${formatDate(khoahoc.ngayketthuc)}</td>  
                <td>${statusText}</td>
                <td>${khoahoc.soluongbuoi}</td>
                <td>${khoahoc.lichhoc}</td>
                <td>
                    <button onclick="edit(${khoahoc.idkhoahoc}, '${khoahoc.images}')">Edit</button>
                    <button onclick="remove(${khoahoc.idkhoahoc})">Remove</button>
                </td>
            </tr>`;
    });

    renderPagination(page, total);
}

// Hàm chuyển đổi định dạng ngày
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Chỉnh sửa khóa học
function edit(id, images) {
    window.location.href = `taovaquanlykhoahoc.html?idkhoahoc=${id}&&images=${images}`;
}
window.edit = edit;

// Xóa khóa học
async function remove(id) {
    if (confirm("Bạn có muốn xóa khóa học này không?")) {
        const result = await RemoveKhoaHoc(id);
        if (result) {
            await ShowAll();
        }
    }
}
window.remove = remove;

// Hiển thị phân trang
function renderPagination(currentPage, totalPages) {
    const container = document.getElementById("pagination");
    container.innerHTML = "";

    const maxVisiblePages = 5;
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "« Trước";
    prevBtn.disabled = currentPage === 1;
    prevBtn.className = 'pagination-button';
    prevBtn.onclick = () => ShowAll(currentPage - 1);
    container.appendChild(prevBtn);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = (i === currentPage) ? "active" : "pagination-button";
        btn.onclick = () => ShowAll(i);
        container.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Sau »";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.className = 'pagination-button';
    nextBtn.onclick = () => ShowAll(currentPage + 1);
    container.appendChild(nextBtn);
}
