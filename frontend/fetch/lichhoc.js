import {fetchKhoaHocWithSearch} from './get.js';

let currentPage = 1;
let totalPages = 1;
const limit = 5;

document.addEventListener('DOMContentLoaded', async function () {
    await ShowAll(currentPage);
});

async function ShowAll(pages, search = null) {
    
    const response = await fetchKhoaHocWithSearch(pages, limit, search);  
    
    const students = response.data;
    currentPage = response.page;
    totalPages = response.total;
    console.log(students);
    await HienThiThongTin(currentPage, totalPages, students);

    
}



async function HienThiThongTin(page,total,data) {
    
    const start = (page - 1) * 5;
    const end = start + 5;
   
    const all = document.getElementById('schedule-table');
    all.innerHTML = `
       <h3>Lịch học hiện tại</h3>
            <table>
                <thead>
                    <tr>
                        <th>Ngày học</th>
                        <th>Thời gian</th>
                        <th>Khóa học</th>
                        <th>Giảng viên</th>
                        <th>Phòng học</th>
                        <th>Ghi chú</th>
                    </tr>
                </thead>
                <tbody id="details">
                </tbody>
            </table>`;

    const details = document.getElementById('details');
    details.innerHTML = "";
    if (!Array.isArray(data)) {
        console.error("Dữ liệu không hợp lệ:", data);
        return;
    }
    data.forEach(khoahoc => {
        details.innerHTML += `
            <tr>
                <td>${khoahoc.lichhoc}</td>
                <td>${khoahoc.thoigianhoc}</td>
                <td>${khoahoc.tenkhoahoc}</td>
                <td>${khoahoc.tennhanvien}</td>
                <td>${khoahoc.diadiemhoc}</td>
                <td>-</td>
            </tr>
        `;
    });
    renderPagination(page, total);
}

// hien cac nut ne
function renderPagination(currentPage, totalPages ) {
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
    prevBtn.className = 'pagination-button';
    prevBtn.onclick = () => ShowAll(currentPage - 1);
    container.appendChild(prevBtn);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = 'pagination-button';
        btn.className = i === currentPage ? "active" : "";
        btn.onclick = () => ShowAll(i);
        container.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Sau »";
    nextBtn.className = 'pagination-button';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => ShowAll(currentPage + 1);
    container.appendChild(nextBtn);
}

async function filterSchedule() {
    const search = document.getElementById('search').value;
    await ShowAll(1, search);  // Chuyển search vào hàm ShowAll
}

window.filterSchedule=filterSchedule;