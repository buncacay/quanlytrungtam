let currentPage = 1;
let totalPages = 1;
const limit = 5;

document.addEventListener('DOMContentLoaded', async function () {
    await ShowAll(currentPage);
});

async function ShowAll(pages, search = null) {
    currentPage = pages;
    const data = await fetchKhoaHoc(pages, limit, search);  
    totalPages = Math.ceil(data.total / limit); 
    await HienThiThongTin(data);
    renderPagination();
}

async function fetchKhoaHoc(pages, limit, search = null) {
    let url ="";
    if (search!=null){
        url = `http://localhost/quanlytrungtam/backend/controller/KhoahocController.php?action=chitiet&pages=${pages}&limit=${limit}&search=${search}`;

    }
    else {
        url = `http://localhost/quanlytrungtam/backend/controller/KhoahocController.php?action=chitiet&pages=${pages}&limit=${limit}`;

    }
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(await res.text());
    }
    const data = await res.json();
    console.log("huhu " , data);
    return data;
}

async function HienThiThongTin(data) {
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

    data.data.forEach(khoahoc => {
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

    // Button "Trước"
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "« Trước";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => ShowAll(currentPage - 1);
    container.appendChild(prevBtn);

    // Hiển thị các button số trang
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = i === currentPage ? "active" : "";
        btn.onclick = () => ShowAll(i);
        container.appendChild(btn);
    }

    // Button "Sau"
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Sau »";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => ShowAll(currentPage + 1);
    container.appendChild(nextBtn);

   
}

async function filterSchedule() {
    const search = document.getElementById('search').value;
    await ShowAll(1, search);  // Chuyển search vào hàm ShowAll
}
