import { fetchKhoaHoc, fetchHocVien, fetchHoaDonWithId, fetchChiTiethocvien } from './get.js';
import { addChiTietHocVien } from './add.js';

let id = "";
let khoahocDaDangKy = [];

document.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(window.location.search);
    id = params.get('id');

    if (!id) {
        alert("Không tìm thấy ID học viên.");
        return;
    }

    const data = await fetchHocVien(id);
    if (!data || data.length === 0) {
        alert("Không tìm thấy thông tin học viên.");
        return;
    }

    await HienThiThongTin(data);
    await HienThiListKhoaHoc();
});

async function remove() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (confirm("Bạn có chắc chắn muốn xóa học viên này không?")) {
        try {
            const res = await fetch(`http://localhost/quanlytrungtam/backend/controller/HocVienController.php?idhocvien=${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                const errMsg = await res.text();
                alert("Xóa thất bại: " + errMsg);
                return;
            }

            alert("Xóa thành công");
            window.location.href = "danhsachhocvien.html";
        } catch (error) {
            console.error("Lỗi khi xóa học viên:", error);
            alert("Đã xảy ra lỗi.");
        }
    }
}

async function edit() {
    window.location.href = `dangkyhocvien.html?id=${id}`;
}

async function HienThiThongTin(data) {
    const hocvien = data[0];

    document.getElementById('student-info').innerHTML = `
        <h2>Thông tin học viên</h2>
        <p><strong>Họ và tên:</strong> ${hocvien.hoten}</p>
        <p><strong>Mã học viên:</strong> ${hocvien.idhocvien}</p>
        <p><strong>Số điện thoại:</strong> ${hocvien.sdt}</p>
    `;

    // Lưu danh sách id khóa học đã đăng ký
    khoahocDaDangKy = data.map(item => item.idkhoahoc).filter(Boolean);

    const hoadon = await fetchHoaDonWithId(hocvien.idhocvien);
    HienThiHoaDon(hoadon);

    const chitiethocvien = await fetchChiTiethocvien(hocvien.idhocvien);
    if (chitiethocvien && chitiethocvien.length > 0) {
        HienThiKhoaHoc(chitiethocvien);
    } else {
        const container = document.getElementById('student-khoc');
        container.innerHTML = `
            <h3 style="color: #2c3e50; margin-bottom: 10px;">📘 Chi tiết khóa học</h3>
            <div style="padding: 15px; background-color: #f8f9fa; border: 1px solid #ccc; border-radius: 5px; font-style: italic; color: #555;">
                <p>Học viên hiện chưa tham gia bất kỳ khóa học nào.</p>
            </div>
        `;
    }
}

function HienThiHoaDon(hoadon) {
    const container = document.getElementById('student-hdon');
    if (!hoadon || hoadon.length === 0) {
        container.innerHTML = '<p style="font-style: italic; color: gray;">Người dùng chưa có hóa đơn nào</p>';
        return;
    }

    container.innerHTML = `
        <h3>Chi tiết hóa đơn</h3>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Mã hóa đơn</th>
                    <th>Tên hóa đơn</th>
                    <th>Thời gian lập</th>
                    <th>Thành tiền</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody id="detail-body"></tbody>
        </table>
    `;

    const tbody = document.getElementById("detail-body");
    tbody.innerHTML = hoadon.map(item => `
        <tr>
            <td>${item.idhoadon}</td>
            <td>${item.tenhoadon}</td>
            <td>${item.thoigianlap}</td>
            <td>${item.thanhtien}</td>
            <td>
                <button onclick="editHoaDon(${item.idhoadon})">Edit</button>
                <button onclick="removeHoaDon(${item.idhoadon})">Remove</button>
                <button onclick="showMoreHoaDon(${item.idhoadon})">Show more</button>
            </td>
        </tr>
    `).join('');
}

function HienThiKhoaHoc(data) {
    const container = document.getElementById('student-khoc');

    container.innerHTML = `
        <h3>Chi tiết khóa học</h3>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Mã khóa học</th>
                    <th>Tên khóa học</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody id="tbody_khoahoc"></tbody>
        </table>
    `;

    const tbody = document.getElementById("tbody_khoahoc");
    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.idkhoahoc}</td>
            <td>${item.tenkhoahoc}</td>
            <td>
                <button onclick="editkhoahoc(${item.idkhoahoc})">Edit</button>
                <button onclick="removekhoahoc(${item.idkhoahoc})">Remove</button>
            </td>
        </tr>
    `).join('');
}

async function HienThiListKhoaHoc() {
    const selection = document.getElementById('dky');
    selection.innerHTML = '';

    const data = await fetchKhoaHoc();
    const list = Array.isArray(data.data) ? data.data : data;

    const chuaDangKy = list.filter(kh => !khoahocDaDangKy.includes(kh.idkhoahoc));

    if (chuaDangKy.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'Học viên đã đăng ký hết các khóa học.';
        option.disabled = true;
        selection.appendChild(option);
        return;
    }

    chuaDangKy.forEach(khoahoc => {
        const option = document.createElement('option');
        option.value = khoahoc.idkhoahoc;
        option.textContent = khoahoc.tenkhoahoc;
        selection.appendChild(option);
    });
}

async function themkhoahoc() {
    const selectedIdKhoaHoc = document.getElementById('dky').value;
    if (!selectedIdKhoaHoc) {
        alert("Vui lòng chọn một khóa học để đăng ký.");
        return;
    }

    const data2 = {
        idhocvien: id,
        idkhoahoc: selectedIdKhoaHoc,
        ketquahoctap: "chua co",
        tinhtranghocphi: "chua co"
    };

    try {
        const kq2 = await addChiTietHocVien(data2);
        console.log("Kết quả thêm:", kq2);

        // Cập nhật lại thông tin hiển thị
        const updatedHocVien = await fetchHocVien(id);
        await HienThiThongTin(updatedHocVien);

        const updatedChiTiet = await fetchChiTiethocvien(id);
        if (updatedChiTiet && updatedChiTiet.length > 0) {
            HienThiKhoaHoc(updatedChiTiet);
        }

        await HienThiListKhoaHoc();
        alert("Thêm khóa học thành công!");
    } catch (error) {
        console.error("Lỗi khi thêm khóa học:", error);
        alert("Thêm thất bại. Vui lòng thử lại.");
    }
}

// Gắn các hàm vào window để dùng trong HTML
window.themkhoahoc = themkhoahoc;
window.remove = remove;
window.edit = edit;

window.editkhoahoc = function (idkhoahoc) {
    window.location.href = `taovaquanlykhoahoc.html?idkhoahoc=${idkhoahoc}`;
};

window.removekhoahoc = function (id) {
    if (confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
        alert(`Chức năng xóa khóa học ${id} đang được phát triển.`);
    }
};

window.editHoaDon = function (id) {
    alert(`Chức năng chỉnh sửa hóa đơn ${id} đang được phát triển.`);
};

window.removeHoaDon = function (id) {
    if (confirm("Bạn có chắc chắn muốn xóa hóa đơn này không?")) {
        alert(`Chức năng xóa hóa đơn ${id} đang được phát triển.`);
    }
};

window.showMoreHoaDon = function (id) {
    alert(`Chi tiết thêm của hóa đơn ${id}...`);
};
