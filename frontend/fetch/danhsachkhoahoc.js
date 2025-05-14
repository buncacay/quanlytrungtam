import { RemoveKhoaHoc } from './delete.js';
import { fetchKhoaHocPhanTrang } from './get.js';

let currentPage = 1;
let totalPages = 1;
let currentFilteredData = []; // Dữ liệu hiện tại (gốc hoặc đã lọc)

// Load dữ liệu ban đầu
document.addEventListener('DOMContentLoaded', async function () {
    await ShowAll(); // Gọi hiển thị khi trang load
});

// Gắn sự kiện lọc
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

// Lấy bộ lọc từ form
function getFilters() {
    return {
        search: document.getElementById('search')?.value || '',
        startDate: document.getElementById('startDate')?.value || '',
        endDate: document.getElementById('endDate')?.value || '',
        status: document.getElementById('status')?.value || ''
    };
}

// Hàm phân trang dữ liệu từ mảng
function getPaginatedData(data, page, pageSize) {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
}

// Gọi lại khi lọc
async function filterSchedule() {
    const filters = getFilters();
    const response = await fetchKhoaHocPhanTrang(1, 1000); // Lấy toàn bộ để lọc
    let filteredData = response.data;

    // Lọc theo điều kiện
    filteredData = filteredData.filter(khoahoc => {
        const matchesSearch = khoahoc.tenkhoahoc.toLowerCase().includes(filters.search.toLowerCase());
        const matchesStartDate = filters.startDate ? new Date(khoahoc.ngaybatdau) >= new Date(filters.startDate) : true;
        const matchesEndDate = filters.endDate ? new Date(khoahoc.ngayketthuc) <= new Date(filters.endDate) : true;
        const matchesStatus = filters.status ? khoahoc.trangthai == filters.status : true;
        return matchesSearch && matchesStartDate && matchesEndDate && matchesStatus;
    });

    currentFilteredData = filteredData;
    currentPage = 1;
    totalPages = Math.ceil(filteredData.length / 5);
    const paginatedData = getPaginatedData(currentFilteredData, currentPage, 5);
    await HienThiThongTin(currentPage, totalPages, paginatedData);
}
window.filterSchedule = filterSchedule;

// Hiển thị tất cả dữ liệu
async function ShowAll(page = 1) {
    currentPage = page;

    if (currentFilteredData.length === 0) {
        // Lần đầu load: lấy toàn bộ dữ liệu (không lọc)
        const response = await fetchKhoaHocPhanTrang(1, 1000);
        currentFilteredData = response.data;
    }

    totalPages = Math.ceil(currentFilteredData.length / 5);
    const paginatedData = getPaginatedData(currentFilteredData, page, 5);
    await HienThiThongTin(page, totalPages, paginatedData);
}

// Hiển thị danh sách khóa học
async function HienThiThongTin(page, total, data) {
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
        let statusText = "";
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

// Định dạng ngày kiểu Việt Nam
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Chuyển sang trang chỉnh sửa
function edit(id, images) {
    window.location.href = `taovaquanlykhoahoc.html?idkhoahoc=${id}&&images=${images}`;
}
window.edit = edit;

// Xóa khóa học
async function remove(id) {
    if (confirm("Bạn có muốn xóa khóa học này không?")) {
        const result = await RemoveKhoaHoc(id);
        if (result) {
            await ShowAll(currentPage); // Refresh trang hiện tại
        }
        else {
            alert("cai cai moe j");
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
