import { fetchGiangVien } from './get.js';
import { UpdateGiangVien } from './update.js';
import {} from './delete.js';

let currentPage = 1;
const pageSize = 5;

document.addEventListener('DOMContentLoaded', async function () {
    await ShowAll(currentPage);
});

async function ShowAll(page = 1) {
    const data = await fetchGiangVien();

    const totalPages = Math.ceil(data.length / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = data.slice(start, end);

    await HienThiThongTin(page, totalPages, paginatedData);
}

async function HienThiThongTin(page, total, data) {
    const all = document.getElementById('giangvien');
    all.innerHTML = `
        <h3>Danh Sách Giảng Viên</h3>
        <table class="course-list">
            <thead>
                <tr>
                    <th>ID Nhân Viên</th>
                    <th>Tên Nhân Viên</th>
                    <th>Chức Vụ</th>
                    <th>Số giờ dạy</th>
                    <th>Lương</th>
                    <th>Ghi chú</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody id="body-details"></tbody>
        </table>
        <div id="pagination"></div>
    `;

    const body = document.getElementById('body-details');
    body.innerHTML = '';

    data.forEach(nv => {
        const encoded = encodeURIComponent(JSON.stringify(nv));
        body.innerHTML += `
            <tr>
                <td>${nv.idnhanvien}</td>
                <td>${nv.tennhanvien}</td>
                <td>${nv.chucvu}</td>
                <td>${nv.tonggioday}</td>
                <td>${nv.tienthuong - nv.tienphat}</td>
                <td>${nv.ghichu}</td>
                <td>
                    <button onclick="edit('${encoded}')">Edit</button>
                    <button onclick="remove(${nv.idnhanvien})">Remove</button>
                </td>
            </tr>
        `;
    });

    renderPagination({
        current: page,
        total: total,
        onPage: async (newPage) => {
            currentPage = newPage;
            await ShowAll(currentPage);
        }
    });
}

// Xử lý edit
function edit(encodedData) {
    const data = JSON.parse(decodeURIComponent(encodedData));

    document.getElementById('name').value = data.tennhanvien || '';
    document.getElementById('trinhdo').value = data.trinhdo || '';
    document.getElementById('chungchi').value = data.chungchi || '';
    document.getElementById('sdt').value = data.sdt || '';
    document.getElementById('chucvu').value = data.chucvu || '';
    document.getElementById('ghichu').value = data.ghichu || '';

    const formData = {
        tennhanvien: data.tennhanvien,
        trinhdo: data.trinhdo,
        chungchi: data.chungchi,
        sdt: data.sdt,
        tienthuong: data.tienthuong,
        tienphat: data.tienphat,
        chucvu: data.chucvu,
        ghichu: data.ghichu
    };

    console.log("Dữ liệu đã parse:", formData);
}


// Xử lý remove
async function remove(id) {
    if (confirm("Bạn có muốn xóa giảng viên này không?")) {
        // Gọi API xoá tại đây nếu có (ví dụ: await deleteGiangVien(id))
        await ShowAll(currentPage);
    }
}

// Render phân trang
function renderPagination({ current, total, onPage }) {
    const container = document.getElementById('pagination');
    container.innerHTML = '';

    const maxButtons = 5;
    let start = Math.max(current - Math.floor(maxButtons / 2), 1);
    let end = start + maxButtons - 1;

    if (end > total) {
        end = total;
        start = Math.max(end - maxButtons + 1, 1);
    }

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '« Trước';
    prevBtn.disabled = current === 1;
    prevBtn.className = 'pagination-button';
    prevBtn.onclick = () => onPage(current - 1);
    container.appendChild(prevBtn);

    for (let i = start; i <= end; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = 'pagination-button';
        if (i === current) btn.classList.add('active');
        btn.onclick = () => onPage(i);
        container.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Sau »';
    nextBtn.disabled = current === total;
    nextBtn.className = 'pagination-button';
    nextBtn.onclick = () => onPage(current + 1);
    container.appendChild(nextBtn);
}

// Đăng ký để dùng từ HTML
window.edit = edit;
window.remove = remove;
