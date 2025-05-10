// main.js
import { fetchKhoaHoc } from './get.js';
import { UpdateGiaKhoaHoc } from './update.js';

let currentPage = 1;
const pageSize = 5;
let allCourses = []; // Dữ liệu toàn bộ khoá học để dùng lại trong edit

// Khởi tạo khi DOM tải xong
document.addEventListener('DOMContentLoaded', async () => {
    const select = document.getElementById('course');
    allCourses = await fetchKhoaHoc();

    allCourses.forEach(khoahoc => {
        const opt = document.createElement('option');
        opt.value = khoahoc.idkhoahoc;
        opt.textContent = khoahoc.tenkhoahoc;
        select.appendChild(opt);
    });

    await renderTable(currentPage);

    document.getElementById('feeForm').addEventListener('submit', handleFeeSubmit);
});

async function renderTable(page) {
    const list = document.getElementById('list');
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = allCourses.slice(start, end);
    const totalPages = Math.ceil(allCourses.length / pageSize);

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Khóa học</th>
                    <th>Học phí</th>
                    <th>Giảm giá/Học bổng</th>
                    <th>Học phí sau giảm</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
    `;

    paginatedData.forEach(khoahoc => {
        const hocPhiGoc = khoahoc.giatien || 0;
        const giamGia = khoahoc.giamgia || 0;
        const hocPhiSauGiam = hocPhiGoc - (hocPhiGoc * giamGia / 100);

        tableHTML += `
            <tr>
                <td>${khoahoc.tenkhoahoc}</td>
                <td>${hocPhiGoc.toLocaleString()} VND</td>
                <td>${giamGia}%</td>
                <td>${hocPhiSauGiam.toLocaleString()} VND</td>
                <td><button type="button" class="btn-edit" data-id="${khoahoc.idkhoahoc}">Sửa</button></td>
            </tr>
        `;
    });

    tableHTML += '</tbody></table>';
    list.innerHTML = tableHTML;

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => edit(btn.dataset.id));
    });

    renderPagination({
        current: page,
        total: totalPages,
        onPage: async (newPage) => {
            currentPage = newPage;
            await renderTable(currentPage);
        }
    });
}

function edit(id) {
    const khoahoc = allCourses.find(kh => kh.idkhoahoc === id);
    if (!khoahoc) {
        alert('Không tìm thấy khoá học!');
        return;
    }

    document.getElementById('course').value = khoahoc.idkhoahoc;
    document.getElementById('fee').value = khoahoc.giatien;
    document.getElementById('discount').value = khoahoc.giamgia;
    document.getElementById('editCourseId').value = khoahoc.idkhoahoc;
    document.getElementById('btn').innerText = 'Lưu chỉnh sửa';
}

async function handleFeeSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('course').value;
    const fee = parseFloat(document.getElementById('fee').value);
    const discountText = document.getElementById('discount').value;
    const discount = discountText ? parseFloat(discountText) : 0;

    const data = {
        idkhoahoc: id,
        giatien: fee,
        giamgia: discount
    };

    try {
        const success = await UpdateGiaKhoaHoc(data);
        if (success) {
            alert("Cập nhật thành công!");
            allCourses = await fetchKhoaHoc(); // Reload dữ liệu
            await renderTable(currentPage);
            document.getElementById('btn').innerText = 'Cập nhật học phí';
            document.getElementById('feeForm').reset();
        } else {
            alert("Cập nhật thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        alert("Có lỗi xảy ra khi cập nhật.");
    }
}

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
