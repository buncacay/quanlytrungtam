import { fetchGiangVien, fetchKhoaHoc, fetchChiTietNhanVien } from './get.js';
import { UpdateChiTietNhanVien } from './update.js';
import {addChiTietNhanVien} from './add.js';
import {removeChiTietNhanVien} from './delete.js';

let isEditingAssignment = false;
let editingAssignment = null;

document.addEventListener('DOMContentLoaded', async function () {
  const teacher = document.getElementById('teacher');
  const course = document.getElementById('class');

  teacher.innerHTML = '';
  const gv = await fetchGiangVien();
  gv.forEach(giaovien => {
    const opt = document.createElement('option');
    opt.textContent = giaovien.tennhanvien;
    opt.value = giaovien.idnhanvien;
    teacher.appendChild(opt);
  });

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

// Xử lý phân công hoặc chỉnh sửa

const btnPhanCong = document.getElementById('phancong');
btnPhanCong.addEventListener('click', async function (event) {
event.preventDefault();
  alert("tr");
   try {
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
  console.log(data);
  
    if (isEditingAssignment && editingAssignment) {
      const result = await UpdateChiTietNhanVien(data);
      if (result) alert('Cập nhật phân công thành công!');
    } else {
      const result = await addChiTietNhanVien(data);
      if (result) alert('Phân công thành công!');
    }

    isEditingAssignment = false;
    editingAssignment = null;
    btnPhanCong.textContent = 'Phân công';
    await showAssignments();
  } 
  catch (error) {
    console.error('Lỗi:', error);
  }
});

async function showAssignments() {
  const container = document.getElementById('list');
  container.innerHTML = ''; // Xóa nội dung cũ

  const assignments = await fetchChiTietNhanVien(); // Gọi API danh sách phân công

  // Tạo bảng
  const table = document.createElement('table');
  table.className = 'w-full table-auto border-collapse border border-gray-300';

  // Tạo phần thead
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

  // Tạo phần tbody
  const tbody = document.createElement('tbody');
  tbody.className = 'text-center';

  assignments.forEach(pc => {
    const row = document.createElement('tr');
    const encoded = encodeURIComponent(JSON.stringify(pc));

    row.innerHTML = `
      <td class="border border-gray-300 px-4 py-2">${pc.tennhanvien}</td>
      <td class="border border-gray-300 px-4 py-2">${pc.tenkhoahoc}</td>
      <td class="border border-gray-300 px-4 py-2">${pc.thoigianbatdau}</td>
      <td class="border border-gray-300 px-4 py-2">${pc.thoigianketthuc}</td>
      <td class="border border-gray-300 px-4 py-2">${pc.dongia}</td>
      <td class="border border-gray-300 px-4 py-2">
        <button onclick="editAssignment('${encoded}')" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          Sửa
        </button>
        <button onclick="remove('${encoded}')" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          Xóa
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

// Hàm chỉnh sửa phân công
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
   const result = await removeChiTietNhanVien(data);
      if (result) {
        alert('Xóa thành công!');
        await showAssignments();
      }

}

// Đăng ký cho HTML gọi từ window
window.editAssignment = editAssignment;
window.remove = remove;