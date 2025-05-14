// tthocvien.js
import {
  fetchKhoaHoc,
  fetchHocVien,
  fetchHoaDonWithIdhocvien,
  fetchChiTiethocvien,
  fetchDiemSovoiIdHocvien
} from './get.js';

import { addChiTietHocVien } from './add.js';

let id = "";
let khoahocDaDangKy = [];
let currentPage = 1;
const limit = 5;

document.addEventListener('DOMContentLoaded', async () => {
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
  await HienThiDiem(id, currentPage);
});

// ======================= Thông tin =======================
let user  ="";
async function HienThiThongTin(data) {
  const hocvien = data[0];
  user = hocvien.user;
    document.getElementById('student-info').innerHTML = `
    <h2>Thông tin học viên</h2>
    <p><strong>Họ và tên:</strong> ${hocvien.hoten}</p>
    <p><strong>Mã học viên:</strong> ${hocvien.idhocvien}</p>
    <p><strong>Số điện thoại:</strong> ${hocvien.sdt}</p>
  `;

  khoahocDaDangKy = data.map(item => item.idkhoahoc).filter(Boolean);

  const hoadon = await fetchHoaDonWithIdhocvien(hocvien.idhocvien);
  HienThiHoaDon(hoadon);

  const chitiethocvien = await fetchChiTiethocvien(hocvien.idhocvien);
  if (chitiethocvien?.length > 0) {
    HienThiKhoaHoc(chitiethocvien);
    const divdiem= document.getElementById('diem');
  divdiem.innerHTML=`
    <!-- Điểm số -->
    <div id="diemhocvien" class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h3 class="mb-0">📊 Điểm số của học viên</h3>
            <button onclick="themDiem()" class="btn btn-primary">Chỉnh sửa điểm</button>
        </div>
        <table class="table table-bordered table-striped">
            <thead class="table-light">
                <tr>
                    <th>Tên khóa học</th>
                    <th>Tên học viên</th>
                    <th>Kỳ thi</th>
                    <th>Điểm số</th>
                    <th>Ghi chú</th>
                  
                </tr>
            </thead>
            <tbody id="scoreTableBody">
                <!-- Dữ liệu điểm số sẽ hiển thị ở đây -->
            </tbody>
        </table>
    </div>

    <!-- Phân trang -->
    <div id="pagination" class="text-center my-3"></div>`;
  } else {
    document.getElementById('student-khoc').innerHTML = `
      <h3>📘 Chi tiết khóa học</h3>
      <div style="font-style: italic; color: gray;">Học viên chưa tham gia khóa học nào.</div>
    `;
  }
}

function HienThiHoaDon(hoadon) {
  const container = document.getElementById('student-hdon');
  if (!hoadon?.length) {
    container.innerHTML = '<p style="font-style: italic; color: gray;">Không có hóa đơn.</p>';
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
      <tbody>
        ${hoadon.map(h => `
          <tr>
            <td>${h.idhoadon}</td>
            <td>${h.tenhoadon}</td>
            <td>${h.thoigianlap}</td>
            <td>${h.thanhtien}</td>
            <td>
              <button onclick="editHoaDon(${h.idhoadon})">Edit</button>
              <button onclick="removeHoaDon(${h.idhoadon})">Remove</button>
              <button onclick="showMoreHoaDon(${h.idhoadon})">Show more</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>
  `;
}

function HienThiKhoaHoc(data) {
  document.getElementById('student-khoc').innerHTML = `
    <h3>Chi tiết khóa học</h3>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Mã KH</th>
          <th>Tên KH</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(kh => `
          <tr>
            <td>${kh.idkhoahoc}</td>
            <td>${kh.tenkhoahoc}</td>
            <td>
              <button onclick="editkhoahoc(${kh.idkhoahoc})">Edit</button>
              <button onclick="removekhoahoc(${kh.idkhoahoc})">Remove</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>
  `;
}

async function HienThiListKhoaHoc() {
  const select = document.getElementById('dky');
  const data = await fetchKhoaHoc();
  const list = Array.isArray(data.data) ? data.data : data;

  const chuaDangKy = list.filter(kh => !khoahocDaDangKy.includes(kh.idkhoahoc));
  select.innerHTML = chuaDangKy.length === 0
    ? `<option disabled>Đã đăng ký hết các khóa học.</option>`
    : chuaDangKy.map(kh => `<option value="${kh.idkhoahoc}">${kh.tenkhoahoc}</option>`).join('');
}
 function themDiem() {
        const params = new URLSearchParams(window.location.search);
        const idHocVien = params.get("id");

        if (idHocVien) {
            window.location.href = `diemso.html?idhocvien=${idHocVien}`;
        } else {
            alert("Không tìm thấy ID học viên.");
        }
}
async function themkhoahoc() {
  const idkhoahoc = document.getElementById('dky').value;
  if (!idkhoahoc) return alert("Vui lòng chọn khóa học.");

  const data = {
    idhocvien: id,
    idkhoahoc,
    ketquahoctap: "chua co",
    tinhtranghocphi: "chua co"
  };

  try {
    await addChiTietHocVien(data);
    const updatedHocVien = await fetchHocVien(id);
    await HienThiThongTin(updatedHocVien);
    await HienThiListKhoaHoc();
    alert("Thêm khóa học thành công!");
  } catch (error) {
    console.error(error);
    alert("Thêm khóa học thất bại.");
  }
}

// ======================= Hiển thị Điểm =======================

async function HienThiDiem(id, page = 1) {
  try {
    const res = await fetchDiemSovoiIdHocvien(id);
    const allScores = Array.isArray(res) ? res : [];
    const totalPages = Math.ceil(allScores.length / limit);
    const start = (page - 1) * limit;
    const scores = allScores.slice(start, start + limit);

    const tbody = document.getElementById('scoreTableBody');
    tbody.innerHTML = scores.map(score => `
      <tr>
        <td>${score.tenkhoahoc}</td>
        <td>${score.hoten}</td>
        <td>${score.kythi}</td>
        <td>${score.diemso}</td>
        <td>${score.ghichu || ''}</td>
       
      </tr>`).join('');

    renderScorePagination(page, totalPages);
  } catch (error) {
    console.error("Lỗi khi tải điểm:", error);
  }
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const scoreId = e.target.getAttribute("data-id");
    window.location.href = `diemso.html?idhocvien=${scoreId}`;
  }
});

function renderScorePagination(currentPage, totalPages) {
  const container = document.getElementById('pagination');
  container.innerHTML = '';

  const prevBtn = createPaginationButton("« Trước", currentPage > 1, () => HienThiDiem(id, currentPage - 1));
  container.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = createPaginationButton(i, true, () => HienThiDiem(id, i));
    if (i === currentPage) btn.classList.add('active');
    container.appendChild(btn);
  }

  const nextBtn = createPaginationButton("Sau »", currentPage < totalPages, () => HienThiDiem(id, currentPage + 1));
  container.appendChild(nextBtn);
}

function createPaginationButton(text, enabled, onClick) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.disabled = !enabled;
  btn.className = 'pagination-button btn btn-outline-primary btn-sm m-1';
  btn.onclick = onClick;
  return btn;
}

// ======================= Gắn hàm toàn cục =======================
window.themkhoahoc = themkhoahoc;
// window.remove = async function () {
//   if (confirm("Bạn có chắc muốn xóa học viên?")) {
//     await 
//   }
// };

async function editHoaDon(id){
window.location.href=`hoadon.html?idhoadon=${id}`;
}
window.edit = () => window.location.href = `qltaikhoan.html?user=${user}&role=0`;
window.editkhoahoc = id => alert("Edit khóa học: " + id);
window.removekhoahoc = id => alert("Remove khóa học: " + id);
window.editHoaDon = editHoaDon;
window.removeHoaDon = id => alert("Remove hóa đơn: " + id);
window.showMoreHoaDon = id => alert("Chi tiết thêm hóa đơn: " + id);
window.themDiem = themDiem;
