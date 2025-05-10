import { fetchChiTietNhanVien } from './get.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.getElementById('table-body');
  const selectGV = document.getElementById('filter-gv');
  const btnFilter = document.getElementById('btn-filter');
  const filterContainer = btnFilter.parentNode;

  // Thêm nút Bỏ lọc
  const btnClear = document.createElement('button');
  btnClear.textContent = 'Bỏ lọc';
  btnClear.className = 'ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500';
  filterContainer.appendChild(btnClear);

  // Container cho phân trang
  const pagination = document.createElement('div');
  pagination.className = 'flex justify-center gap-2 mt-4';
  document.querySelector('.overflow-x-auto').appendChild(pagination);

  const data = await fetchChiTietNhanVien();

  const giangVienMap = new Map();
  data.forEach(item => {
    if (!giangVienMap.has(item.idnhanvien)) {
      const option = document.createElement('option');
      option.value = item.idnhanvien;
      option.textContent = item.tennhanvien;
      selectGV.appendChild(option);
      giangVienMap.set(item.idnhanvien, true);
    }
  });

  let filteredData = [...data];
  let currentPage = 1;
  const pageSize = 10;

  function renderTablePage(page = 1) {
    const startIdx = (page - 1) * pageSize;
    const pageData = filteredData.slice(startIdx, startIdx + pageSize);
    tableBody.innerHTML = '';

    pageData.forEach(row => {
      const durationMinutes = getMinutes(row.thoigianbatdau, row.thoigianketthuc);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="p-2 border">${formatDate(row.thoigianbatdau)}</td>
        <td class="p-2 border">${row.tenkhoahoc}</td>
        <td class="p-2 border">${row.hinhthuc || 'Offline'}</td>
        <td class="p-2 border">${formatTime(row.thoigianbatdau)}</td>
        <td class="p-2 border">${formatTime(row.thoigianketthuc)}</td>
        <td class="p-2 border">${durationMinutes}</td>
      `;
      tableBody.appendChild(tr);
    });

    renderPagination(filteredData.length, page);
    calculateStats(filteredData);
  }

  function renderPagination(totalItems, page) {
    const totalPages = Math.ceil(totalItems / pageSize);
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '« Trước';
    prevBtn.disabled = page === 1;
    prevBtn.className = 'px-3 py-1 border rounded bg-white hover:bg-gray-100';
    prevBtn.onclick = () => {
      if (page > 1) {
        currentPage--;
        renderTablePage(currentPage);
      }
    };
    pagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = `px-3 py-1 border rounded ${i === page ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`;
      btn.onclick = () => {
        currentPage = i;
        renderTablePage(currentPage);
      };
      pagination.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Sau »';
    nextBtn.disabled = page === totalPages;
    nextBtn.className = 'px-3 py-1 border rounded bg-white hover:bg-gray-100';
    nextBtn.onclick = () => {
      if (page < totalPages) {
        currentPage++;
        renderTablePage(currentPage);
      }
    };
    pagination.appendChild(nextBtn);
  }

  function applyFilter() {
    const gv = selectGV.value;
    const start = document.getElementById('filter-start').value;
    const end = document.getElementById('filter-end').value;

    filteredData = data.filter(row => {
      const date = new Date(row.thoigianbatdau);
      const matchGV = !gv || row.idnhanvien == gv;
      const matchStart = !start || date >= new Date(start + 'T00:00:00');
      const matchEnd = !end || date <= new Date(end + 'T23:59:59');
      return matchGV && matchStart && matchEnd;
    });

    currentPage = 1;
    renderTablePage(currentPage);
  }

  btnFilter.addEventListener('click', applyFilter);

  btnClear.addEventListener('click', () => {
    document.getElementById('filter-start').value = '';
    document.getElementById('filter-end').value = '';
    selectGV.value = '';
    filteredData = [...data];
    currentPage = 1;
    renderTablePage(currentPage);
  });

  function calculateStats(rows) {
    const totalBuoi = rows.length;
    const totalMinutes = rows.reduce((sum, r) => sum + getMinutes(r.thoigianbatdau, r.thoigianketthuc), 0);
    const totalLuong = rows.reduce((sum, r) => {
      const hours = getMinutes(r.thoigianbatdau, r.thoigianketthuc) / 60;
      return sum + hours * parseFloat(r.dongia || 0);
    }, 0);

    document.getElementById('total-buoi').textContent = totalBuoi;
    document.getElementById('total-gio').textContent = (totalMinutes / 60).toFixed(2);
    document.getElementById('total-luong').textContent = totalLuong.toLocaleString('vi-VN') + 'đ';
  }

  function getMinutes(start, end) {
    return (new Date(end) - new Date(start)) / (1000 * 60);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
  }

  function formatTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  // Khởi tạo lần đầu
  renderTablePage(currentPage);
});
