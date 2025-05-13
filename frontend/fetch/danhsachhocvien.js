import { fetchKhoaHoc, fetchChiTiethocvienKhongid, fetchChiTiethocvienVoiIdKhocHoc } from './get.js';

let currentPage = 1;
let totalPages = 1;
const limit = 5;
let selectedCourseId = "";
let fullData = []; // dữ liệu tất cả học viên đã fetch

document.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(window.location.search);
    const idkhoahoc = params.get('idkhoahoc');

    const courseSelect = document.getElementById('filter-khoahoc');
    courseSelect.innerHTML = `<option value="">-- Tất cả khóa học --</option>`;
    const khoahocList = await fetchKhoaHoc();

    khoahocList.forEach(khoahoc => {
        const opt = document.createElement('option');
        opt.textContent = khoahoc.tenkhoahoc;
        opt.value = khoahoc.idkhoahoc;
        courseSelect.appendChild(opt);
    });

    // Lấy dữ liệu học viên theo ID khóa học nếu có
    fullData = idkhoahoc
        ? await fetchChiTiethocvienVoiIdKhocHoc(idkhoahoc)
        : await fetchChiTiethocvienKhongid();

    if (idkhoahoc) {
        selectedCourseId = idkhoahoc;
        courseSelect.value = idkhoahoc;
    }

    courseSelect.addEventListener('change', function () {
        selectedCourseId = this.value;
        currentPage = 1;
        filterAndShow();
    });

    filterAndShow();
});

function filterAndShow() {
    let filtered = fullData;

    if (selectedCourseId) {
        filtered = fullData.filter(student => student.idkhoahoc === selectedCourseId);
    }

    totalPages = Math.ceil(filtered.length / limit);
    const pagedData = filtered.slice((currentPage - 1) * limit, currentPage * limit);

    renderTable(pagedData);
    renderPagination(currentPage, totalPages);
}

function renderTable(students) {
    const container = document.getElementById('student-all');
    if (!students.length) {
        container.innerHTML = `<p style="font-style: italic; color: gray;">Không tìm thấy học viên nào.</p>`;
        return;
    }
    console.log(students);
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

function createPaginationButton(text, enabled, onClick) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.className = "pagination-button";
    btn.disabled = !enabled;
    btn.onclick = onClick;
    return btn;
}

function changePage(page) {
    currentPage = page;
    filterAndShow();
}
