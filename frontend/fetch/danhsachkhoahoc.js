
async function ShowAll(pages = 1, limit = 10) {
    currentPage = pages;
    const data = await fetchKhoaHoc(pages, limit);
    console.log("Fetched data:", data); // kiểm tra dữ liệu trả về
    totalPages = data.totalPages || 1;
    console.log(`Page: ${currentPage}, Total: ${totalPages}`);
    await HienThiThongTin(data);
    renderPagination();
}


document.addEventListener('DOMContentLoaded', async function () {
    // alert("chao ca nha");
    await ShowAll();
});


async function HienThiThongTin(data) {
    const all = document.getElementById('course-list-section');
    all.innerHTML = `
        <h3>Danh Sách Khóa Học</h3>
        <table class="course-list">
            <thead>
                <tr>
                    <th>Tên Khóa Học</th>
                    <th>Thời gian học</th>
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
    data.data.forEach(khoahoc => {
        body.innerHTML += `
            <tr>
                <td>${khoahoc.tenkhoahoc}</td>
                <td>${khoahoc.thoigianhoc}</td>
                <td>${khoahoc.soluongbuoi}</td>
                <td>${khoahoc.lichhoc}</td>
                <td>
                    <button onclick="edit(${khoahoc.idkhoahoc})">Edit</button> 
                    <button onclick="remove()">Remove</button> 
                  
                </td>
            </tr>`;
    });
}

function edit(id){
    window.location.href=`taovaquanlykhoahoc.html?idkhoahoc=${id}`;
}

function renderPagination() {
    const all = document.getElementById('pagination');
    all.innerHTML = "";
    const max = 10;
    let start = Math.max(currentPage - Math.floor(max / 2), 1);
    let end = currentPage + Math.floor(max / 2);

    const prev = document.createElement('button');
    prev.textContent = "<< Trước";
    prev.disabled = currentPage === 1;
    prev.onclick = () => ShowAll(currentPage - 1);
    all.appendChild(prev);

    for (let i = start; i <= end; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = i === currentPage ? "active" : "";
        btn.onclick = () => ShowAll(i);
        all.appendChild(btn);
    }

    const next = document.createElement('button');
    next.textContent = "Sau »";
    // next.disabled = data.data.length < limit;  // Khi số khóa học nhỏ hơn limit, không có trang sau
    next.onclick = () => ShowAll(currentPage + 1);
    all.appendChild(next);
}


let currentPage = 1;
let totalPages = 1;

async function fetchKhoaHoc(pages = 1, limit = 10) {
    const url = `http://localhost/quanlytrungtam/backend/controller/KhoaHocController.php?pages=${pages}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
}
