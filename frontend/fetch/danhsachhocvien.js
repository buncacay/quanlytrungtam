let currentPage = 1;
let totalPages = 1;
const limit = 5;

document.addEventListener('DOMContentLoaded', async function () {
    await ShowAll(currentPage);
});

async function fetchThongTin(page = 1) {
    const res = await fetch(`http://localhost/quanlytrungtam/backend/controller/HocvienController.php?page=${page}&limit=${limit}`);
    if (!res.ok) {
        throw new Error(await res.text());
    }

    const data = await res.json();
    return data;
}

async function ShowAll(page = 1) {
    const response = await fetchThongTin(page);
    const students = response.data;
    currentPage = response.page;
    totalPages = response.total_pages;

    const student_all = document.getElementById('student-all');
    student_all.innerHTML = `
        <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>Mã HV</th>
                    <th>Họ tên</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody id="student-tbody"></tbody>
        </table>
    `;

    const tbody = document.getElementById('student-tbody');
    tbody.innerHTML = ""; // Xóa dữ liệu cũ

    students.forEach(student => {
        tbody.innerHTML += `
            <tr>
                <td>${student.idhocvien}</td>
                <td>${student.hoten}</td>
                <td><a href="tthocvien.html?id=${student.idhocvien}">Xem chi tiết</a></td>
            </tr>
        `;
    });

    renderPagination();
}

function renderPagination() {
    const container = document.getElementById("pagination");
    container.innerHTML = "";

    const maxVisiblePages = 5;
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "« Trước";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => ShowAll(currentPage - 1);
    container.appendChild(prevBtn);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = i === currentPage ? "active" : "";
        btn.onclick = () => ShowAll(i);
        container.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Sau »";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => ShowAll(currentPage + 1);
    container.appendChild(nextBtn);
}

