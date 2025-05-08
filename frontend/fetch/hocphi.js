import { fetchKhoaHoc } from './get.js';
import { UpdateGiaKhoaHoc } from './update.js';

let currentPage = 1;
const pageSize = 5;

document.addEventListener('DOMContentLoaded', async function () {
    const select = document.getElementById('course');
    const data = await fetchKhoaHoc();

    // Đổ dữ liệu vào dropdown
    data.forEach(khoahoc => {
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
    const data = await fetchKhoaHoc();

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = data.slice(start, end);
    const totalPages = Math.ceil(data.length / pageSize);

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Khóa học</th>
                    <th>Học phí</th>
                    <th>Giảm giá/Học bổng</th>
                    <th>Học phí sau giảm</th>
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
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    list.innerHTML = tableHTML;

    renderPagination({
        current: page,
        total: totalPages,
        onPage: async (newPage) => {
            currentPage = newPage;
            await renderTable(currentPage);
        }
    });
}

async function handleFeeSubmit(event) {
    event.preventDefault(); // Chặn submit form mặc định

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
            await renderTable(currentPage); // Reload bảng
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
