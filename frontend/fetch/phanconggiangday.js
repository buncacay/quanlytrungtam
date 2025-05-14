import { fetchGiangVien, fetchKhoaHoc, fetchChiTietNhanVien } from './get.js';
import { UpdateChiTietNhanVien } from './update.js';
import { addChiTietNhanVien } from './add.js';
import { removeChiTietNhanVien } from './delete.js';

let isEditingAssignment = false;
let editingAssignment = null;
let idKhoaHocFromURL = null;

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  idKhoaHocFromURL = params.get('idkhoahoc');

  if (!idKhoaHocFromURL) {
    renderAssignmentForm();
    await populateDropdowns();
  }

  await showAssignments();
});

function renderAssignmentForm() {
  const container = document.getElementById('phancong');
  container.innerHTML = `
    <h2>Gán giảng viên cho lớp học</h2>
    <form id="assignmentForm">
      <div class="form-group">
        <label for="teacher">Chọn giảng viên:</label>
        <select id="teacher" name="teacher" required></select>
      </div>
      <div class="form-group">
        <label for="class">Chọn lớp học:</label>
        <select id="class" name="class" required></select>
      </div>
      <div class="form-group">
        <label for="dongia">Đơn giá</label>
        <input type="number" id="dongia" required />

        <label for="begin">Giờ bắt đầu</label>
        <input type="datetime-local" id="begin" required />

        <label for="end">Giờ kết thúc</label>
        <input type="datetime-local" id="end" required />
      </div>
      <button type="button" class="btn-submit" id="btnPhanCong">Phân công</button>
    </form>
  `;

  document.getElementById('btnPhanCong').addEventListener('click', handleAssignmentSubmit);
}

async function populateDropdowns() {
  try {
    const teacherSelect = document.getElementById('teacher');
    const classSelect = document.getElementById('class');

    const giangVienList = await fetchGiangVien();
    console.log(giangVienList);
    giangVienList[0].forEach(gv => {
      const option = document.createElement('option');
      option.value = gv.idnhanvien;
      option.textContent = gv.tennhanvien;
      teacherSelect.appendChild(option);
    });

    const khoaHocList = await fetchKhoaHoc();
    khoaHocList.forEach(kh => {
      const option = document.createElement('option');
      option.value = kh.idkhoahoc;
      option.textContent = kh.tenkhoahoc;
      classSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Lỗi khi tải danh sách:', err);
  }
}

async function handleAssignmentSubmit() {
  const data = {
    idnhanvien: document.getElementById('teacher').value,
    idkhoahoc: document.getElementById('class').value,
    thoigianbatdau: document.getElementById('begin').value,
    thoigianketthuc: document.getElementById('end').value,
    dongia: document.getElementById('dongia').value,
  };

  try {
    if (isEditingAssignment && editingAssignment) {
      await UpdateChiTietNhanVien({ ...editingAssignment, ...data });
      alert('Cập nhật phân công thành công!');
    } else {
      await addChiTietNhanVien(data);
      alert('Phân công thành công!');
    }

    clearForm();
    await showAssignments();
  } catch (err) {
    console.error('Lỗi phân công:', err);
    alert('Đã có lỗi xảy ra khi phân công.');
  }
}

function clearForm() {
  document.getElementById('assignmentForm').reset();
  document.getElementById('btnPhanCong').textContent = 'Phân công';
  isEditingAssignment = false;
  editingAssignment = null;
}

async function showAssignments() {
  const container = document.getElementById('list');
  container.innerHTML = '';

  const allAssignments = await fetchChiTietNhanVien();

  const keyword = document.getElementById('search-keyword')?.value?.toLowerCase() || '';
  const searchThang = document.getElementById('search-thang')?.value || '';

  // 👉 Nếu có idkhoahoc trên URL, chỉ lấy phân công của khóa học đó
  const filtered = allAssignments.filter(item => {
    const matchKhoaHoc = !idKhoaHocFromURL || item.idkhoahoc === idKhoaHocFromURL;
    const matchKeyword = !keyword || item.tennhanvien?.toLowerCase().includes(keyword) || item.tenkhoahoc?.toLowerCase().includes(keyword);
    const matchThang = !searchThang || item.thoigianbatdau?.slice(0, 7) === searchThang;

    return matchKhoaHoc && matchKeyword && matchThang;
  });

  const table = document.createElement('table');
  table.className = 'table-auto w-full border border-gray-300';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th class="border px-4 py-2">Tên giảng viên</th>
      <th class="border px-4 py-2">Tên khóa học</th>
      <th class="border px-4 py-2">Bắt đầu</th>
      <th class="border px-4 py-2">Kết thúc</th>
      <th class="border px-4 py-2">Đơn giá</th>
      <th class="border px-4 py-2">Thao tác</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  filtered.forEach(item => {
    const encoded = encodeURIComponent(JSON.stringify(item));
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border px-4 py-2">${item.tennhanvien}</td>
      <td class="border px-4 py-2">${item.tenkhoahoc}</td>
      <td class="border px-4 py-2">${item.thoigianbatdau}</td>
      <td class="border px-4 py-2">${item.thoigianketthuc}</td>
      <td class="border px-4 py-2">${item.dongia}</td>
      <td class="border px-4 py-2">
        <button onclick="editAssignment('${encoded}')" class="bg-blue-500 text-white px-3 py-1 rounded">Sửa</button>
        <button onclick="removeAssignment('${encoded}')" class="bg-red-500 text-white px-3 py-1 rounded">Xóa</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

window.editAssignment = function (encoded) {
  const data = JSON.parse(decodeURIComponent(encoded));
  editingAssignment = data;
  isEditingAssignment = true;

  document.getElementById('teacher').value = data.idnhanvien;
  document.getElementById('class').value = data.idkhoahoc;
  document.getElementById('dongia').value = data.dongia;
  document.getElementById('begin').value = data.thoigianbatdau;
  document.getElementById('end').value = data.thoigianketthuc;

  document.getElementById('btnPhanCong').textContent = '💾 Lưu chỉnh sửa';
};

window.removeAssignment = async function (encoded) {
  const data = JSON.parse(decodeURIComponent(encoded));
  if (!confirm('Bạn có chắc muốn xóa phân công này không?')) return;

  await removeChiTietNhanVien(data);
  alert('Đã xóa phân công.');
  await showAssignments();
};

// Lọc
document.getElementById('btn-filter-assignment')?.addEventListener('click', showAssignments);
document.getElementById('btn-clear-filter')?.addEventListener('click', () => {
  document.getElementById('search-keyword').value = '';
  document.getElementById('search-thang').value = '';
  showAssignments();
});
