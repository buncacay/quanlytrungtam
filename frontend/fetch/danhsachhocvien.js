import { fetchAllHocVien } from './get.js';

let currentPage = 1;
let totalPages = 1;
const limit = 5;

document.addEventListener('DOMContentLoaded', async function () {
    await showAll(currentPage);
});

async function showAll(page = 1) {
    try {
        const response = await fetchAllHocVien(page);
        const students = response.data || [];
        currentPage = response.page;
        totalPages = response.total;

        renderTable(students);
        renderPagination(currentPage, totalPages);
    } catch (error) {
        console.error("Lỗi khi tải danh sách học viên:", error);
        document.getElementById('student-all').innerHTML = "<p>Không thể tải danh sách học viên.</p>";
    }
}

function renderTable(students) {
    const container = document.getElementById('student-all');
    let rows = "";

    students.forEach(student => {
        alert(student.idhocvien); // ✅ dùng alert đúng cách
        rows += `
            <tr>
                <td>${student.idhocvien}</td>
                <td>${student.hoten}</td>
                <td><a href="tthocvien.html?id=${student.idhocvien}">Xem chi tiết</a></td>
            </tr>
        `;
    });

    container.innerHTML = `
        <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>Mã HV</th>
                    <th>Họ tên</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
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

    // Nút Previous
    const prevBtn = createPaginationButton("« Trước", currentPage > 1, () => showAll(currentPage - 1));
    container.appendChild(prevBtn);

    // Các nút số trang
    for (let i = startPage; i <= endPage; i++) {
        const btn = createPaginationButton(i, true, () => showAll(i));
        if (i === currentPage) btn.classList.add("active");
        container.appendChild(btn);
    }

    // Nút Next
    const nextBtn = createPaginationButton("Sau »", currentPage < totalPages, () => showAll(currentPage + 1));
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
