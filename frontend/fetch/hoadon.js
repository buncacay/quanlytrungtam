import { fetchKhoaHoc, fetchHoaDon, fetchAllHocVien } from './get.js';
import { addHoaDon } from './add.js';
import {RemoveHoaDon} from './delete.js';

let currentPage = 1;
const itemsPerPage = 5;

document.addEventListener('DOMContentLoaded', async function (event) {
    await loadHocVienDropdown();
    await loadKhoaHocDropdownAndTable();
    await renderHoaDonTable(currentPage);

    const form = document.getElementById("invoiceForm");
    form.addEventListener("submit", function(event) {
        tao(event);
    });
    document.getElementById('btn').innerText = "Tạo hóa đơn";
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

    let courseTable = `
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

    khoaHocList.forEach(khoahoc => {
        const giatien = khoahoc.giatien || 0;
        const giamgia = khoahoc.giamgia || 0;
        const thanhtien = giatien - (giatien * giamgia / 100);

        courseTable += `
            <tr>
                <td>${khoahoc.tenkhoahoc}</td>
                <td>${giatien.toLocaleString()} VND</td>
                <td>${giamgia}%</td>
                <td>${thanhtien.toLocaleString()} VND</td>
            </tr>
        `;
    });

    courseTable += `</tbody></table>`;
    
}

async function renderHoaDonTable(page) {
    const hoaDonList = await fetchHoaDon();
    const invoiceContainer = document.getElementById('invoice');

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = hoaDonList.slice(startIndex, endIndex);
    const totalPages = Math.ceil(hoaDonList.length / itemsPerPage);

    let invoiceTable = `
        <table>
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
                    <button class ="btn-view" onclick='sua(${JSON.stringify(hoadon)})'>Sửa</button>
                    <button class="btn-delete" onclick="xoa(${hoadon.idhoadon})">Xóa</button>
                </td>
            </tr>
        `;
    });

    invoiceTable += `</tbody></table>`;
    invoiceContainer.innerHTML = invoiceTable;

    renderPagination({
        currentPage: page,
        totalPages: totalPages,
        onPageChange: (newPage) => {
            currentPage = newPage;
            renderHoaDonTable(currentPage);
        }
    });
}

window.sua = function (hoadon) {


    document.getElementById('hsinh').value = hoadon.idhocvien;
    document.getElementById('course').value = hoadon.idkhoahoc;
    document.getElementById('amount').value = hoadon.thanhtien;
    document.getElementById('date').value = hoadon.thoigianlap.split(" ")[0];
    document.getElementById('loai').value = hoadon.loai;
    
    const btn = document.getElementById('btn');
    if (btn) {
        btn.innerText = "Lưu chỉnh sửa";
    } else {
        console.error("Không tìm thấy nút có id 'btn'");
    }
};

window.xoa = async function (id) {
    if (await RemoveHoaDon(id)) {
        await renderHoaDonTable(currentPage);
        alert("da xoa thanh cong");
    }
    else {
        alert(`Xóa hóa đơn ${id} that bai`);
    }
    
};

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

async function tao(event){
    event.preventDefault();

    const idhocvien = document.getElementById('hsinh').value;
    const idkhoahoc = document.getElementById('course').value;
    const tien = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const type = document.getElementById('loai').value;
    console.log(type);
    const data = {
        tenhoadon: "thanh toan",
        thoigianlap: date,
        thanhtien: tien,
        idhocvien: idhocvien,
        idkhoahoc: idkhoahoc,
        loai: type
    };

    try {
        const res = await addHoaDon(data);
        alert("Tạo hóa đơn thành công!");
        await renderHoaDonTable(currentPage);
    } catch (error) {
        console.error("Lỗi khi thêm hóa đơn:", error);
        alert("Tạo hóa đơn thất bại!");
    }
}
