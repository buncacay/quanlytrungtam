import {
    fetchKhoaHoc,
    fetchHoaDon,
    fetchAllHocVien,
    fetchHoaDonWithId,
    fetchChiTietNhanVien
} from './get.js';
import { addHoaDon } from './add.js';
import { RemoveHoaDon } from './delete.js';
import { UpdateHoaDon } from './update.js';

let currentPage = 1;
let isEditing = false;
let editingId = null;
const itemsPerPage = 5;

document.addEventListener('DOMContentLoaded', async () => {
    await loadHocVienDropdown();
    await loadKhoaHocDropdownAndTable();
    await renderHoaDonTable(currentPage);

    const idhoadon = new URLSearchParams(window.location.search).get('idhoadon');
    if (idhoadon) {
        const res = await fetchHoaDonWithId(idhoadon);
        await sua(res);
    }

    document.getElementById("invoiceForm").addEventListener("submit", tao);
    document.getElementById("btn-search").addEventListener("click", () => {
        currentPage = 1;
        renderHoaDonTable(currentPage);
    });
    document.getElementById("btn-clear").addEventListener("click", () => {
        document.getElementById("search-tenhoadon").value = '';
        currentPage = 1;
        renderHoaDonTable(currentPage);
    });

    document.getElementById("loai").addEventListener("change", (e) => {
        const isHocPhi = e.target.value === "1";
        document.getElementById("invoiceForm").style.display = isHocPhi ? "block" : "none";
        document.getElementById("salary-form").style.display = isHocPhi ? "none" : "block";
        if (!isHocPhi) loadLuongNhanVien();
    });
});

async function loadHocVienDropdown() {
    const { data } = await fetchAllHocVien();
    const select = document.getElementById("hsinh");
    select.innerHTML = '';
    data.forEach(hv => {
        const opt = document.createElement("option");
        opt.value = hv.idhocvien;
        opt.textContent = hv.hoten;
        select.appendChild(opt);
    });
}

async function loadKhoaHocDropdownAndTable() {
    const select = document.getElementById("course");
    const list = await fetchKhoaHoc();
    select.innerHTML = '';
    list.forEach(kh => {
        const opt = document.createElement("option");
        opt.value = kh.idkhoahoc;
        opt.textContent = kh.tenkhoahoc;
        select.appendChild(opt);
    });
}

async function renderHoaDonTable(page) {
    let data = await fetchHoaDon();
    const keyword = document.getElementById("search-tenhoadon")?.value.toLowerCase().trim();
    if (keyword) data = data.filter(hd => hd.tenkhoahoc?.toLowerCase().includes(keyword));

    const paged = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const table = `
        <table border="1">
            <thead>
                <tr>
                    <th>Mã hóa đơn</th>
                    <th>Tên học viên</th>
                    <th>Khóa học</th>
                    <th>Số tiền</th>
                    <th>Ngày thanh toán</th>
                    <th>Loại</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                ${paged.map(hd => `
                    <tr>
                        <td>${hd.idhoadon}</td>
                        <td>${hd.hoten}</td>
                        <td>${hd.tenkhoahoc}</td>
                        <td>${Number(hd.thanhtien).toLocaleString()} VND</td>
                        <td>${hd.thoigianlap}</td>
                        <td>${hd.loai == 1 ? 'Học phí' : 'Chi phí'}</td>
                        <td>
                            <button class="btn-view" data-hoadon='${JSON.stringify(hd)}'>Sửa</button>
                            <button class="btn-delete" data-id="${hd.idhoadon}">Xóa</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById("invoice").innerHTML = table;

    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', () => sua(JSON.parse(btn.dataset.hoadon)));
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => xoa(btn.dataset.id));
    });

    renderPagination({ currentPage: page, totalPages: Math.ceil(data.length / itemsPerPage), onPageChange: p => {
        currentPage = p;
        renderHoaDonTable(p);
    } });
}

async function sua(hd) {
    isEditing = true;
    editingId = hd.idhoadon;
    document.getElementById("hsinh").value = hd.idhocvien;
    document.getElementById("course").value = hd.idkhoahoc;
    document.getElementById("amount").value = hd.thanhtien;
    document.getElementById("date").value = hd.thoigianlap.split(" ")[0];
    document.getElementById("loai").value = hd.loai;
    document.getElementById("btn").innerText = "Lưu chỉnh sửa";
}

async function xoa(id) {
    if (await RemoveHoaDon(id)) {
        renderHoaDonTable(currentPage);
        alert("Đã xóa thành công");
    } else {
        alert("Xóa thất bại");
    }
}

async function tao(e) {
    e.preventDefault();
    const data = {
        tenhoadon: "thanh toan",
        thoigianlap: document.getElementById("date").value,
        thanhtien: document.getElementById("amount").value,
        idhocvien: document.getElementById("hsinh").value,
        idkhoahoc: document.getElementById("course").value,
        loai: document.getElementById("loai").value,
        giamgia: 0
    };

    if (isEditing && editingId) {
        data.idhoadon = editingId;
        await UpdateHoaDon(data);
        alert("Cập nhật thành công");
    } else {
        await addHoaDon(data);
        alert("Tạo hóa đơn thành công");
    }

    document.getElementById("invoiceForm").reset();
    document.getElementById("btn").innerText = "Tạo hóa đơn";
    isEditing = false;
    editingId = null;
    await renderHoaDonTable(currentPage);
}

function renderPagination({ currentPage, totalPages, onPageChange }) {
    const container = document.getElementById("pagination");
    container.innerHTML = '';
    if (totalPages <= 1) return;

    const createBtn = (label, disabled, onClick) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.disabled = disabled;
        btn.className = "pagination-button";
        btn.onclick = onClick;
        return btn;
    };

    container.appendChild(createBtn("« Trước", currentPage === 1, () => onPageChange(currentPage - 1)));
    for (let i = 1; i <= totalPages; i++) {
        const btn = createBtn(i, false, () => onPageChange(i));
        if (i === currentPage) btn.classList.add("active");
        container.appendChild(btn);
    }
    container.appendChild(createBtn("Sau »", currentPage === totalPages, () => onPageChange(currentPage + 1)));
}

async function loadLuongNhanVien() {
    const data = await fetchChiTietNhanVien();
    const select = document.getElementById("filter-gv");
    const btnFilter = document.getElementById("btn-filter");
    const btnCreate = document.getElementById("btn-create-salary-invoice");
    const monthInput = document.getElementById("filter-month");
    const salaryAmountInput = document.getElementById("salary-amount");
    const salaryDateInput = document.getElementById("salary-date");
    // const tableBody = document.getElementById("table-body");

    const mapGV = new Map();
    select.innerHTML = '';
    data.forEach(row => {
        if (!mapGV.has(row.idnhanvien)) {
            const opt = document.createElement("option");
            opt.value = row.idnhanvien;
            opt.textContent = row.tennhanvien;
            select.appendChild(opt);
            mapGV.set(row.idnhanvien, true);
        }
    });

    let lastFiltered = [];

    btnFilter.onclick = () => {
        const gv = select.value;
        const month = monthInput.value;
        const filtered = data.filter(row => {
            const d = new Date(row.thoigianbatdau);
            return (!gv || row.idnhanvien == gv) &&
                   (!month || d.toISOString().slice(0, 7) === month);
        });

        lastFiltered = filtered;

        let totalMinutes = 0;
        let totalLuong = 0;
        // tableBody.innerHTML = '';

        filtered.forEach(r => {
            const mins = getMinutes(r.thoigianbatdau, r.thoigianketthuc);
            totalMinutes += mins;
            const dongia = parseFloat(r.dongia || 0);
            totalLuong += (mins / 60) * dongia;
            // tableBody.innerHTML += `
            //     <tr>
            //         <td>${formatDate(r.thoigianbatdau)}</td>
            //         <td>${r.tenkhoahoc}</td>
            //         <td>${r.hinhthuc || 'Offline'}</td>
            //         <td>${formatTime(r.thoigianbatdau)}</td>
            //         <td>${formatTime(r.thoigianketthuc)}</td>
            //         <td>${mins}</td>
            //     </tr>
            // `;
        });

        // document.getElementById("total-buoi").textContent = filtered.length;
        // document.getElementById("total-gio").textContent = (totalMinutes / 60).toFixed(2);
        salaryAmountInput.value = totalLuong.toLocaleString('vi-VN');
    };

    btnCreate.onclick = async () => {
        const idnhanvien = select.value;
        const thoigianlap = salaryDateInput.value;
        const thanhtienStr = salaryAmountInput.value.replace(/\./g, '').replace(/đ/g, '');
        const thanhtien = parseFloat(thanhtienStr);

        // if (!idnhanvien || !thoigianlap || isNaN(thanhtien) || thanhtien <= 0) {
        //     alert("Vui lòng lọc giảng viên và nhập đầy đủ thông tin.");
        //     return;
        // }

        const hoadon = {
            tenhoadon: "Lương giảng viên",
            thoigianlap,
            thanhtien,
            idhocvien :idnhanvien,
            loai: 0,
            idkhoahoc: 0,
            giamgia: 0
             
        };
        // alert("sai gi");
        console.log(hoadon);
        try {
            await addHoaDon(hoadon);
            alert("Đã tạo hóa đơn lương giảng viên thành công!");
            salaryAmountInput.value = '';
            salaryDateInput.value = '';
            renderHoaDonTable(currentPage);
        } catch (err) {
            console.error(err);
            alert("Lỗi khi tạo hóa đơn.");
        }
    };
}


function getMinutes(start, end) {
    return (new Date(end) - new Date(start)) / (1000 * 60);
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('vi-VN');
}

function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}
