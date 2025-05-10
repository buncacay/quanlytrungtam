import {RemoveKhoaHoc} from './delete.js';
import {fetchKhoaHocPhanTrang} from './get.js';

let currentPage = 1;
let totalPages=1;

// hien thong tin cua trang day
async function ShowAll(pages = 1) {
    
    const response = await fetchKhoaHocPhanTrang(pages, 5);
    console.log(response);
    const students = response.data;
    currentPage = response.page;
    totalPages = response.total;

    // console.log("Fetched data:", data); // kiểm tra dữ liệu trả về
    // totalPages = data.totalPages || 1;
    // console.log(`Page: ${currentPage}, Total: ${totalPages}`);
    await HienThiThongTin(currentPage, totalPages, students);
    
}

async function filterSchedule() {
    const search = document.getElementById('search').value;
    await ShowAll(1, search);  // Chuyển search vào hàm ShowAll
}

window.filterSchedule=filterSchedule;


document.addEventListener('DOMContentLoaded', async function () {
    // alert("chao ca nha");
    await ShowAll();
});


async function HienThiThongTin(page,total,data) {
    const start = (page - 1) * 5;
    const end = start + 5;
   
    

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
    data.forEach(khoahoc => {
        body.innerHTML += `
            <tr>
                <td>${khoahoc.tenkhoahoc}</td>
                <td>${khoahoc.thoigianhoc}</td>
                <td>${khoahoc.soluongbuoi}</td>
                <td>${khoahoc.lichhoc}</td>
                <td>
                    <button onclick="edit(${khoahoc.idkhoahoc}, ${khoahoc.images})">Edit</button> 
                    <button onclick="remove(${khoahoc.idkhoahoc})">Remove</button> 
                  
                </td>
            </tr>`;
    });
    renderPagination(page, total);
    
}

function edit(id, images){
    window.location.href=`taovaquanlykhoahoc.html?idkhoahoc=${id}&&images=`;
}

async function remove(id){
    if (confirm("Bạn có muốn xóa khóa học này không?")){
        if (RemoveKhoaHoc(id)){
            const all = document.getElementById('course-list-section');
            all.innerHTML='';
            await ShowAll();
        }
    }
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




window.edit = edit;
window.remove = remove;
// window.save = save;
// window.add = add;
// window.them = them;
