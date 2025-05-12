import { fetchGiangVien } from './get.js';
import { UpdateGiangVien } from './update.js';
import { addThongTinGiangVien } from './add.js';
import { RemoveNhanVien } from './delete.js';

let currentPage = 1;
const pageSize = 5;
let isEditing = false;
let editingId = null;
let fullData = [];

document.addEventListener('DOMContentLoaded', async function () {
    fullData = await fetchGiangVien();
    await ShowAll(currentPage);

    document.getElementById("btn-search").addEventListener("click", () => ShowAll(1));
    document.getElementById("btn-clear").addEventListener("click", () => {
        document.getElementById("search-name").value = "";
        document.getElementById("filter-chucvu").value = "";
        ShowAll(1);
    });
});

function filterData() {
    const searchValue = document.getElementById("search-name").value.toLowerCase().trim();
    const chucvuFilter = document.getElementById("filter-chucvu").value;

    return fullData.filter(gv => {
        const matchesName = gv.tennhanvien.toLowerCase().includes(searchValue);
        const matchesChucVu = !chucvuFilter || gv.chucvu === chucvuFilter;
        return matchesName && matchesChucVu;
    });
}

async function ShowAll(page = 1) {
    const filtered = filterData();
    const totalPages = Math.ceil(filtered.length / pageSize);
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    await HienThiThongTin(page, totalPages, paginated);
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

async function edit(encodedData) {
    const data = JSON.parse(decodeURIComponent(encodedData));
    isEditing = true;
    editingId = data.idnhanvien;

    document.getElementById('themnhanvien').textContent = "Lưu chỉnh sửa";
    document.getElementById('name').value = data.tennhanvien || '';
    document.getElementById('trinhdo').value = data.trinhdo || '';
    document.getElementById('chungchi').value = data.chungchi || '';
    document.getElementById('sdt').value = data.sdt || '';
    document.getElementById('chucvu').value = data.chucvu || '';
    document.getElementById('ghichu').value = data.ghichu || '';
}

async function saveChanges(idnhanvien) {
    const formData = {
        idnhanvien,
        tennhanvien: document.getElementById('name').value,
        trinhdo: document.getElementById('trinhdo').value,
        chungchi: document.getElementById('chungchi').value,
        sdt: document.getElementById('sdt').value,
        chucvu: document.getElementById('chucvu').value,
        ghichu: document.getElementById('ghichu').value,
        tienthuong: 0,
        tienphat: 0,
        trangthai: 1,
        tonggioday: 0
    };

    const result = await UpdateGiangVien(formData);
    if (result) {
        alert("Cập nhật thành công");
        fullData = await fetchGiangVien();
        await ShowAll(currentPage);
        clearForm();
        document.getElementById('themnhanvien').textContent = "Thêm nhân viên";
        isEditing = false;
        editingId = null;
    } else {
        alert("Cập nhật thất bại");
    }
}

document.getElementById('themnhanvien').addEventListener('click', async function () {
    if (isEditing && editingId) {
        await saveChanges(editingId);
    } else {
        const formData = {
            tennhanvien: document.getElementById('name').value,
            trinhdo: document.getElementById('trinhdo').value,
            chungchi: document.getElementById('chungchi').value,
            sdt: document.getElementById('sdt').value,
            chucvu: document.getElementById('chucvu').value,
            ghichu: document.getElementById('ghichu').value,
            tienthuong: 0,
            tienphat: 0,
            trangthai: 1,
            tonggioday: 0
        };

        const kq = await addThongTinGiangVien(formData);
        if (kq) {
            alert("Thêm thành công");
            fullData = await fetchGiangVien();
            await ShowAll(currentPage);
            clearForm();
        } else {
            alert("Thêm thất bại");
        }
    }
});

async function remove(id) {
    if (confirm("Bạn có muốn xóa giảng viên này không?")) {
        const result = await RemoveNhanVien(id);
        if (result) {
            alert("Xoá thành công");
            fullData = await fetchGiangVien();
            await ShowAll(currentPage);
        } else {
            alert("Xoá thất bại");
        }
    }
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('trinhdo').value = '';
    document.getElementById('chungchi').value = '';
    document.getElementById('sdt').value = '';
    document.getElementById('chucvu').value = '';
    document.getElementById('ghichu').value = '';
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

window.edit = edit;
window.remove = remove;
