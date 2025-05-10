import { fetchHoaDon } from './get.js';

const tbody = document.getElementById('invoice-table-body');
const doanhThuEl = document.getElementById('doanhthu');
const chiPhiEl = document.getElementById('chiphi');
const loiNhuanEl = document.getElementById('loinhuan');

const rowsPerPage = 5;
let currentPage = 1;
let allData = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    allData = await fetchHoaDon();
    renderTable();
    updateSummary();
    updateChart(allData);
    renderPagination();
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
  }
});

function renderTable() {
  tbody.innerHTML = '';
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = allData.slice(start, end);

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

  allData.forEach(item => {
    const tien = parseFloat(item.thanhtien || 0);
    if (item.loai === '1') doanhThu += tien;
    else chiPhi += tien;
  });

  doanhThuEl.textContent = doanhThu.toLocaleString('vi-VN') + ' VND';
  chiPhiEl.textContent = chiPhi.toLocaleString('vi-VN') + ' VND';
  loiNhuanEl.textContent = (doanhThu - chiPhi).toLocaleString('vi-VN') + ' VND';
}

function renderPagination() {
  const totalPages = Math.ceil(allData.length / rowsPerPage);
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Trang trước';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    currentPage--;
    renderTable();
    renderPagination();
  };

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Trang sau';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    currentPage++;
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
    if (isRevenue) {
      monthMap[month].doanhthu += tien;
    } else {
      monthMap[month].chiphi += tien;
    }
  });

  const labels = Object.keys(monthMap).sort();
  const doanhThuData = labels.map(m => monthMap[m].doanhthu);
  const chiPhiData = labels.map(m => monthMap[m].chiphi);

  const config = {
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
  };

  const ctx = document.getElementById('financialChart').getContext('2d');
  new Chart(ctx, config);
}
