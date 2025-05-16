import {fetchDanhMuc, fetchDanhMucByid} from './get.js';

let danhmucs = [];

// Lấy danh sách từ server
async function loadDanhMuc() {
  const data = await fetchDanhMuc();
//   const data = await res.json(); // Lấy dữ liệu JSON từ response
  console.log(data);  // Kiểm tra kết quả dữ liệu nhận được
  danhmucs = data;   // Gán dữ liệu cho mảng danhmucs
  renderTable();     // Gọi renderTable để hiển thị dữ liệu
}

// Hiển thị dữ liệu lên bảng
function renderTable() {
  const tbody = document.getElementById("danhmucTable");
  tbody.innerHTML = "";
  
  if (danhmucs && danhmucs.length > 0) {  // Kiểm tra mảng không rỗng
    danhmucs.forEach(dm => {
       
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${dm.iddanhmuc}</td>
        <td>${dm.tendanhmuc}</td>
        <td>
          <button onclick="suaDanhMuc(${dm.iddanhmuc})">Sửa</button>
          <button onclick="xoaDanhMuc(${dm.iddanhmuc})">Xóa</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } else {
    tbody.innerHTML = "<tr><td colspan='3'>Không có danh mục nào</td></tr>"; // Hiển thị khi không có dữ liệu
  }
}


window.themHoacCapNhat=themHoacCapNhat;
// Thêm hoặc cập nhật danh mục
async function themHoacCapNhat() {
  const ten = document.getElementById("tendanhmuc").value.trim();
  const id = document.getElementById("iddanhmuc").value;

  const payload = {
    iddanhmuc: id,
    tendanhmuc: ten,
    trangthai : 1
  };

  const method = id ? 'PUT' : 'POST';

  await fetch('http://localhost/quanlytrungtam/backend/controller/danhmuccontroller.php', {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  document.getElementById("iddanhmuc").value = "";
  document.getElementById("tendanhmuc").value = "";
  await loadDanhMuc(); // Gọi lại hàm để tải lại danh sách
}

window.suaDanhMuc = suaDanhMuc;
// Chọn danh mục để sửa
async function suaDanhMuc(id) {
  const res = await fetchDanhMucByid(id);
  console.log(res);

    document.getElementById("iddanhmuc").value = res[0].iddanhmuc;
    document.getElementById("tendanhmuc").value = res[0].tendanhmuc;
  
}
window.xoaDanhMuc = xoaDanhMuc;
// Xóa danh mục
async function xoaDanhMuc(id) {
  if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
    await fetch('http://localhost/quanlytrungtam/backend/controller/danhmuccontroller.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ iddanhmuc: id })
    });
    await loadDanhMuc(); // Gọi lại hàm để tải lại danh sách
  }
}

// Tải dữ liệu khi trang load
window.onload = loadDanhMuc;
