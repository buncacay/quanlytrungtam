import { fetchHoaDon } from './get.js';

const tbody = document.getElementById('invoice-table-body');
const doanhThuEl = document.getElementById('doanhthu');
const chiPhiEl = document.getElementById('chiphi');
const loiNhuanEl = document.getElementById('loinhuan');
const monthFilter = document.getElementById('monthFilter');
const exportBtn = document.getElementById('exportBtn');
const paginationContainer = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput'); // 👈 thêm phần tử ô tìm kiếm

const rowsPerPage = 5;
let currentPage = 1;
let allData = [];
let filteredData = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    allData = await fetchHoaDon();
    filteredData = allData;
    renderTable();
    updateSummary();
    updateChart(filteredData);
    renderPagination();
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
  }
});

monthFilter.addEventListener('change', applyFilters);
searchInput.addEventListener('input', applyFilters); // 👈 sự kiện tìm kiếm

exportBtn.addEventListener('click', () => {
  const wsData = [
    ['Ngày', 'Loại', 'Học viên / Diễn giải', 'Khóa học', 'Số tiền (VND)'],
    ...filteredData.map(item => [
      new Date(item.thoigianlap).toLocaleDateString('vi-VN'),
      item.loai === '1' ? 'Doanh thu' : 'Chi phí',
      item.hoten || '---',
      item.tenkhoahoc || '---',
      parseFloat(item.thanhtien || 0)
    ])
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'BaoCaoTaiChinh');
  XLSX.writeFile(wb, 'BaoCaoTaiChinh.xlsx');
});

function applyFilters() {
  const selectedMonth = monthFilter.value;
  const searchText = searchInput.value.toLowerCase();

  filteredData = allData.filter(item => {
    const date = new Date(item.thoigianlap);
    const itemMonth = date.toISOString().slice(0, 7);
    const matchesMonth = !selectedMonth || itemMonth === selectedMonth;
    const matchesSearch =
      !searchText ||
      (item.hoten && item.hoten.toLowerCase().includes(searchText)) ||
      (item.tenkhoahoc && item.tenkhoahoc.toLowerCase().includes(searchText));
    return matchesMonth && matchesSearch;
  });

  currentPage = 1;
  renderTable();
  updateSummary();
  renderPagination();
  updateChart(filteredData);
}

function renderTable() {
  tbody.innerHTML = '';
  const start = (currentPage - 1) * rowsPerPage;
  const pageData = filteredData.slice(start, start + rowsPerPage);

  pageData.forEach(item => {
    const row = document.createElement('tr');
    const ngay = new Date(item.thoigianlap).toLocaleDateString('vi-VN');
    const loai = item.loai === '1' ? 'Doanh thu' : 'Chi phí';
    const tien = parseFloat(item.thanhtien || 0);

    row.innerHTML = `
      <td>${ngay}</td>
      <td>${loai}</td>
      <td>${item.hoten || '---'}</td>
      <td>${item.tenkhoahoc || '---'}</td>
      <td>${tien.toLocaleString('vi-VN')}</td>
    `;
    tbody.appendChild(row);
  });
}

function updateSummary() {
  let doanhThu = 0;
  let chiPhi = 0;

  filteredData.forEach(item => {
    const tien = parseFloat(item.thanhtien || 0);
    if (item.loai === '1') doanhThu += tien;
    else chiPhi += tien;
  });

  doanhThuEl.textContent = doanhThu.toLocaleString('vi-VN') + ' VND';
  chiPhiEl.textContent = chiPhi.toLocaleString('vi-VN') + ' VND';
  loiNhuanEl.textContent = (doanhThu - chiPhi).toLocaleString('vi-VN') + ' VND';
}

function renderPagination() {
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Trang trước';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) currentPage--;
    renderTable();
    renderPagination();
  };

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Trang sau';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) currentPage++;
    renderTable();
    renderPagination();
  };

  const pageInfo = document.createElement('span');
  pageInfo.textContent = `Trang ${currentPage} / ${totalPages}`;
  pageInfo.style.margin = '0 10px';

  paginationContainer.appendChild(prevBtn);
  paginationContainer.appendChild(pageInfo);
  paginationContainer.appendChild(nextBtn);
}

function updateChart(data) {
  const monthMap = {};

  data.forEach(item => {
    const date = new Date(item.thoigianlap);
    const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const tien = parseFloat(item.thanhtien || 0);
    const isRevenue = item.loai === '1';

    if (!monthMap[month]) monthMap[month] = { doanhthu: 0, chiphi: 0 };
    if (isRevenue) monthMap[month].doanhthu += tien;
    else monthMap[month].chiphi += tien;
  });

  const labels = Object.keys(monthMap).sort();
  const doanhThuData = labels.map(m => monthMap[m].doanhthu);
  const chiPhiData = labels.map(m => monthMap[m].chiphi);

  const ctx = document.getElementById('financialChart')?.getContext('2d');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Doanh thu',
          data: doanhThuData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        },
        {
          label: 'Chi phí',
          data: chiPhiData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Tổng doanh thu & chi phí theo tháng' },
        legend: { position: 'top' }
      }
    }
  });
}
