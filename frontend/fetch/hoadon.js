import { fetchKhoaHoc, fetchHoaDon, fetchAllHocVien } from './get.js';
import { addHoaDon } from './add.js';
import { RemoveHoaDon } from './delete.js';
import { UpdateHoaDon } from './update.js';

let currentPage = 1;
const itemsPerPage = 5;
let isEditing = false;
let editingId = null;

document.addEventListener('DOMContentLoaded', async function () {
    await loadHocVienDropdown();
    await loadKhoaHocDropdownAndTable();
    await renderHoaDonTable(currentPage);

    document.getElementById("invoiceForm").addEventListener("submit", tao);
    document.getElementById('btn-search').addEventListener('click', () => {
        currentPage = 1;
        renderHoaDonTable(currentPage);
    });
    document.getElementById('btn-clear').addEventListener('click', () => {
        document.getElementById('search-tenhoadon').value = '';
        currentPage = 1;
        renderHoaDonTable(currentPage);
    });
});

async function loadHocVienDropdown() {
    const hocVienSelect = document.getElementById('hsinh');
    const { data } = await fetchAllHocVien();

    data.forEach(hocvien => {
        const option = document.createElement('option');
        option.value = hocvien.idhocvien;
        option.textContent = hocvien.hoten;
        hocVienSelect.appendChild(option);
    });
}

async function loadKhoaHocDropdownAndTable() {
    const khoaHocSelect = document.getElementById('course');
    const khoaHocList = await fetchKhoaHoc();

    khoaHocList.forEach(khoahoc => {
        const option = document.createElement('option');
        option.value = khoahoc.idkhoahoc;
        option.textContent = khoahoc.tenkhoahoc;
        khoaHocSelect.appendChild(option);
    });
}

async function renderHoaDonTable(page) {
    let hoaDonList = await fetchHoaDon();
    const searchKeyword = document.getElementById('search-tenhoadon')?.value.toLowerCase().trim();

    if (searchKeyword) {
        hoaDonList = hoaDonList.filter(hd =>
            hd.tenkhoahoc?.toLowerCase().includes(searchKeyword)
        );
    }

    const invoiceContainer = document.getElementById('invoice');

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = hoaDonList.slice(startIndex, endIndex);
    const totalPages = Math.ceil(hoaDonList.length / itemsPerPage);

    let invoiceTable = `
        <table border="1">
            <thead>
                <tr>
                    <th>Mã hóa đơn</th>
                    <th>Tên học viên</th>
                    <th>Khóa học</th>
                    <th>Số tiền</th>
                    <th>Ngày thanh toán</th>
                    <th>Loại hóa đơn</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
    `;

    paginatedData.forEach(hoadon => {
        invoiceTable += `
            <tr>
                <td>${hoadon.idhoadon}</td>
                <td>${hoadon.hoten}</td>
                <td>${hoadon.tenkhoahoc}</td>
                <td>${Number(hoadon.thanhtien).toLocaleString()} VND</td>
                <td>${hoadon.thoigianlap}</td>
                <td>${hoadon.loai}</td>
                <td>
                    <button class="btn-view" data-hoadon='${JSON.stringify(hoadon)}'>Sửa</button>
                    <button class="btn-delete" data-id="${hoadon.idhoadon}">Xóa</button>
                </td>
            </tr>
        `;
    });

    invoiceTable += `</tbody></table>`;
    invoiceContainer.innerHTML = invoiceTable;

    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', () => sua(JSON.parse(btn.dataset.hoadon)));
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => xoa(btn.dataset.id));
    });

    renderPagination({
        currentPage: page,
        totalPages: totalPages,
        onPageChange: (newPage) => {
            currentPage = newPage;
            renderHoaDonTable(currentPage);
        }
    });
}

async function sua(hoadon) {
    isEditing = true;
    editingId = hoadon.idhoadon;

    document.getElementById('hsinh').value = hoadon.idhocvien;
    document.getElementById('course').value = hoadon.idkhoahoc;
    document.getElementById('amount').value = hoadon.thanhtien;
    document.getElementById('date').value = hoadon.thoigianlap.split(" ")[0];
    document.getElementById('loai').value = hoadon.loai;

    document.getElementById('btn').innerText = "Lưu chỉnh sửa";
}

async function xoa(id) {
    if (await RemoveHoaDon(id)) {
        await renderHoaDonTable(currentPage);
        alert("Đã xóa hóa đơn thành công");
    } else {
        alert(`Xóa hóa đơn ${id} thất bại`);
    }
}

async function tao(event) {
    event.preventDefault();

    const idhocvien = document.getElementById('hsinh').value;
    const idkhoahoc = document.getElementById('course').value;
    const tien = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const type = document.getElementById('loai').value;

    const data = {
        tenhoadon: "thanh toan",
        thoigianlap: date,
        thanhtien: tien,
        idhocvien: idhocvien,
        idkhoahoc: idkhoahoc,
        loai: type,
        giamgia: 0
    };

    try {
        if (isEditing && editingId) {
            data.idhoadon = editingId;
            await UpdateHoaDon(data);
            alert("Cập nhật hóa đơn thành công!");
        } else {
            await addHoaDon(data);
            alert("Tạo hóa đơn thành công!");
        }

        document.getElementById("invoiceForm").reset();
        document.getElementById("btn").innerText = "Tạo hóa đơn";

        isEditing = false;
        editingId = null;

        await renderHoaDonTable(currentPage);
    } catch (error) {
        console.error("Lỗi:", error);
        alert((isEditing ? "Cập nhật" : "Tạo") + " hóa đơn thất bại!");
    }
}

function renderPagination({ currentPage, totalPages, onPageChange }) {
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
    prevBtn.className = "pagination-button";
    prevBtn.onclick = () => onPageChange(currentPage - 1);
    container.appendChild(prevBtn);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = "pagination-button";
        if (i === currentPage) btn.classList.add("active");
        btn.onclick = () => onPageChange(i);
        container.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Sau »";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.className = "pagination-button";
    nextBtn.onclick = () => onPageChange(currentPage + 1);
    container.appendChild(nextBtn);
}
