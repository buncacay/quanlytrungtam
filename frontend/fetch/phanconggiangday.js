import { fetchGiangVien, fetchKhoaHoc, fetchChiTietNhanVien } from './get.js';
import { UpdateChiTietNhanVien } from './update.js';
import { addChiTietNhanVien } from './add.js';
import { removeChiTietNhanVien } from './delete.js';

let isEditingAssignment = false;
let editingAssignment = null;

document.addEventListener('DOMContentLoaded', async function () {
  const teacher = document.getElementById('teacher');
  const course = document.getElementById('class');

  // Load danh sách giảng viên
  teacher.innerHTML = '';
  const gv = await fetchGiangVien();
  gv.forEach(giaovien => {
    const opt = document.createElement('option');
    opt.textContent = giaovien.tennhanvien;
    opt.value = giaovien.idnhanvien;
    teacher.appendChild(opt);
  });

  // Load danh sách khóa học
  course.innerHTML = '';
  const khoahoc = await fetchKhoaHoc();
  khoahoc.forEach(kh => {
    const opt = document.createElement('option');
    opt.textContent = kh.tenkhoahoc;
    opt.value = kh.idkhoahoc;
    course.appendChild(opt);
  });

  await showAssignments();
});

document.getElementById('phancong').addEventListener('click', async function (event) {
  event.preventDefault();

  const gv = document.getElementById('teacher').value;
  const kh = document.getElementById('class').value;
  const begin = document.getElementById('begin').value;
  const end = document.getElementById('end').value;
  const dongia = document.getElementById('dongia').value;

  const data = {
    idnhanvien: gv,
    idkhoahoc: kh,
    thoigianbatdau: begin,
    thoigianketthuc: end,
    dongia: dongia
  };

  try {
    if (isEditingAssignment && editingAssignment) {
      const result = await UpdateChiTietNhanVien(data);
      if (result) alert('Cập nhật phân công thành công!');
    } else {
      const result = await addChiTietNhanVien(data);
      if (result) alert('Phân công thành công!');
    }

    isEditingAssignment = false;
    editingAssignment = null;
    document.getElementById('phancong').textContent = 'Phân công';
    await showAssignments();
  } catch (error) {
    console.error('Lỗi:', error);
  }
});

async function showAssignments() {
  const container = document.getElementById('list');
  container.innerHTML = '';

  const assignments = await fetchChiTietNhanVien();

  const keyword = document.getElementById('search-keyword')?.value.toLowerCase() || '';
  const searchThang = document.getElementById('search-thang')?.value;

  const filtered = assignments.filter(pc => {
    const matchKeyword =
      !keyword ||
      pc.tennhanvien?.toLowerCase().includes(keyword) ||
      pc.tenkhoahoc?.toLowerCase().includes(keyword);

    const matchThang = !searchThang || pc.thoigianbatdau?.slice(0, 7) === searchThang;

    return matchKeyword && matchThang;
  });

  const table = document.createElement('table');
  table.className = 'w-full table-auto border-collapse border border-gray-300';

  const thead = document.createElement('thead');
  thead.className = 'bg-gray-100';
  thead.innerHTML = `
    <tr>
      <th class="border border-gray-300 px-4 py-2">Tên nhân viên</th>
      <th class="border border-gray-300 px-4 py-2">Tên khóa học</th>
      <th class="border border-gray-300 px-4 py-2">Thời gian bắt đầu</th>
      <th class="border border-gray-300 px-4 py-2">Thời gian kết thúc</th>
      <th class="border border-gray-300 px-4 py-2">Đơn giá</th>
      <th class="border border-gray-300 px-4 py-2">Thao tác</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  tbody.className = 'text-center';

  filtered.forEach(pc => {
    const encoded = encodeURIComponent(JSON.stringify(pc));
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border border-gray-300 px-4 py-2">${pc.tennhanvien}</td>
      <td class="border border-gray-300 px-4 py-2">${pc.tenkhoahoc}</td>
      <td class="border border-gray-300 px-4 py-2">${pc.thoigianbatdau}</td>
      <td class="border border-gray-300 px-4 py-2">${pc.thoigianketthuc}</td>
      <td class="border border-gray-300 px-4 py-2">${pc.dongia}</td>
      <td class="border border-gray-300 px-4 py-2">
        <button onclick="editAssignment('${encoded}')" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Sửa</button>
        <button onclick="remove('${encoded}')" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Xóa</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

function editAssignment(encodedData) {
  const data = JSON.parse(decodeURIComponent(encodedData));
  isEditingAssignment = true;
  editingAssignment = data;

  document.getElementById('teacher').value = data.idnhanvien;
  document.getElementById('class').value = data.idkhoahoc;
  document.getElementById('begin').value = data.thoigianbatdau;
  document.getElementById('end').value = data.thoigianketthuc;
  document.getElementById('dongia').value = data.dongia;

  document.getElementById('phancong').textContent = 'Lưu chỉnh sửa';
}

async function remove(encodedData) {
  const data = JSON.parse(decodeURIComponent(encodedData));
  const result = await removeChiTietNhanVien(data);
  if (result) {
    alert('Xóa thành công!');
    await showAssignments();
  }
}

// Gắn lên window để gọi từ HTML onclick
window.editAssignment = editAssignment;
window.remove = remove;

// Xử lý lọc
document.getElementById('btn-filter-assignment').addEventListener('click', showAssignments);
document.getElementById('btn-clear-filter').addEventListener('click', () => {
  document.getElementById('search-keyword').value = '';
  document.getElementById('search-thang').value = '';
  showAssignments();
});
