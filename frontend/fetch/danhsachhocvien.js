import { fetchKhoaHoc, fetchChiTiethocvienKhongid, fetchChiTiethocvienVoiIdKhocHoc } from './get.js';

let currentPage = 1;
let totalPages = 1;
const limit = 5;
let selectedCourseId = "";
let fullData = []; // Dữ liệu tất cả học viên đã fetch
let uniqueStudents = []; // Dữ liệu học viên duy nhất (không trùng lặp)

document.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(window.location.search);
    const idkhoahoc = params.get('idkhoahoc');

    const courseSelect = document.getElementById('filter-khoahoc');
    const khoahocList = await fetchKhoaHoc();

    // khoahocList.forEach(khoahoc => {
    //     const opt = document.createElement('option');
    //     opt.textContent = khoahoc.tenkhoahoc;
    //     opt.value = khoahoc.idkhoahoc;
    //     courseSelect.appendChild(opt);
    // });

    // Lấy dữ liệu học viên theo ID khóa học nếu có
    fullData = idkhoahoc
        ? await fetchChiTiethocvienVoiIdKhocHoc(idkhoahoc)
        : await fetchChiTiethocvienKhongid();

    // Lọc và nhóm dữ liệu học viên duy nhất theo ID học viên
    uniqueStudents = groupByUniqueStudents(fullData);

    if (idkhoahoc) {
        selectedCourseId = idkhoahoc;
        courseSelect.value = idkhoahoc;
    }

    // courseSelect.addEventListener('change', function () {
    //     selectedCourseId = this.value;
    //     currentPage = 1;
    //     filterAndShow();
    // });
    currentPage = 1;
    filterAndShow();
});

// Hàm nhóm và lọc học viên duy nhất
function groupByUniqueStudents(data) {
    const uniqueHocVien = [];
    const seenIds = new Set();

    data.forEach(item => {
        if (!seenIds.has(item.idhocvien)) {
            seenIds.add(item.idhocvien);
            uniqueHocVien.push(item);
        }
    });

    return uniqueHocVien;
}

// Hàm lọc và hiển thị danh sách học viên
function filterAndShow() {
    let filtered = uniqueStudents;

    if (selectedCourseId) {
        filtered = uniqueStudents.filter(student => student.idkhoahoc === selectedCourseId);
    }

    totalPages = Math.ceil(filtered.length / limit);
    const pagedData = filtered.slice((currentPage - 1) * limit, currentPage * limit);

    renderTable(pagedData);
    renderPagination(currentPage, totalPages);
}

// Hàm render bảng học viên
function renderTable(students) {
    const container = document.getElementById('student-all');
    if (!students.length) {
        container.innerHTML = `<p style="font-style: italic; color: gray;">Không tìm thấy học viên nào.</p>`;
        return;
    }

    const rows = students.map(student => `
        <tr>
            <td>${student.idhocvien}</td>
            <td>${student.hoten}</td>
            <td><a href="tthocvien.html?id=${student.idhocvien}">Xem chi tiết</a></td>
        </tr>
    `).join('');

    container.innerHTML = `
        <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>Mã HV</th>
                    <th>Họ tên</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

// Hàm render phân trang
function renderPagination(currentPage, totalPages) {
    const container = document.getElementById("pagination");
    container.innerHTML = "";

    const maxVisiblePages = 5;
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const prevBtn = createPaginationButton("« Trước", currentPage > 1, () => changePage(currentPage - 1));
    container.appendChild(prevBtn);

    for (let i = startPage; i <= endPage; i++) {
        const btn = createPaginationButton(i, true, () => changePage(i));
        if (i === currentPage) btn.classList.add("active");
        container.appendChild(btn);
    }

    const nextBtn = createPaginationButton("Sau »", currentPage < totalPages, () => changePage(currentPage + 1));
    container.appendChild(nextBtn);
}

// Hàm tạo nút phân trang
function createPaginationButton(text, enabled, onClick) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.className = "pagination-button";
    btn.disabled = !enabled;
    btn.onclick = onClick;
    return btn;
}

// Hàm thay đổi trang
function changePage(page) {
    currentPage = page;
    filterAndShow();
}
